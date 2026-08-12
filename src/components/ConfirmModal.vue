<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Are you sure?',
  },
  message: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  variant: {
    type: String,
    default: 'danger', // 'danger' | 'primary'
  },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        @click.self="emit('cancel')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <!-- Modal -->
        <div
          class="relative w-full max-w-sm rounded-lg border p-6 shadow-xl"
          style="background-color: var(--color-surface); border-color: var(--color-border);"
        >
          <!-- Icon -->
          <div class="flex justify-center mb-4">
            <div
              v-if="variant === 'danger'"
              class="w-12 h-12 rounded-full flex items-center justify-center"
              style="background-color: rgba(182,65,47,0.12);"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke: var(--color-danger);">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div
              v-else
              class="w-12 h-12 rounded-full flex items-center justify-center"
              style="background-color: rgba(27,75,67,0.12);"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke: var(--color-primary);">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
          </div>

          <!-- Title -->
          <h3
            class="font-display text-lg font-semibold text-center"
            style="color: var(--color-primary-dark);"
          >
            {{ title }}
          </h3>

          <!-- Message -->
          <p
            v-if="message"
            class="text-sm text-center mt-2"
            style="color: var(--color-text-muted);"
          >
            {{ message }}
          </p>

          <!-- Buttons -->
          <div class="flex items-center gap-3 mt-6">
            <button
              type="button"
              class="flex-1 rounded-md px-4 py-2 text-sm font-medium border transition-colors"
              style="border-color: var(--color-border); color: var(--color-text-muted); background-color: var(--color-surface);"
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="flex-1 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
              :style="{
                backgroundColor: variant === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)',
              }"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
