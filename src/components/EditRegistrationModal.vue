<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  registration: {
    type: Object,
    default: null,
  },
  events: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['save', 'cancel', 'validation-error'])

function emptyForm() {
  return {
    participantName: '',
    email: '',
    eventId: props.events[0]?.id ?? '',
  }
}

const form = reactive(emptyForm())

watch(
  () => props.registration,
  (registration) => {
    if (registration) {
      form.participantName = registration.participantName
      form.email = registration.email
      form.eventId = registration.eventId
    } else {
      Object.assign(form, emptyForm())
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.participantName.trim() || !form.email.trim() || !form.eventId) {
    emit('validation-error', 'Please complete all required fields before submitting.')
    return
  }

  emit('save', {
    participantName: form.participantName.trim(),
    email: form.email.trim(),
    eventId: form.eventId,
  })
}
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
          class="relative w-full max-w-lg rounded-lg border p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          style="background-color: var(--color-surface); border-color: var(--color-border);"
        >
          <!-- Icon -->
          <div class="flex justify-center mb-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center"
              style="background-color: rgba(27,75,67,0.12);"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke: var(--color-primary);">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>

          <!-- Title -->
          <h3
            class="font-display text-lg font-semibold text-center"
            style="color: var(--color-primary-dark);"
          >
            Edit Registration
          </h3>

          <!-- Form -->
          <form class="mt-5 space-y-4" @submit.prevent="handleSubmit">
            <div>
              <label for="edit-reg-name" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
                Participant Name
              </label>
              <input
                id="edit-reg-name"
                v-model="form.participantName"
                type="text"
                placeholder="e.g. Juan Dela Cruz"
                class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
              />
            </div>

            <div>
              <label for="edit-reg-email" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
                Email
              </label>
              <input
                id="edit-reg-email"
                v-model="form.email"
                type="email"
                placeholder="e.g. juan.delacruz@example.com"
                class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
              />
            </div>

            <div>
              <label for="edit-reg-event" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
                Event
              </label>
              <select
                id="edit-reg-event"
                v-model="form.eventId"
                class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
              >
                <option v-for="event in events" :key="event.id" :value="event.id">
                  {{ event.title }}
                </option>
              </select>
            </div>

            <!-- Buttons -->
            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                class="flex-1 rounded-md px-4 py-2 text-sm font-medium border transition-colors"
                style="border-color: var(--color-border); color: var(--color-text-muted); background-color: var(--color-surface);"
                @click="emit('cancel')"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
                style="background-color: var(--color-primary);"
              >
                Save Changes
              </button>
            </div>
          </form>
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
