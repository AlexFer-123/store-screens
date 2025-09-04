export interface Produto {
  id?: string | number
  nome: string
  descricao?: string
  preco: number
  categoria?: string
  estoque?: number
  data_criacao?: string
  created?: string
  updatedAt?: string
}

export interface Cliente {
  id?: string | number
  nome: string
  email: string
  telefone?: string
  endereco?: string
  data_criacao?: string
  created?: string
  updatedAt?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
