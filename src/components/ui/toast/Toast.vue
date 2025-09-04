<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Toast',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String as () => 'success' | 'error' | 'warning' | 'info',
      default: 'error'
    },
    duration: {
      type: Number,
      default: 5000
    }
  },
  emits: ['close'],
  mounted() {
    if (this.show && this.duration > 0) {
      setTimeout(() => {
        this.$emit('close')
      }, this.duration)
    }
  },
  watch: {
    show(newVal) {
      if (newVal && this.duration > 0) {
        setTimeout(() => {
          this.$emit('close')
        }, this.duration)
      }
    }
  },
  computed: {
    toastClasses() {
      const baseClasses = 'fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50 transition-all duration-300'
      
      if (!this.show) {
        return baseClasses + ' transform translate-x-full opacity-0'
      }
      
      return baseClasses + ' transform translate-x-0 opacity-100'
    },
    iconClasses() {
      switch (this.type) {
        case 'success':
          return 'text-green-400'
        case 'warning':
          return 'text-yellow-400'
        case 'info':
          return 'text-blue-400'
        case 'error':
        default:
          return 'text-red-400'
      }
    },
    borderClasses() {
      switch (this.type) {
        case 'success':
          return 'border-l-4 border-green-400'
        case 'warning':
          return 'border-l-4 border-yellow-400'
        case 'info':
          return 'border-l-4 border-blue-400'
        case 'error':
        default:
          return 'border-l-4 border-red-400'
      }
    }
  }
})
</script>

<template>
  <div :class="toastClasses">
    <div :class="['p-4', borderClasses]">
      <div class="flex">
        <div class="flex-shrink-0">
          <!-- Error Icon -->
          <svg v-if="type === 'error'" :class="['h-5 w-5', iconClasses]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <!-- Success Icon -->
          <svg v-else-if="type === 'success'" :class="['h-5 w-5', iconClasses]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <!-- Warning Icon -->
          <svg v-else-if="type === 'warning'" :class="['h-5 w-5', iconClasses]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <!-- Info Icon -->
          <svg v-else :class="['h-5 w-5', iconClasses]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium text-gray-900">
            {{ message }}
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            @click="$emit('close')"
            class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="sr-only">Fechar</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
