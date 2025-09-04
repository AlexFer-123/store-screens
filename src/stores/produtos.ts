import { defineStore } from 'pinia'
import { produtosService } from '@/services/api'
import type { Produto, PaginatedResponse } from '@/types'

interface ProdutosState {
  produtos: Produto[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  total: number
  searchQuery: string
}

export const useProdutosStore = defineStore('produtos', {
  state: (): ProdutosState => ({
    produtos: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    total: 0,
    searchQuery: ''
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    isEmpty: (state) => state.produtos.length === 0
  },

  actions: {
    async listarProdutos(page = 1, limit = 10, search = '') {
      this.loading = true
      this.error = null
      
      try {
        const response: PaginatedResponse<Produto> = await produtosService.listar(page, limit, search)
        console.log(response)
        this.produtos = response.data
        this.currentPage = response.page
        this.totalPages = response.totalPages
        this.total = response.total
        this.searchQuery = search
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar produtos'
        console.error('Erro ao listar produtos:', error)
      } finally {
        this.loading = false
      }
    },

    async cadastrarProduto(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      
      try {
        const novoProduto = await produtosService.cadastrar(produto)
        if (!Array.isArray(this.produtos)) {
          this.produtos = []
        }
        this.produtos.unshift(novoProduto)
        this.total += 1
        return novoProduto
      } catch (error: any) {
        this.error = error.message || 'Erro ao cadastrar produto'
        console.error('Erro ao cadastrar produto:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async buscarProdutoPorId(id: number) {
      this.loading = true
      this.error = null
      
      try {
         const produto = await produtosService.buscarPorId(id)
         return produto
         
      } catch (error: any) {
        this.error = error.message || 'Erro ao buscar produto'
        console.error('Erro ao buscar produto:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
