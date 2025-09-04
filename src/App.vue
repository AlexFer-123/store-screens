<script lang="ts">
import { defineComponent } from 'vue'
import { Button } from '@/components/ui/button'

export default defineComponent({
  name: 'App',
  components: {
    Button
  },
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header/Navigation -->
    <header class="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-primary">
              StoreApp
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              :class="{ 'text-foreground': $route.name === 'home' }"
            >
              Início
            </router-link>
            <router-link 
              to="/produtos" 
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              :class="{ 'text-foreground': $route.path.startsWith('/produtos') }"
            >
              Produtos
            </router-link>
            <router-link 
              to="/clientes" 
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              :class="{ 'text-foreground': $route.path.startsWith('/clientes') }"
            >
              Clientes
            </router-link>
          </nav>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <Button variant="ghost" size="sm" @click="toggleMobileMenu">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            <router-link 
              to="/" 
              class="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              :class="{ 'text-foreground bg-muted': $route.name === 'home' }"
              @click="mobileMenuOpen = false"
            >
              Início
            </router-link>
            <router-link 
              to="/produtos" 
              class="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              :class="{ 'text-foreground bg-muted': $route.path.startsWith('/produtos') }"
              @click="mobileMenuOpen = false"
            >
              Produtos
            </router-link>
            <router-link 
              to="/clientes" 
              class="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              :class="{ 'text-foreground bg-muted': $route.path.startsWith('/clientes') }"
              @click="mobileMenuOpen = false"
            >
              Clientes
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.router-link-active {
  color: hsl(var(--foreground));
}
</style>
