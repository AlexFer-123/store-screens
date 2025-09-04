<script lang="ts">
import { defineComponent } from 'vue'
import { useClientesStore } from '@/stores/clientes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Cliente } from '@/types'

interface FormData {
  nome: string
  email: string
  telefone: string
  endereco: string
}

export default defineComponent({
  name: 'ClientesCadastrarView',
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
        email: '',
        telefone: '',
        endereco: ''
      } as FormData,
      errors: {} as Record<string, string>,
      submitting: false
    }
  },
  computed: {
    clientesStore() {
      return useClientesStore()
    },
    isFormValid(): boolean {
      return !!(this.form.nome && this.form.email && this.isValidEmail(this.form.email))
    }
  },
  methods: {
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    validateForm(): boolean {
      this.errors = {}
      
      if (!this.form.nome.trim()) {
        this.errors.nome = 'Nome é obrigatório'
      }
      
      if (!this.form.email.trim()) {
        this.errors.email = 'Email é obrigatório'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Email deve ter um formato válido'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async onSubmit() {
      if (!this.validateForm()) {
        return
      }
      
      this.submitting = true
      
      try {
        const cliente: Omit<Cliente, 'id' | 'created' | 'updatedAt'> = {
          nome: this.form.nome.trim(),
          email: this.form.email.trim(),
          telefone: this.form.telefone.trim() || undefined,
          endereco: this.form.endereco.trim() || undefined
        }
        
        await this.clientesStore.cadastrarCliente(cliente)
        
        this.$router.push('/clientes')
      } catch (error) {
        console.error('Erro ao cadastrar cliente:', error)
      } finally {
        this.submitting = false
      }
    },
    
    onCancel() {
      this.$router.push('/clientes')
    },
    
    clearError() {
      this.clientesStore.clearError()
    },
    
    formatPhoneInput(event: Event) {
      const input = event.target as HTMLInputElement
      let value = input.value.replace(/\D/g, '')
      
      if (value.length <= 11) {
        if (value.length > 6) {
          value = value.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
        } else if (value.length > 2) {
          value = value.replace(/(\d{2})(\d+)/, '($1) $2')
        }
        this.form.telefone = value
      }
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
      <h1 class="text-3xl font-bold text-foreground">Cadastrar Cliente</h1>
      <p class="text-muted-foreground">Adicione um novo cliente ao seu sistema</p>
    </div>

    <!-- Error Message -->
    <div v-if="clientesStore.error" class="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-md flex items-center justify-between">
      <span>{{ clientesStore.error }}</span>
      <Button variant="ghost" size="sm" @click="clearError">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>

    <!-- Form -->
    <Card>
      <CardHeader>
        <CardTitle>Informações do Cliente</CardTitle>
        <CardDescription>Preencha os dados do novo cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Nome -->
          <div class="space-y-2">
            <Label for="nome">Nome Completo *</Label>
            <Input
              id="nome"
              v-model="form.nome"
              placeholder="Digite o nome completo"
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
              placeholder="exemplo@email.com"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <!-- Telefone -->
          <div class="space-y-2">
            <Label for="telefone">Telefone</Label>
            <Input
              id="telefone"
              v-model="form.telefone"
              placeholder="(11) 99999-9999"
              @input="formatPhoneInput"
              maxlength="15"
            />
          </div>

          <!-- Endereço -->
          <div class="space-y-2">
            <Label for="endereco">Endereço</Label>
            <textarea
              id="endereco"
              v-model="form.endereco"
              placeholder="Rua, número, bairro, cidade - Estado"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows="3"
            />
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="submit"
              :disabled="!isFormValid || submitting"
              class="flex-1"
            >
              <div v-if="submitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ submitting ? 'Cadastrando...' : 'Cadastrar Cliente' }}
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
