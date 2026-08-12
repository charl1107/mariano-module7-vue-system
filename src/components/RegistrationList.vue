<script setup>
defineProps({
  registrations: {
    type: Array,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
  getEventTitle: {
    type: Function,
    required: true,
  },
})

const searchTerm = defineModel('searchTerm', { default: '' })

const emit = defineEmits(['edit', 'delete'])

function formatDateTime(isoStr) {
  if (!isoStr) return ''
  return new Date(isoStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="font-display text-xl font-semibold" style="color: var(--color-primary-dark);">
          Registrations
        </h2>
        <p class="text-sm" style="color: var(--color-text-muted);">
          {{ totalCount }} total registration{{ totalCount === 1 ? '' : 's' }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <slot name="action" />
        <div class="relative w-full sm:w-72">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search by participant name..."
            class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style="border-color: var(--color-border); background-color: var(--color-surface); --tw-ring-color: var(--color-primary);"
          />
        </div>
      </div>
    </div>

    <div v-if="registrations.length === 0" class="rounded-lg border border-dashed p-10 text-center" style="border-color: var(--color-border);">
      <p class="font-display text-lg" style="color: var(--color-primary-dark);">No registrations found</p>
      <p class="text-sm mt-1" style="color: var(--color-text-muted);">
        Try a different search term, or register a participant above.
      </p>
    </div>

    <!-- Mobile: stacked cards -->
    <div v-else class="sm:hidden space-y-3">
      <div
        v-for="registration in registrations"
        :key="registration.id"
        class="rounded-lg border p-4 space-y-2"
        style="background-color: var(--color-surface); border-color: var(--color-border);"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="font-medium" style="color: var(--color-text);">{{ registration.participantName }}</p>
            <p class="text-sm" style="color: var(--color-text-muted);">{{ registration.email }}</p>
          </div>
          <span
            class="shrink-0 text-xs font-medium px-2 py-1 rounded-full"
            :style="registration.attendanceStatus === 'Present'
              ? { backgroundColor: 'rgba(47,122,79,0.12)', color: 'var(--color-success)' }
              : registration.attendanceStatus === 'Absent'
                ? { backgroundColor: 'rgba(182,65,47,0.1)', color: 'var(--color-danger)' }
                : { backgroundColor: 'rgba(92,102,99,0.12)', color: 'var(--color-text-muted)' }"
          >
            {{ registration.attendanceStatus }}
          </span>
        </div>
        <dl class="text-sm space-y-1">
          <div class="flex gap-2">
            <dt class="font-medium shrink-0" style="color: var(--color-text);">Event:</dt>
            <dd style="color: var(--color-text-muted);">{{ getEventTitle(registration.eventId) }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="font-medium shrink-0" style="color: var(--color-text);">Registered:</dt>
            <dd style="color: var(--color-text-muted);">{{ formatDateTime(registration.registeredAt) }}</dd>
          </div>
        </dl>
        <div class="flex items-center gap-2 pt-1">
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium border"
            style="border-color: var(--color-border); color: var(--color-primary-dark);"
            @click="emit('edit', registration.id)"
          >
            Edit
          </button>
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-white"
            style="background-color: var(--color-danger);"
            @click="emit('delete', registration.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Tablet and up: table -->
    <div v-if="registrations.length > 0" class="hidden sm:block rounded-lg border overflow-x-auto" style="border-color: var(--color-border); background-color: var(--color-surface);">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left" style="border-color: var(--color-border); background-color: var(--color-surface-muted);">
            <th class="px-4 py-2 font-medium" style="color: var(--color-text);">Participant</th>
            <th class="px-4 py-2 font-medium" style="color: var(--color-text);">Email</th>
            <th class="px-4 py-2 font-medium" style="color: var(--color-text);">Event</th>
            <th class="px-4 py-2 font-medium" style="color: var(--color-text);">Registered On</th>
            <th class="px-4 py-2 font-medium" style="color: var(--color-text);">Attendance</th>
            <th class="px-4 py-2 font-medium text-right" style="color: var(--color-text);">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="registration in registrations"
            :key="registration.id"
            class="border-b last:border-0"
            style="border-color: var(--color-border);"
          >
            <td class="px-4 py-2" style="color: var(--color-text);">{{ registration.participantName }}</td>
            <td class="px-4 py-2" style="color: var(--color-text-muted);">{{ registration.email }}</td>
            <td class="px-4 py-2" style="color: var(--color-text-muted);">{{ getEventTitle(registration.eventId) }}</td>
            <td class="px-4 py-2" style="color: var(--color-text-muted);">{{ formatDateTime(registration.registeredAt) }}</td>
            <td class="px-4 py-2">
              <span
                class="text-xs font-medium px-2 py-1 rounded-full"
                :style="registration.attendanceStatus === 'Present'
                  ? { backgroundColor: 'rgba(47,122,79,0.12)', color: 'var(--color-success)' }
                  : registration.attendanceStatus === 'Absent'
                    ? { backgroundColor: 'rgba(182,65,47,0.1)', color: 'var(--color-danger)' }
                    : { backgroundColor: 'rgba(92,102,99,0.12)', color: 'var(--color-text-muted)' }"
              >
                {{ registration.attendanceStatus }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="rounded-md px-3 py-1 text-xs font-medium border"
                  style="border-color: var(--color-border); color: var(--color-primary-dark);"
                  @click="emit('edit', registration.id)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="rounded-md px-3 py-1 text-xs font-medium text-white"
                  style="background-color: var(--color-danger);"
                  @click="emit('delete', registration.id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
