<script lang="ts">
import { defineComponent } from 'vue'
import { useClientesStore } from '@/stores/clientes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/modal'
import  UpdateModalClient  from '@/components/ui/modal/UpdateModalClient.vue'
import type { Cliente } from '@/types'

export default defineComponent({
  name: 'ClienteDetalhesView',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    ConfirmModal,
    UpdateModalClient
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cliente: null as Cliente | null,
      loading: false,
      error: null as string | null,
      deleting: false,
      showDeleteModal: false,
      showUpdateModal: false,
      updating: false
    }
  },
  computed: {
    clientesStore() {
      return useClientesStore()
    }
  },
  async mounted() {
    await this.loadCliente()
  },
  methods: {
    async loadCliente() {
      this.loading = true
      this.error = null
      
      try {
        const response = await this.clientesStore.buscarClientePorId(this.id)
        console.log('Response loadCliente:', response) // Debug
        
        // Verificar se a resposta tem estrutura de data ou é direta
        if (response && response.data) {
          this.cliente = response.data
        } else {
          this.cliente = response
        }
        
        console.log('Cliente carregado:', this.cliente) // Debug
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar cliente'
        console.error('Erro ao carregar cliente:', error)
      } finally {
        this.loading = false
      }
    },
    
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    formatPhone(phone: string): string {
      if (!phone) return ''
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
      } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
      }
      return phone
    },
    
    goBack() {
      this.$router.push('/clientes')
    },
    
    openEmail() {
      if (this.cliente?.email) {
        window.location.href = `mailto:${this.cliente.email}`
      }
    },
    
    openPhone() {
      if (this.cliente?.telefone) {
        const cleaned = this.cliente.telefone.replace(/\D/g, '')
        window.location.href = `tel:+55${cleaned}`
      }
    },
    
    openDeleteModal() {
      this.showDeleteModal = true
    },

    openUpdateModal() {
      this.showUpdateModal = true
    },
    
    async confirmDelete() {
      if (!this.cliente?.id) return
      
      this.deleting = true
      
      try {
        await this.clientesStore.deletarCliente(this.cliente.id)
        this.showUpdateModal = false
        this.$router.push('/clientes')
      } catch (error: any) {
        this.showUpdateModal = false
        // Aqui poderia usar outro modal para mostrar o erro, mas por simplicidade mantemos alert
        alert('Erro ao deletar cliente: ' + (error.message || 'Erro desconhecido'))
      } finally {
        this.deleting = false
      }
    },
    
    cancelDelete() {
      this.showDeleteModal = false
    },
    
    async handleUpdateSuccess(clienteAtualizado?: Cliente) {
      this.showUpdateModal = false
      
      try {
        if (clienteAtualizado) {
          // Se recebeu dados atualizados do modal, usar diretamente
          this.cliente = clienteAtualizado
          console.log('Cliente atualizado recebido do modal:', this.cliente)
        } else {
          // Tentar buscar dados atualizados do store primeiro (mais eficiente)
          const clienteDoStore = this.clientesStore.clientes.find(c => c.id == this.id)
          if (clienteDoStore) {
            this.cliente = clienteDoStore
            console.log('Cliente atualizado do store:', this.cliente)
          } else {
            // Se não encontrar no store, recarregar do servidor
            console.log('Cliente não encontrado no store, recarregando do servidor...')
            await this.loadCliente()
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar cliente na interface:', error)
      }
      
      // Fallback: sempre recarregar dados do servidor para garantir sincronia
      // (remover esta linha se a atualização local funcionar corretamente)
      await this.loadCliente()
    },
    
    handleUpdateCancel() {
      this.showUpdateModal = false
    }
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <Button variant="ghost" @click="goBack">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para Clientes
      </Button>
      
      <div class="flex gap-2">
        
        <Button 
          v-if="cliente" 
          variant="outline" 
          size="sm"
          @click="openUpdateModal"
          :disabled="updating"
          class="text-black"
        >
          <svg v-if="!updating" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
          <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ deleting ? 'Editando...' : 'Editar' }}
        </Button>
        <Button 
          v-if="cliente" 
          variant="destructive" 
          size="sm"
          @click="openDeleteModal"
          :disabled="deleting"
          class="text-white"
        >
          <svg v-if="!deleting" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ deleting ? 'Deletando...' : 'Deletar' }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <Card v-if="loading">
      <CardContent class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Carregando cliente...</p>
      </CardContent>
    </Card>

    <!-- Error State -->
    <Card v-else-if="error">
      <CardContent class="p-8 text-center">
        <svg class="h-12 w-12 text-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-semibold mb-2 text-destructive">Erro ao carregar cliente</h3>
        <p class="text-muted-foreground mb-4">{{ error }}</p>
        <Button @click="loadCliente">Tentar novamente</Button>
      </CardContent>
    </Card>

    <!-- Client Details -->
    <div v-else-if="cliente" class="space-y-6">
      <!-- Main Info -->
      <Card>
        <CardHeader>
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="flex-shrink-0">
              <div class="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-2xl font-bold text-primary">
                  {{ cliente.nome.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            <div class="flex-1">
              <CardTitle class="text-2xl">{{ cliente.nome }}</CardTitle>
              <CardDescription class="text-lg mt-1">{{ cliente.email }}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <!-- Contact Info -->
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Contact Details -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center space-x-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contato</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Email -->
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">Email</div>
                <div class="text-sm text-muted-foreground">{{ cliente.email }}</div>
              </div>
              <Button variant="outline" size="sm" @click="openEmail">
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar
              </Button>
            </div>
            
            <!-- Phone -->
            <div v-if="cliente.telefone" class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">Telefone</div>
                <div class="text-sm text-muted-foreground">{{ formatPhone(cliente.telefone) }}</div>
              </div>
              <Button variant="outline" size="sm" @click="openPhone">
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Ligar
              </Button>
            </div>
            
            <!-- Address -->
            <div v-if="cliente.endereco">
              <div class="text-sm font-medium mb-1">Endereço</div>
              <div class="text-sm text-muted-foreground leading-relaxed">{{ cliente.endereco }}</div>
            </div>
            
            <!-- No additional info -->
            <div v-if="!cliente.telefone && !cliente.endereco" class="text-center py-4">
              <svg class="h-8 w-8 text-muted-foreground mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-muted-foreground">Informações de contato adicionais não disponíveis</p>
            </div>
          </CardContent>
        </Card>

        <!-- Timestamps -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center space-x-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Histórico</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="cliente.created">
              <div class="text-sm font-medium">Cliente desde</div>
              <div class="text-sm text-muted-foreground">{{ formatDate(cliente.created) }}</div>
            </div>
            <div v-if="cliente.updatedAt && cliente.updatedAt !== cliente.created">
              <div class="text-sm font-medium">Última atualização</div>
              <div class="text-sm text-muted-foreground">{{ formatDate(cliente.updatedAt) }}</div>
            </div>
            <div v-if="cliente.id">
              <div class="text-sm font-medium">ID do cliente</div>
              <div class="text-sm text-muted-foreground font-mono">#{{ cliente.id }}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Actions -->
      <Card>
        <CardContent>
          <div class="flex flex-col sm:flex-row gap-3">
            <Button @click="goBack" variant="outline" class="flex-1">
              <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar à Lista
            </Button>
            <Button v-if="cliente.email" @click="openEmail" class="flex-1">
              <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <ConfirmModal
      v-model:open="showDeleteModal"
      title="Deletar Cliente"
      :description="`Tem certeza que deseja deletar o cliente '${cliente?.nome}'?\n\nEsta ação não pode ser desfeita e todos os dados relacionados serão perdidos permanentemente.`"
      confirm-text="Deletar Cliente"
      cancel-text="Cancelar"
      variant="destructive"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <UpdateModalClient
      v-model:open="showUpdateModal"
      :cliente="cliente"
      @success="handleUpdateSuccess"
      @cancel="handleUpdateCancel"
    />
  </div>
</template>
