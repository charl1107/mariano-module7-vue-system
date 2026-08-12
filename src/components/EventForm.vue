<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  editingEvent: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['submit', 'cancel', 'validation-error'])

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
  () => props.editingEvent,
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

function resetForm() {
  Object.assign(form, emptyForm())
}

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

  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    eventDate: form.eventDate,
    location: form.location.trim(),
    status: form.status,
  })

  if (!props.editingEvent) {
    resetForm()
  }
}

function handleCancel() {
  resetForm()
  emit('cancel')
}
</script>

<template>
  <section
    class="rounded-lg border p-5 sm:p-6"
    style="background-color: var(--color-surface); border-color: var(--color-border);"
  >
    <h2 class="font-display text-xl font-semibold mb-4" style="color: var(--color-primary-dark);">
      {{ editingEvent ? 'Edit Event' : 'Add Event' }}
    </h2>

    <form class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
      <div class="sm:col-span-2">
        <label for="title" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Event Title
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="e.g. Freshman Orientation Day"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
        />
      </div>

      <div class="sm:col-span-2">
        <label for="description" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          placeholder="What is this event about?"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
        ></textarea>
      </div>

      <div>
        <label for="eventDate" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Event Date
        </label>
        <input
          id="eventDate"
          v-model="form.eventDate"
          type="date"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
        />
      </div>

      <div>
        <label for="location" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Location
        </label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          placeholder="e.g. University Gymnasium"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
        />
      </div>

      <div class="sm:col-span-2">
        <label for="status" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Status
        </label>
        <select
          id="status"
          v-model="form.status"
          class="w-full sm:w-1/2 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
        >
          <option v-for="option in STATUS_OPTIONS" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <div class="sm:col-span-2 flex items-center gap-3 pt-1">
        <button
          type="submit"
          class="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          style="background-color: var(--color-primary);"
        >
          {{ editingEvent ? 'Save Changes' : 'Add Event' }}
        </button>
        <button
          v-if="editingEvent"
          type="button"
          class="rounded-md px-4 py-2 text-sm font-medium border"
          style="border-color: var(--color-border); color: var(--color-text-muted);"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>
