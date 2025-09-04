import { defineStore } from 'pinia'
import { clientesService } from '@/services/api'
import type { Cliente, PaginatedResponse } from '@/types'

interface ClientesState {
  clientes: Cliente[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  total: number
  searchQuery: string
}

export const useClientesStore = defineStore('clientes', {
  state: (): ClientesState => ({
    clientes: [],
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
    isEmpty: (state) => state.clientes.length === 0
  },

  actions: {
    async listarClientes(page = 1, limit = 10, search = '') {
      this.loading = true
      this.error = null
      
      try {
        const response: PaginatedResponse<Cliente> = await clientesService.listar(page, limit, search)
        this.clientes = response.data
        this.currentPage = response.page
        this.totalPages = response.totalPages
        this.total = response.total
        this.searchQuery = search
      } catch (error: any) {
        this.error = error.message || 'Erro ao carregar clientes'
        console.error('Erro ao listar clientes:', error)
      } finally {
        this.loading = false
      }
    },

    async cadastrarCliente(cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      
      try {
        const novoCliente = await clientesService.cadastrar(cliente)
        // Garantir que clientes é um array antes de usar unshift
        if (!Array.isArray(this.clientes)) {
          this.clientes = []
        }
        this.clientes.unshift(novoCliente)
        this.total += 1
        return novoCliente
      } catch (error: any) {
        this.error = error.message || 'Erro ao cadastrar cliente'
        console.error('Erro ao cadastrar cliente:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async buscarClientePorId(id: string | number) {
      this.loading = true
      this.error = null
      
      try {
        return await clientesService.buscarPorId(id)
      } catch (error: any) {
        this.error = error.message || 'Erro ao buscar cliente'
        console.error('Erro ao buscar cliente:', error)
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
