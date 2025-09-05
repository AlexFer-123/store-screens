<script lang="ts">
import { defineComponent } from 'vue'
import { useProdutosStore } from '@/stores/produtos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Produto } from '@/types'

export default defineComponent({
  name: 'ProdutosView',
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
  },
  data() {
    return {
      searchQuery: '',
      searchTimeout: null as NodeJS.Timeout | null
    }
  },
  computed: {
    produtosStore() {
      return useProdutosStore()
    },
    produtos(): Produto[] {
      return this.produtosStore.produtos
    },
    loading(): boolean {
      return this.produtosStore.loading
    },
    error(): string | null {
      return this.produtosStore.error
    },
    currentPage(): number {
      return this.produtosStore.currentPage
    },
    totalPages(): number {
      return this.produtosStore.totalPages
    },
    total(): number {
      return this.produtosStore.total
    }
  },
  async mounted() {
    await this.produtosStore.listarProdutos()
  },
  methods: {
    formatCurrency(value: number): string {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    },
    
    onSearchChange() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      this.searchTimeout = setTimeout(() => {
        this.produtosStore.listarProdutos(1, 10, this.searchQuery)
      }, 500)
    },
    
    async onPageChange(page: number) {
      await this.produtosStore.listarProdutos(page, 10, this.searchQuery)
    },
    
    navigateToCadastro() {
      this.$router.push('/produtos/cadastrar')
    },
    
    navigateToDetalhes(id: string | number) {
      this.$router.push(`/produtos/${id}`)
    },
    
    clearError() {
      this.produtosStore.clearError()
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Produtos</h1>
        <p class="text-muted-foreground">Gerencie todos os seus produtos</p>
      </div>
      <Button @click="navigateToCadastro" class="w-full sm:w-auto">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Novo Produto
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
            placeholder="Buscar produtos..."
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
        <p class="mt-4 text-muted-foreground">Carregando produtos...</p>
      </CardContent>
    </Card>

    <!-- Products Table -->
    <Card v-else-if="produtos.length > 0">
      <CardHeader>
        <CardTitle>Lista de Produtos</CardTitle>
        <CardDescription>{{ total }} produto(s) encontrado(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead class="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="produto in produtos"
              :key="produto.id"
              class="cursor-pointer hover:bg-muted/50"
              @click="navigateToDetalhes(produto.id)"
            >
              <TableCell class="font-medium">
                <div>
                  <div class="font-semibold">{{ produto.nome }}</div>
                  <div v-if="produto.descricao" class="text-sm text-muted-foreground truncate max-w-xs">
                    {{ produto.descricao }}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span v-if="produto.categoria" class="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {{ produto.categoria }}
                </span>
                <span v-else class="text-muted-foreground">-</span>
              </TableCell>
              <TableCell class="font-semibold">{{ formatCurrency(produto.preco) }}</TableCell>
              <TableCell>
                <span :class="[
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  (produto.estoque || 0) > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ produto.estoque || 0 }}
                </span>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="sm" @click.stop="navigateToDetalhes(produto.id)">
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
        <p class="text-muted-foreground mb-4">
          {{ searchQuery ? 'Tente ajustar sua busca ou' : '' }} comece cadastrando seu primeiro produto.
        </p>
        <Button @click="navigateToCadastro">
          Cadastrar Produto
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
