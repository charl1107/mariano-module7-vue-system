<script setup>
defineProps({
  events: {
    type: Array,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
})

const searchTerm = defineModel('searchTerm', { default: '' })

const emit = defineEmits(['edit', 'delete'])

const STATUS_STYLES = {
  Upcoming: { bg: 'rgba(27,75,67,0.1)', color: 'var(--color-primary-dark)' },
  Ongoing: { bg: 'rgba(232,163,61,0.18)', color: '#8a5a12' },
  Completed: { bg: 'rgba(47,122,79,0.12)', color: 'var(--color-success)' },
  Cancelled: { bg: 'rgba(182,65,47,0.1)', color: 'var(--color-danger)' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString(undefined, {
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
          Events
        </h2>
        <p class="text-sm" style="color: var(--color-text-muted);">
          {{ totalCount }} total event{{ totalCount === 1 ? '' : 's' }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        <div class="shrink-0">
          <slot name="action" />
        </div>
        <div class="relative w-full sm:w-72">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search by title..."
            class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style="border-color: var(--color-border); background-color: var(--color-surface); --tw-ring-color: var(--color-primary);"
          />
        </div>
      </div>
    </div>

    <div v-if="events.length === 0" class="rounded-lg border border-dashed p-10 text-center" style="border-color: var(--color-border);">
      <p class="font-display text-lg" style="color: var(--color-primary-dark);">No events found</p>
      <p class="text-sm mt-1" style="color: var(--color-text-muted);">
        Try a different search term, or add a new event above.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <article
        v-for="event in events"
        :key="event.id"
        class="rounded-lg overflow-hidden border flex flex-col"
        style="background-color: var(--color-surface); border-color: var(--color-border);"
      >
        <div class="p-4 flex-1 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-display text-lg font-semibold leading-snug" style="color: var(--color-text);">
              {{ event.title }}
            </h3>
            <span
              class="shrink-0 text-xs font-medium px-2 py-1 rounded-full"
              :style="{ backgroundColor: STATUS_STYLES[event.status]?.bg, color: STATUS_STYLES[event.status]?.color }"
            >
              {{ event.status }}
            </span>
          </div>

          <p class="text-sm" style="color: var(--color-text-muted);">
            {{ event.description }}
          </p>

          <dl class="text-sm pt-1 space-y-1">
            <div class="flex gap-2">
              <dt class="font-medium" style="color: var(--color-text);">Date:</dt>
              <dd style="color: var(--color-text-muted);">{{ formatDate(event.eventDate) }}</dd>
            </div>
            <div class="flex gap-2">
              <dt class="font-medium" style="color: var(--color-text);">Location:</dt>
              <dd style="color: var(--color-text-muted);">{{ event.location }}</dd>
            </div>
          </dl>
        </div>

        <div class="ticket-perforation h-2" aria-hidden="true"></div>

        <div class="p-3 flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-sm font-medium border"
            style="border-color: var(--color-border); color: var(--color-primary-dark);"
            @click="emit('edit', event.id)"
          >
            Edit
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-sm font-medium text-white"
            style="background-color: var(--color-danger);"
            @click="emit('delete', event.id)"
          >
            Delete
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
