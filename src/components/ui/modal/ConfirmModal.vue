<script lang="ts">
import { defineComponent } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default defineComponent({
  name: 'ConfirmModal',
  components: {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Button
  },
  props: {
    open: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Confirmar ação'
    },
    description: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    },
    loading: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String as () => 'default' | 'destructive',
      default: 'destructive'
    }
  },
  emits: ['update:open', 'confirm', 'cancel'],
  methods: {
    handleConfirm() {
      this.$emit('confirm')
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
          <div :class="[
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            variant === 'destructive' ? 'bg-red-100' : 'bg-blue-100'
          ]">
            <svg 
              v-if="variant === 'destructive'"
              class="h-6 w-6 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <svg 
              v-else
              class="h-6 w-6 text-blue-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <span>{{ title }}</span>
        </DialogTitle>
        <DialogDescription class="text-left">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      
      <DialogFooter class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button 
          variant="outline" 
          @click="handleCancel"
          :disabled="loading"
          class="flex-1 sm:flex-none"
        >
          {{ cancelText }}
        </Button>
        <Button 
          :variant="variant"
          @click="handleConfirm"
          :disabled="loading"
          class="flex-1 sm:flex-none"
        >
          <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ loading ? 'Processando...' : confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
