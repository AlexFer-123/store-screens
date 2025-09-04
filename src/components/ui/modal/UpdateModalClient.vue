<script lang="ts">
import { defineComponent } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toast } from '@/components/ui/toast'
import { useClientesStore } from '@/stores/clientes'
import type { Cliente } from '@/types'

export default defineComponent({
  name: 'UpdateModalClient',
  components: {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Button,
    Input,
    Label,
    Toast
  },
  props: {
    open: {
      type: Boolean,
      required: true
    },
    cliente: {
      type: Object as () => Cliente | null,
      default: null
    }
  },
  emits: ['update:open', 'success', 'cancel'],
  data() {
    return {
      form: {
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
      },
      loading: false,
      errors: {} as Record<string, string>,
      showToast: false,
      toastMessage: ''
    }
  },
  computed: {
    clientesStore() {
      return useClientesStore()
    }
  },
  watch: {
    cliente: {
      handler(newCliente) {
        if (newCliente) {
          this.form = {
            nome: newCliente.nome || '',
            email: newCliente.email || '',
            telefone: newCliente.telefone || '',
            endereco: newCliente.endereco || ''
          }
          this.errors = {}
        }
      },
      immediate: true
    },
    open(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    }
  },
  methods: {
    resetForm() {
      this.form = {
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
      }
      this.errors = {}
      this.showToast = false
    },
    
    validateForm() {
      this.errors = {}
      
      // Nome é obrigatório
      if (!this.form.nome.trim()) {
        this.errors.nome = 'Nome é obrigatório'
      }
      
      // Email é obrigatório e deve ter formato válido
      if (!this.form.email.trim()) {
        this.errors.email = 'Email é obrigatório'
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(this.form.email)) {
          this.errors.email = 'Email deve ter um formato válido'
        }
      }
      
      // Telefone (opcional, mas se preenchido deve ter formato válido)
      if (this.form.telefone.trim()) {
        const phoneRegex = /^[\d\s\(\)\-\+]+$/
        if (!phoneRegex.test(this.form.telefone)) {
          this.errors.telefone = 'Telefone deve conter apenas números, espaços, parênteses, hífen ou sinal de mais'
        }
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    showError(message: string) {
      this.toastMessage = message
      this.showToast = true
    },
    
    async handleSave() {
      if (!this.validateForm()) {
        const firstError = Object.values(this.errors)[0]
        this.showError(firstError)
        return
      }
      console.log(this.cliente)
      if (!this.cliente?.id) {
        this.showError('ID do cliente não encontrado')
        return
      }
      
      this.loading = true
      
              try {
          const dadosAtualizados = {
            nome: this.form.nome.trim(),
            email: this.form.email.trim()
          }
          
          console.log('Atualizando cliente com dados:', dadosAtualizados)
          const clienteAtualizado = await this.clientesStore.updateCliente(this.cliente.id, dadosAtualizados)
          console.log('Cliente atualizado:', clienteAtualizado)
          
          this.$emit('success', clienteAtualizado)
          this.$emit('update:open', false)
        } catch (error: any) {
        this.showError(error.message || 'Erro ao update cliente')
      } finally {
        this.loading = false
      }
    },
    
    handleCancel() {
      this.$emit('cancel')
      this.$emit('update:open', false)
    },
    
    handleOpenChange(open: boolean) {
      this.$emit('update:open', open)
      if (!open) {
        this.$emit('cancel')
      }
    }
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-3">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span>Editar Cliente</span>
        </DialogTitle>
      </DialogHeader>
      
      <div class="space-y-4 py-4">
        <!-- Nome -->
        <div class="space-y-2">
          <Label for="nome">Nome *</Label>
          <Input
            id="nome"
            v-model="form.nome"
            placeholder="Digite o nome do cliente"
            :class="{ 'border-red-500': errors.nome }"
          />
          <p v-if="errors.nome" class="text-sm text-red-500">{{ errors.nome }}</p>
        </div>
        
        <!-- Email -->
        <div class="space-y-2">
          <Label for="email">Email *</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Digite o email do cliente"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
        </div>
        
      </div>
      
      <DialogFooter class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button 
          variant="outline" 
          @click="handleCancel"
          :disabled="loading"
          class="flex-1 sm:flex-none"
        >
          Cancelar
        </Button>
        <Button 
          @click="handleSave"
          :disabled="loading"
          class="flex-1 sm:flex-none"
        >
          <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
        </Button>
      </DialogFooter>
    </DialogContent>
    
    <!-- Toast de Erro -->
    <Toast
      :show="showToast"
      :message="toastMessage"
      type="error"
      @close="showToast = false"
    />
  </Dialog>
</template>
