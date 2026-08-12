<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
  editingRegistration: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['submit', 'cancel', 'validation-error'])

function emptyForm() {
  return {
    participantName: '',
    email: '',
    eventId: props.events[0]?.id ?? '',
  }
}

const form = reactive(emptyForm())

watch(
  () => props.editingRegistration,
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

function resetForm() {
  Object.assign(form, emptyForm())
}

function handleSubmit() {
  if (!form.participantName.trim() || !form.email.trim() || !form.eventId) {
    emit('validation-error', 'Please complete all required fields before submitting.')
    return
  }

  emit('submit', {
    participantName: form.participantName.trim(),
    email: form.email.trim(),
    eventId: form.eventId,
  })

  if (!props.editingRegistration) {
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
      {{ editingRegistration ? 'Edit Registration' : 'Register Participant' }}
    </h2>

    <form v-if="events.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
      <div>
        <label for="participantName" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Participant Name
        </label>
        <input
          id="participantName"
          v-model="form.participantName"
          type="text"
          placeholder="e.g. Juan Dela Cruz"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="e.g. juan.delacruz@example.com"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
        />
      </div>

      <div class="sm:col-span-2">
        <label for="eventId" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Event
        </label>
        <select
          id="eventId"
          v-model="form.eventId"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
        >
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.title }}
          </option>
        </select>
      </div>

      <div class="sm:col-span-2 flex items-center gap-3 pt-1">
        <button
          type="submit"
          class="rounded-md px-4 py-2 text-sm font-medium text-white"
          style="background-color: var(--color-primary);"
        >
          {{ editingRegistration ? 'Save Changes' : 'Register' }}
        </button>
        <button
          v-if="editingRegistration"
          type="button"
          class="rounded-md px-4 py-2 text-sm font-medium border"
          style="border-color: var(--color-border); color: var(--color-text-muted);"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </form>

    <p v-else class="text-sm" style="color: var(--color-text-muted);">
      Add an event first before registering participants.
    </p>
  </section>
</template>
