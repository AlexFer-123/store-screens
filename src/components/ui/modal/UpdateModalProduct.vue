<script lang="ts">
import { defineComponent } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toast } from '@/components/ui/toast'
import { useProdutosStore } from '@/stores/produtos'
import type { Produto } from '@/types'

export default defineComponent({
  name: 'UpdateModalProduct',
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
    produto: {
      type: Object as () => Produto | null,
      default: null
    }
  },
  emits: ['update:open', 'success', 'cancel'],
  data() {
    return {
      form: {
        nome: '',
        descricao: '',
        preco: 0,
        categoria: '',
        estoque: 0
      },
      loading: false,
      errors: {} as Record<string, string>,
      showToast: false,
      toastMessage: ''
    }
  },
  computed: {
    produtosStore() {
      return useProdutosStore()
    }
  },
  watch: {
    produto: {
      handler(newProduto) {
        if (newProduto) {
          this.form = {
            nome: newProduto.nome || '',
            descricao: newProduto.descricao || '',
            preco: newProduto.preco || 0,
            categoria: newProduto.categoria || '',
            estoque: newProduto.estoque || 0
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
        descricao: '',
        preco: 0,
        categoria: '',
        estoque: 0
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
      
      // Preço é obrigatório e deve ser maior que 0
      if (!this.form.preco || this.form.preco <= 0) {
        this.errors.preco = 'Preço deve ser maior que zero'
      }
      
      // Estoque deve ser um número não negativo
      if (this.form.estoque < 0) {
        this.errors.estoque = 'Estoque não pode ser negativo'
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
      
      console.log(this.produto)
      if (!this.produto?.id) {
        this.showError('ID do produto não encontrado')
        return
      }
      
      this.loading = true
      
      try {
        const dadosAtualizados = {
          nome: this.form.nome.trim(),
          preco: Number(this.form.preco),
          estoque: Number(this.form.estoque)
        }
        
        console.log('Atualizando produto com dados:', dadosAtualizados)
        const produtoAtualizado = await this.produtosStore.atualizarProduto(this.produto.id, dadosAtualizados)
        console.log('Produto atualizado:', produtoAtualizado)
        
        this.$emit('success', produtoAtualizado)
        this.$emit('update:open', false)
      } catch (error: any) {
        this.showError(error.message || 'Erro ao atualizar produto')
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
          <span>Editar Produto</span>
        </DialogTitle>
      </DialogHeader>
      
      <div class="space-y-4 py-4">
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
          <Input
            id="descricao"
            v-model="form.descricao"
            placeholder="Digite a descrição do produto"
            :class="{ 'border-red-500': errors.descricao }"
          />
          <p v-if="errors.descricao" class="text-sm text-red-500">{{ errors.descricao }}</p>
        </div>
        
        <!-- Preço -->
        <div class="space-y-2">
          <Label for="preco">Preço *</Label>
          <Input
            id="preco"
            v-model.number="form.preco"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
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
            placeholder="Digite a categoria do produto"
            :class="{ 'border-red-500': errors.categoria }"
          />
          <p v-if="errors.categoria" class="text-sm text-red-500">{{ errors.categoria }}</p>
        </div>
        
        <!-- Estoque -->
        <div class="space-y-2">
          <Label for="estoque">Estoque</Label>
          <Input
            id="estoque"
            v-model.number="form.estoque"
            type="number"
            min="0"
            placeholder="0"
            :class="{ 'border-red-500': errors.estoque }"
          />
          <p v-if="errors.estoque" class="text-sm text-red-500">{{ errors.estoque }}</p>
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
