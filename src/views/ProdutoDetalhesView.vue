<script lang="ts">
import { defineComponent } from 'vue'
import { useProdutosStore } from '@/stores/produtos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Produto } from '@/types'

export default defineComponent({
  name: 'ProdutoDetalhesView',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      produto: null as Produto | null,
      loading: false,
      error: null as string | null
    }
  },
  computed: {
    produtosStore() {
      return useProdutosStore()
    }
  },
  async mounted() {
    await this.loadProduto()
  },
  methods: {
    async loadProduto() {
      this.loading = true
      this.error = null
      
      try {
        // Usar o ID como string ou number conforme recebido
        console.log(this.id)
        this.produto = await this.produtosStore.buscarProdutoPorId(this.id)
        this.produto = this.produto.data
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar produto'
        console.error('Erro ao carregar produto:', error)
      } finally {
        this.loading = false
      }
    },
    
    formatCurrency(value: number): string {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
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
    
    goBack() {
      this.$router.push('/produtos')
    }
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <Button variant="ghost" @click="goBack" class="mb-4">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para Produtos
      </Button>
    </div>

    <!-- Loading State -->
    <Card v-if="loading">
      <CardContent class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Carregando produto...</p>
      </CardContent>
    </Card>

    <!-- Error State -->
    <Card v-else-if="error">
      <CardContent class="p-8 text-center">
        <svg class="h-12 w-12 text-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-semibold mb-2 text-destructive">Erro ao carregar produto</h3>
        <p class="text-muted-foreground mb-4">{{ error }}</p>
        <Button @click="loadProduto">Tentar novamente</Button>
      </CardContent>
    </Card>

    <!-- Product Details -->
    <div v-else-if="produto" class="space-y-6">
      <!-- Main Info -->
      <Card>
        <CardHeader>
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle class="text-2xl">{{ produto.nome }}</CardTitle>
              <CardDescription v-if="produto.categoria" class="mt-2">
                <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {{ produto.categoria }}
                </span>
              </CardDescription>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-primary">{{ formatCurrency(produto.preco) }}</div>
              <div class="text-sm text-muted-foreground">Preço unitário</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="produto.descricao" class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Descrição</h3>
            <p class="text-muted-foreground leading-relaxed">{{ produto.descricao }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Additional Info -->
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Stock Info -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center space-x-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Estoque</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-center">
              <div :class="[
                'text-4xl font-bold mb-2',
                (produto.estoque || 0) > 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ produto.estoque || 0 }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ (produto.estoque || 0) > 0 ? 'Unidades disponíveis' : 'Produto em falta' }}
              </div>
              <div :class="[
                'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mt-2',
                (produto.estoque || 0) > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              ]">
                {{ (produto.estoque || 0) > 0 ? 'Em estoque' : 'Sem estoque' }}
              </div>
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
            <div v-if="produto.createdAt">
              <div class="text-sm font-medium">Criado em</div>
              <div class="text-sm text-muted-foreground">{{ formatDate(produto.createdAt) }}</div>
            </div>
            <div v-if="produto.updatedAt && produto.updatedAt !== produto.createdAt">
              <div class="text-sm font-medium">Última atualização</div>
              <div class="text-sm text-muted-foreground">{{ formatDate(produto.updatedAt) }}</div>
            </div>
            <div v-if="produto.id">
              <div class="text-sm font-medium">ID do produto</div>
              <div class="text-sm text-muted-foreground font-mono">#{{ produto.id }}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Actions -->
      <Card>
        <CardContent class="p-6">
          <div class="flex flex-col sm:flex-row gap-3">
            <Button @click="goBack" variant="outline" class="flex-1">
              <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar à Lista
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
