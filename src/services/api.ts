import axios from 'axios'
import type { Produto, Cliente, PaginatedResponse } from '@/types'

const api = axios.create({
  baseURL: 'https://store-api-mle0.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Serviços de Produtos
export const produtosService = {
  async listar(page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Produto>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (search) {
      params.append('search', search)
    }
    
    const response = await api.get(`/produtos?${params}`)
    const { data } = response.data

    return {
      data: data.products || [],
      total: data.pagination?.total || 0,
      page: data.pagination?.page || 1,
      limit: data.pagination?.limit || 10,
      totalPages: data.pagination?.pages || 1
    }
  },

  async buscarPorId(id: string | number): Promise<Produto> {
    const response = await api.get(`/produtos/${id}`)
    return response.data.product || response.data
  },

  async cadastrar(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Produto> {
    const response = await api.post('/produtos', produto)
    return response.data.product || response.data
  },

  async deletar(id: string | number): Promise<void> {
    await api.delete(`/produtos/${id}`)
  }
}

export const clientesService = {
  async listar(page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Cliente>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (search) {
      params.append('search', search)
    }
    
    const response = await api.get(`/clientes?${params}`)
    const { data } = response.data
    
    return {
      data: data.clients || data.clientes || [],
      total: data.pagination?.total || 0,
      page: data.pagination?.page || 1,
      limit: data.pagination?.limit || 10,
      totalPages: response.data.pagination?.pages || 1
    }
  },

  async buscarPorId(id: string | number): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`)
    return response.data.client || response.data.cliente || response.data
  },

  async cadastrar(cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    const response = await api.post('/clientes', cliente)
    return response.data.client || response.data.cliente || response.data
  },

  async deletar(id: string | number): Promise<void> {
    await api.delete(`/clientes/${id}`)
  }
}

export default api
