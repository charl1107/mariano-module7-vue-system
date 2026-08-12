<script setup>
import { ref, computed } from 'vue'

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

const emit = defineEmits(['mark'])

const selectedEventId = ref(props.events[0]?.id ?? '')

const eventRegistrations = computed(() =>
  props.registrations.filter((r) => r.eventId === selectedEventId.value)
)

const summary = computed(() => {
  const list = eventRegistrations.value
  const present = list.filter((r) => r.attendanceStatus === 'Present').length
  const absent = list.filter((r) => r.attendanceStatus === 'Absent').length
  const notMarked = list.length - present - absent
  return { total: list.length, present, absent, notMarked }
})

function markAttendance(registrationId, status) {
  emit('mark', registrationId, status)
}
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="font-display text-xl font-semibold" style="color: var(--color-primary-dark);">
        Attendance Tracking
      </h2>
      <p class="text-sm" style="color: var(--color-text-muted);">
        Select an event to mark participants present or absent.
      </p>
    </div>

    <div v-if="events.length === 0" class="rounded-lg border border-dashed p-10 text-center" style="border-color: var(--color-border);">
      <p class="font-display text-lg" style="color: var(--color-primary-dark);">No events yet</p>
      <p class="text-sm mt-1" style="color: var(--color-text-muted);">Add an event first to track attendance.</p>
    </div>

    <template v-else>
      <div class="w-full sm:w-72">
        <label for="attendanceEvent" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
          Event
        </label>
        <select
          id="attendanceEvent"
          v-model="selectedEventId"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="border-color: var(--color-border); background-color: var(--color-surface); --tw-ring-color: var(--color-primary);"
        >
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.title }}
          </option>
        </select>
      </div>

      <div class="flex flex-wrap gap-3 text-sm">
        <span class="rounded-full px-3 py-1" style="background-color: var(--color-surface-muted); color: var(--color-text);">
          Total: {{ summary.total }}
        </span>
        <span class="rounded-full px-3 py-1" style="background-color: rgba(47,122,79,0.12); color: var(--color-success);">
          Present: {{ summary.present }}
        </span>
        <span class="rounded-full px-3 py-1" style="background-color: rgba(182,65,47,0.1); color: var(--color-danger);">
          Absent: {{ summary.absent }}
        </span>
        <span class="rounded-full px-3 py-1" style="background-color: rgba(92,102,99,0.12); color: var(--color-text-muted);">
          Not Marked: {{ summary.notMarked }}
        </span>
      </div>

      <div v-if="eventRegistrations.length === 0" class="rounded-lg border border-dashed p-10 text-center" style="border-color: var(--color-border);">
        <p class="font-display text-lg" style="color: var(--color-primary-dark);">No participants registered</p>
        <p class="text-sm mt-1" style="color: var(--color-text-muted);">
          Register participants for this event to track attendance.
        </p>
      </div>

      <template v-else>
        <!-- Mobile: stacked cards -->
        <div class="sm:hidden space-y-3">
          <div
            v-for="registration in eventRegistrations"
            :key="registration.id"
            class="rounded-lg border p-4 space-y-3"
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
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium border"
                style="border-color: var(--color-border); color: var(--color-success);"
                @click="markAttendance(registration.id, 'Present')"
              >
                Present
              </button>
              <button
                type="button"
                class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium border"
                style="border-color: var(--color-border); color: var(--color-danger);"
                @click="markAttendance(registration.id, 'Absent')"
              >
                Absent
              </button>
            </div>
          </div>
        </div>

        <!-- Tablet and up: table -->
        <div class="hidden sm:block rounded-lg border overflow-x-auto" style="border-color: var(--color-border); background-color: var(--color-surface);">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b text-left" style="border-color: var(--color-border); background-color: var(--color-surface-muted);">
                <th class="px-4 py-2 font-medium" style="color: var(--color-text);">Participant</th>
                <th class="px-4 py-2 font-medium" style="color: var(--color-text);">Email</th>
                <th class="px-4 py-2 font-medium" style="color: var(--color-text);">Status</th>
                <th class="px-4 py-2 font-medium text-right" style="color: var(--color-text);">Mark</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="registration in eventRegistrations"
                :key="registration.id"
                class="border-b last:border-0"
                style="border-color: var(--color-border);"
              >
                <td class="px-4 py-2" style="color: var(--color-text);">{{ registration.participantName }}</td>
                <td class="px-4 py-2" style="color: var(--color-text-muted);">{{ registration.email }}</td>
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
                      style="border-color: var(--color-border); color: var(--color-success);"
                      @click="markAttendance(registration.id, 'Present')"
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      class="rounded-md px-3 py-1 text-xs font-medium border"
                      style="border-color: var(--color-border); color: var(--color-danger);"
                      @click="markAttendance(registration.id, 'Absent')"
                    >
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
  </section>
</template>
