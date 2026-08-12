<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  event: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['save', 'cancel', 'validation-error'])

const STATUS_OPTIONS = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled']

function emptyForm() {
  return {
    title: '',
    description: '',
    eventDate: '',
    location: '',
    status: 'Upcoming',
  }
}

const form = reactive(emptyForm())

watch(
  () => props.event,
  (event) => {
    if (event) {
      form.title = event.title
      form.description = event.description
      form.eventDate = event.eventDate
      form.location = event.location
      form.status = event.status
    } else {
      Object.assign(form, emptyForm())
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (
    !form.title.trim() ||
    !form.description.trim() ||
    !form.eventDate ||
    !form.location.trim()
  ) {
    emit('validation-error', 'Please complete all required fields before submitting.')
    return
  }

  emit('save', {
    title: form.title.trim(),
    description: form.description.trim(),
    eventDate: form.eventDate,
    location: form.location.trim(),
    status: form.status,
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
            Edit Event
          </h3>

          <!-- Form -->
          <form class="mt-5 space-y-4" @submit.prevent="handleSubmit">
            <div>
              <label for="edit-event-title" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
                Event Title
              </label>
              <input
                id="edit-event-title"
                v-model="form.title"
                type="text"
                placeholder="e.g. Freshman Orientation Day"
                class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
              />
            </div>

            <div>
              <label for="edit-event-description" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
                Description
              </label>
              <textarea
                id="edit-event-description"
                v-model="form.description"
                rows="3"
                placeholder="What is this event about?"
                class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="edit-event-date" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
                  Event Date
                </label>
                <input
                  id="edit-event-date"
                  v-model="form.eventDate"
                  type="date"
                  class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
                />
              </div>

              <div>
                <label for="edit-event-location" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
                  Location
                </label>
                <input
                  id="edit-event-location"
                  v-model="form.location"
                  type="text"
                  placeholder="e.g. University Gymnasium"
                  class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
                />
              </div>
            </div>

            <div>
              <label for="edit-event-status" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
                Status
              </label>
              <select
                id="edit-event-status"
                v-model="form.status"
                class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
              >
                <option v-for="option in STATUS_OPTIONS" :key="option" :value="option">
                  {{ option }}
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
