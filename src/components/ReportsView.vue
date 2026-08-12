<script setup>
import { computed } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
  registrations: {
    type: Array,
    required: true,
  },
})

const EVENT_STATUSES = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled']

const eventStatusBreakdown = computed(() =>
  EVENT_STATUSES.map((status) => ({
    status,
    count: props.events.filter((e) => e.status === status).length,
  }))
)

const totalRegistrations = computed(() => props.registrations.length)

const attendanceBreakdown = computed(() => {
  const present = props.registrations.filter((r) => r.attendanceStatus === 'Present').length
  const absent = props.registrations.filter((r) => r.attendanceStatus === 'Absent').length
  const notMarked = totalRegistrations.value - present - absent
  return { present, absent, notMarked }
})

const attendanceRate = computed(() => {
  const marked = attendanceBreakdown.value.present + attendanceBreakdown.value.absent
  if (marked === 0) return 0
  return Math.round((attendanceBreakdown.value.present / marked) * 100)
})

const registrationsPerEvent = computed(() =>
  props.events
    .map((event) => ({
      title: event.title,
      count: props.registrations.filter((r) => r.eventId === event.id).length,
    }))
    .sort((a, b) => b.count - a.count)
)

const maxEventCount = computed(() =>
  Math.max(1, ...eventStatusBreakdown.value.map((s) => s.count))
)
const maxRegistrationCount = computed(() =>
  Math.max(1, ...registrationsPerEvent.value.map((r) => r.count))
)
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="font-display text-xl font-semibold" style="color: var(--color-primary-dark);">
        Reports and Analytics
      </h2>
      <p class="text-sm" style="color: var(--color-text-muted);">
        Summary computed from current events and registrations.
      </p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="rounded-lg border p-4" style="background-color: var(--color-surface); border-color: var(--color-border);">
        <p class="text-2xl font-display font-semibold" style="color: var(--color-primary-dark);">{{ events.length }}</p>
        <p class="text-xs mt-1" style="color: var(--color-text-muted);">Total Events</p>
      </div>
      <div class="rounded-lg border p-4" style="background-color: var(--color-surface); border-color: var(--color-border);">
        <p class="text-2xl font-display font-semibold" style="color: var(--color-primary-dark);">{{ totalRegistrations }}</p>
        <p class="text-xs mt-1" style="color: var(--color-text-muted);">Total Registrations</p>
      </div>
      <div class="rounded-lg border p-4" style="background-color: var(--color-surface); border-color: var(--color-border);">
        <p class="text-2xl font-display font-semibold" style="color: var(--color-success);">{{ attendanceBreakdown.present }}</p>
        <p class="text-xs mt-1" style="color: var(--color-text-muted);">Marked Present</p>
      </div>
      <div class="rounded-lg border p-4" style="background-color: var(--color-surface); border-color: var(--color-border);">
        <p class="text-2xl font-display font-semibold" style="color: var(--color-accent);">{{ attendanceRate }}%</p>
        <p class="text-xs mt-1" style="color: var(--color-text-muted);">Attendance Rate</p>
      </div>
    </div>

    <div class="rounded-lg border p-5" style="background-color: var(--color-surface); border-color: var(--color-border);">
      <h3 class="font-display text-base font-semibold mb-3" style="color: var(--color-text);">Events by Status</h3>
      <div class="space-y-2">
        <div v-for="item in eventStatusBreakdown" :key="item.status" class="flex items-center gap-3">
          <span class="w-16 sm:w-24 text-xs sm:text-sm shrink-0 truncate" style="color: var(--color-text-muted);">{{ item.status }}</span>
          <div class="flex-1 h-3 rounded-full" style="background-color: var(--color-surface-muted);">
            <div
              class="h-3 rounded-full"
              style="background-color: var(--color-primary);"
              :style="{ width: (item.count / maxEventCount) * 100 + '%', backgroundColor: 'var(--color-primary)' }"
            ></div>
          </div>
          <span class="w-6 text-sm text-right" style="color: var(--color-text);">{{ item.count }}</span>
        </div>
      </div>
    </div>

    <div class="rounded-lg border p-5" style="background-color: var(--color-surface); border-color: var(--color-border);">
      <h3 class="font-display text-base font-semibold mb-3" style="color: var(--color-text);">Registrations per Event</h3>
      <div v-if="registrationsPerEvent.length === 0" class="text-sm" style="color: var(--color-text-muted);">
        No events to report on yet.
      </div>
      <div v-else class="space-y-2">
        <div v-for="item in registrationsPerEvent" :key="item.title" class="flex items-center gap-3">
          <span class="w-24 sm:w-40 text-xs sm:text-sm shrink-0 truncate" style="color: var(--color-text-muted);" :title="item.title">
            {{ item.title }}
          </span>
          <div class="flex-1 h-3 rounded-full" style="background-color: var(--color-surface-muted);">
            <div
              class="h-3 rounded-full"
              :style="{ width: (item.count / maxRegistrationCount) * 100 + '%', backgroundColor: 'var(--color-accent)' }"
            ></div>
          </div>
          <span class="w-6 text-sm text-right" style="color: var(--color-text);">{{ item.count }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
