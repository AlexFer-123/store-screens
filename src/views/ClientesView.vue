<script lang="ts">
import { defineComponent } from 'vue'
import { useClientesStore } from '@/stores/clientes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { Pagination } from '@/components/ui/pagination'
import type { Cliente } from '@/types'

export default defineComponent({
  name: 'ClientesView',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
    // Pagination
  },
  data() {
    return {
      searchQuery: '',
      searchTimeout: null as NodeJS.Timeout | null
    }
  },
  computed: {
    clientesStore() {
      return useClientesStore()
    },
    clientes(): Cliente[] {
      return this.clientesStore.clientes
    },
    loading(): boolean {
      return this.clientesStore.loading
    },
    error(): string | null {
      return this.clientesStore.error
    },
    currentPage(): number {
      return this.clientesStore.currentPage
    },
    totalPages(): number {
      return this.clientesStore.totalPages
    },
    total(): number {
      return this.clientesStore.total
    }
  },
  async mounted() {
    await this.clientesStore.listarClientes()
  },
  methods: {
    onSearchChange() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      this.searchTimeout = setTimeout(() => {
        this.clientesStore.listarClientes(1, 10, this.searchQuery)
      }, 500)
    },
    
    async onPageChange(page: number) {
      await this.clientesStore.listarClientes(page, 10, this.searchQuery)
    },
    
    navigateToCadastro() {
      this.$router.push('/clientes/cadastrar')
    },
    
    navigateToDetalhes(id: string | number) {
      this.$router.push(`/clientes/${id}`)
    },
    
    clearError() {
      this.clientesStore.clearError()
    },
    
    formatPhone(phone: string): string {
      if (!phone) return ''
      // Simple phone formatting for Brazilian numbers
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
      } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
      }
      return phone
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Clientes</h1>
        <p class="text-muted-foreground">Gerencie todos os seus clientes</p>
      </div>
      <Button @click="navigateToCadastro" class="w-full sm:w-auto">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Novo Cliente
      </Button>
    </div>

    <!-- Search -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            v-model="searchQuery"
            placeholder="Buscar clientes..."
            @input="onSearchChange"
            class="flex-1"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Error Message -->
    <div v-if="error" class="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-md flex items-center justify-between">
      <span>{{ error }}</span>
      <Button variant="ghost" size="sm" @click="clearError">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>

    <!-- Loading State -->
    <Card v-if="loading">
      <CardContent class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Carregando clientes...</p>
      </CardContent>
    </Card>

    <!-- Clients Table -->
    <Card v-else-if="clientes.length > 0">
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
        <CardDescription>{{ total }} cliente(s) encontrado(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead class="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="cliente in clientes"
              :key="cliente.id"
              class="cursor-pointer hover:bg-muted/50"
              @click="navigateToDetalhes(cliente.id)"
            >
              <TableCell class="font-medium">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span class="text-sm font-medium text-primary">
                        {{ cliente.nome.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div class="font-semibold">{{ cliente.nome }}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <a :href="`mailto:${cliente.email}`" class="text-primary hover:underline" @click.stop>
                  {{ cliente.email }}
                </a>
              </TableCell>
              <TableCell>
                <span v-if="cliente.telefone" class="text-muted-foreground">
                  {{ formatPhone(cliente.telefone) }}
                </span>
                <span v-else class="text-muted-foreground">-</span>
              </TableCell>
              <TableCell>
                <span v-if="cliente.endereco" class="text-muted-foreground">
                  {{ cliente.endereco }}
                </span>
                <span v-else class="text-muted-foreground">-</span>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="sm" @click.stop="navigateToDetalhes(cliente.id)">
                  Ver detalhes
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <Card v-else>
      <CardContent class="p-8 text-center">
        <svg class="h-12 w-12 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 class="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
        <p class="text-muted-foreground mb-4">
          {{ searchQuery ? 'Tente ajustar sua busca ou' : '' }} comece cadastrando seu primeiro cliente.
        </p>
        <Button @click="navigateToCadastro">
          Cadastrar Cliente
        </Button>
      </CardContent>
    </Card>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center space-x-2">
      <Button 
        variant="outline" 
        :disabled="currentPage <= 1"
        @click="onPageChange(currentPage - 1)"
      >
        Anterior
      </Button>
      <span class="flex items-center px-4">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      <Button 
        variant="outline" 
        :disabled="currentPage >= totalPages"
        @click="onPageChange(currentPage + 1)"
      >
        Próxima
      </Button>
    </div>
  </div>
</template>
