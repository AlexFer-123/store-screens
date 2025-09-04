<script lang="ts">
import { defineComponent } from 'vue'
import { useProdutosStore } from '@/stores/produtos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Produto } from '@/types'

interface FormData {
  nome: string
  descricao: string
  preco: string
  categoria: string
  estoque: string
}

export default defineComponent({
  name: 'ProdutosCadastrarView',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Label
  },
  data() {
    return {
      form: {
        nome: '',
        descricao: '',
        preco: '',
        categoria: '',
        estoque: ''
      } as FormData,
      errors: {} as Record<string, string>,
      submitting: false
    }
  },
  computed: {
    produtosStore() {
      return useProdutosStore()
    },
    isFormValid(): boolean {
      return !!(this.form.nome && this.form.preco && parseFloat(this.form.preco) > 0)
    }
  },
  methods: {
    validateForm(): boolean {
      this.errors = {}
      
      if (!this.form.nome.trim()) {
        this.errors.nome = 'Nome é obrigatório'
      }
      
      if (!this.form.preco) {
        this.errors.preco = 'Preço é obrigatório'
      } else if (parseFloat(this.form.preco) <= 0) {
        this.errors.preco = 'Preço deve ser maior que zero'
      }
      
      if (this.form.estoque && parseInt(this.form.estoque) < 0) {
        this.errors.estoque = 'Estoque não pode ser negativo'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async onSubmit() {
      if (!this.validateForm()) {
        return
      }
      
      this.submitting = true
      
      try {
        const produto: Omit<Produto, 'id' | 'created' | 'updatedAt'> = {
          nome: this.form.nome.trim(),
          descricao: this.form.descricao.trim() || undefined,
          preco: parseFloat(this.form.preco),
          categoria: this.form.categoria.trim() || undefined,
          estoque: this.form.estoque ? parseInt(this.form.estoque) : undefined
        }
        
        await this.produtosStore.cadastrarProduto(produto)
        
        // Redirect to products list on success
        this.$router.push('/produtos')
      } catch (error) {
        // Error is handled by the store
        console.error('Erro ao cadastrar produto:', error)
      } finally {
        this.submitting = false
      }
    },
    
    onCancel() {
      this.$router.push('/produtos')
    },
    
    clearError() {
      this.produtosStore.clearError()
    }
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <Button variant="ghost" @click="onCancel" class="mb-4">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </Button>
      <h1 class="text-3xl font-bold text-foreground">Cadastrar Produto</h1>
      <p class="text-muted-foreground">Adicione um novo produto ao seu catálogo</p>
    </div>

    <!-- Error Message -->
    <div v-if="produtosStore.error" class="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-md flex items-center justify-between">
      <span>{{ produtosStore.error }}</span>
      <Button variant="ghost" size="sm" @click="clearError">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>

    <!-- Form -->
    <Card>
      <CardHeader>
        <CardTitle>Informações do Produto</CardTitle>
        <CardDescription>Preencha os dados do novo produto</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Nome -->
          <div class="space-y-2">
            <Label for="nome">Nome *</Label>
            <Input
              id="nome"
              v-model="form.nome"
              placeholder="Digite o nome do produto"
              :class="{ 'border-red-500': errors.nome }"
            />
            <p v-if="errors.nome" class="text-sm text-red-500">{{ errors.nome }}</p>
          </div>

          <!-- Descrição -->
          <div class="space-y-2">
            <Label for="descricao">Descrição</Label>
            <textarea
              id="descricao"
              v-model="form.descricao"
              placeholder="Descreva o produto (opcional)"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows="3"
            />
          </div>

          <!-- Preço -->
          <div class="space-y-2">
            <Label for="preco">Preço *</Label>
            <Input
              id="preco"
              v-model="form.preco"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              :class="{ 'border-red-500': errors.preco }"
            />
            <p v-if="errors.preco" class="text-sm text-red-500">{{ errors.preco }}</p>
          </div>

          <!-- Categoria -->
          <div class="space-y-2">
            <Label for="categoria">Categoria</Label>
            <Input
              id="categoria"
              v-model="form.categoria"
              placeholder="Digite a categoria (opcional)"
            />
          </div>

          <!-- Estoque -->
          <div class="space-y-2">
            <Label for="estoque">Estoque</Label>
            <Input
              id="estoque"
              v-model="form.estoque"
              type="number"
              min="0"
              placeholder="0"
              :class="{ 'border-red-500': errors.estoque }"
            />
            <p v-if="errors.estoque" class="text-sm text-red-500">{{ errors.estoque }}</p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="submit"
              :disabled="!isFormValid || submitting"
              class="flex-1"
            >
              <div v-if="submitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ submitting ? 'Cadastrando...' : 'Cadastrar Produto' }}
            </Button>
            <Button type="button" variant="outline" @click="onCancel" class="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
