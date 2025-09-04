<script lang="ts">
import { defineComponent } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default defineComponent({
  name: 'HomeView',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button
  },
  methods: {
    navigateTo(route: string) {
      this.$router.push(route)
    }
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        Sistema de Gestão
      </h1>
      <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
        Gerencie seus produtos e clientes de forma simples e eficiente
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/produtos')">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Produtos</span>
          </CardTitle>
          <CardDescription>
            Visualizar todos os produtos
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/produtos/cadastrar')">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Novo Produto</span>
          </CardTitle>
          <CardDescription>
            Cadastrar um novo produto
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/clientes')">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span>Clientes</span>
          </CardTitle>
          <CardDescription>
            Visualizar todos os clientes
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/clientes/cadastrar')">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Novo Cliente</span>
          </CardTitle>
          <CardDescription>
            Cadastrar um novo cliente
          </CardDescription>
        </CardHeader>
      </Card>
    </div>

    <!-- Features Section -->
    <div class="space-y-6">
      <h2 class="text-3xl font-bold text-center text-foreground">Funcionalidades</h2>
      <div class="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gestão de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2 text-muted-foreground">
              <li>• Cadastro de produtos com informações detalhadas</li>
              <li>• Listagem com busca e paginação</li>
              <li>• Visualização de detalhes individuais</li>
              <li>• Interface moderna e responsiva</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestão de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2 text-muted-foreground">
              <li>• Cadastro de clientes com dados de contato</li>
              <li>• Listagem com busca e paginação</li>
              <li>• Visualização de perfis completos</li>
              <li>• Organização eficiente dos dados</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
