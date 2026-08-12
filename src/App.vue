<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import LoginView from './components/LoginView.vue'
import AppHeader from './components/AppHeader.vue'
import EventForm from './components/EventForm.vue'
import EventList from './components/EventList.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import RegistrationList from './components/RegistrationList.vue'
import AttendanceTracker from './components/AttendanceTracker.vue'
import ReportsView from './components/ReportsView.vue'
import AppFooter from './components/AppFooter.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import EditEventModal from './components/EditEventModal.vue'
import EditRegistrationModal from './components/EditRegistrationModal.vue'

const EVENTS_KEY = 'event-management-events'
const REGISTRATIONS_KEY = 'event-management-registrations'
const AUTH_KEY = 'event-management-auth'
const THEME_KEY = 'event-management-theme'
const NAV_KEY = 'event-management-nav'

// Hardcoded sample data. There is no backend/database yet (see architecture.md
// §9 Architectural Limitations) — these seed records stand in for it so the
// interface has something to display on first load.
const SAMPLE_EVENTS = [
  {
    id: 1001,
    title: 'Freshman Orientation Day',
    description: 'Welcome program for incoming first-year students, including campus tour and org fair.',
    eventDate: '2026-08-18',
    location: 'University Gymnasium',
    status: 'Upcoming',
    createdAt: '2026-07-01T09:00:00.000Z',
    updatedAt: '2026-07-01T09:00:00.000Z',
  },
  {
    id: 1002,
    title: 'Software Engineering Symposium',
    description: 'Student paper presentations and guest talks on modern software development practices.',
    eventDate: '2026-09-05',
    location: 'School of Computer Studies Auditorium',
    status: 'Upcoming',
    createdAt: '2026-07-03T10:30:00.000Z',
    updatedAt: '2026-07-03T10:30:00.000Z',
  },
  {
    id: 1003,
    title: 'Intramurals Opening Ceremony',
    description: 'Kick-off program for the annual intramural sports tournament.',
    eventDate: '2026-06-20',
    location: 'Sports Complex Field',
    status: 'Completed',
    createdAt: '2026-05-15T08:00:00.000Z',
    updatedAt: '2026-06-21T14:00:00.000Z',
  },
  {
    id: 1004,
    title: 'Career and Job Fair',
    description: 'On-campus recruitment event with partner companies from various industries.',
    eventDate: '2026-10-02',
    location: 'Student Center Hall',
    status: 'Upcoming',
    createdAt: '2026-07-10T11:00:00.000Z',
    updatedAt: '2026-07-10T11:00:00.000Z',
  },
]

const SAMPLE_REGISTRATIONS = [
  {
    id: 2001,
    participantName: 'Maria Santos',
    email: 'maria.santos@example.com',
    eventId: 1001,
    registeredAt: '2026-07-05T09:00:00.000Z',
    attendanceStatus: 'Not Marked',
  },
  {
    id: 2002,
    participantName: 'Jose Ramirez',
    email: 'jose.ramirez@example.com',
    eventId: 1001,
    registeredAt: '2026-07-06T10:00:00.000Z',
    attendanceStatus: 'Not Marked',
  },
  {
    id: 2003,
    participantName: 'Angela Cruz',
    email: 'angela.cruz@example.com',
    eventId: 1003,
    registeredAt: '2026-05-20T08:00:00.000Z',
    attendanceStatus: 'Present',
  },
  {
    id: 2004,
    participantName: 'Mark Villanueva',
    email: 'mark.villanueva@example.com',
    eventId: 1003,
    registeredAt: '2026-05-21T08:00:00.000Z',
    attendanceStatus: 'Absent',
  },
  {
    id: 2005,
    participantName: 'Kim Torres',
    email: 'kim.torres@example.com',
    eventId: 1002,
    registeredAt: '2026-07-12T13:00:00.000Z',
    attendanceStatus: 'Not Marked',
  },
]

// --- Auth (hardcoded, prototype only) ---
const isAuthenticated = ref(false)
const username = ref('')

// --- Dark mode ---
const isDarkMode = ref(false)

function applyDarkModeClass() {
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  if (isDarkMode.value) {
    document.documentElement.style.backgroundColor = '#14201d'
    document.documentElement.style.color = '#edf2ef'
  } else {
    document.documentElement.style.backgroundColor = '#f6f4ee'
    document.documentElement.style.color = '#22282a'
  }
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem(THEME_KEY, isDarkMode.value ? 'dark' : 'light')
  applyDarkModeClass()
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  isDarkMode.value = savedTheme === 'dark'
  applyDarkModeClass()

  const savedAuth = localStorage.getItem(AUTH_KEY)
  if (savedAuth) {
    const parsed = JSON.parse(savedAuth)
    isAuthenticated.value = true
    username.value = parsed.username

    // Restore the last active tab when reloading while already logged in
    const savedNav = localStorage.getItem(NAV_KEY)
    if (savedNav) {
      currentView.value = savedNav
    }
  }

  const savedEvents = localStorage.getItem(EVENTS_KEY)
  if (savedEvents) {
    events.value = JSON.parse(savedEvents)
  } else {
    events.value = SAMPLE_EVENTS
    saveEvents()
  }

  const savedRegistrations = localStorage.getItem(REGISTRATIONS_KEY)
  if (savedRegistrations) {
    registrations.value = JSON.parse(savedRegistrations)
  } else {
    registrations.value = SAMPLE_REGISTRATIONS
    saveRegistrations()
  }
})

function handleLogin(name) {
  isAuthenticated.value = true
  username.value = name
  currentView.value = 'events'
  localStorage.setItem(AUTH_KEY, JSON.stringify({ username: name }))
  localStorage.setItem(NAV_KEY, 'events')
}

function handleLogout() {
  isAuthenticated.value = false
  username.value = ''
  currentView.value = 'events'
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(NAV_KEY)
}

// --- View navigation ---
const currentView = ref('events')
function navigate(view) {
  currentView.value = view
  localStorage.setItem(NAV_KEY, view)
}

// --- Feedback banner ---
const feedback = ref(null) // { type: 'success' | 'error', message: string }
function showFeedback(type, message) {
  feedback.value = { type, message }
  setTimeout(() => {
    feedback.value = null
  }, 3000)
}

// --- Confirm modal ---
const confirmModal = reactive({
  show: false,
  title: '',
  message: '',
  confirmText: 'Delete',
  variant: 'danger',
  onConfirm: null,
})

function showConfirmModal({ title, message, confirmText = 'Delete', variant = 'danger', onConfirm }) {
  confirmModal.show = true
  confirmModal.title = title
  confirmModal.message = message
  confirmModal.confirmText = confirmText
  confirmModal.variant = variant
  confirmModal.onConfirm = onConfirm
}

function handleConfirm() {
  if (confirmModal.onConfirm) confirmModal.onConfirm()
  confirmModal.show = false
}

function handleCancelConfirm() {
  confirmModal.show = false
}

// --- Events (Event Management) ---
const events = ref([])
const eventSearchTerm = ref('')
const editingEventId = ref(null)
const showAddEventModal = ref(false)

function saveEvents() {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events.value))
}

const filteredEvents = computed(() => {
  const keyword = eventSearchTerm.value.toLowerCase().trim()
  if (!keyword) return events.value
  return events.value.filter((event) => event.title.toLowerCase().includes(keyword))
})

const editingEvent = computed(() =>
  editingEventId.value === null
    ? null
    : events.value.find((event) => event.id === editingEventId.value) || null
)

function addEvent(newEvent) {
  const now = new Date().toISOString()
  events.value.push({ id: Date.now(), ...newEvent, createdAt: now, updatedAt: now })
  saveEvents()
  showAddEventModal.value = false
  showFeedback('success', 'Event added.')
}

function updateEvent(updatedEvent) {
  const index = events.value.findIndex((event) => event.id === editingEventId.value)
  if (index === -1) return
  events.value[index] = { ...events.value[index], ...updatedEvent, updatedAt: new Date().toISOString() }
  saveEvents()
  editingEventId.value = null
  showFeedback('success', 'Event updated.')
}

function deleteEvent(id) {
  const event = events.value.find((e) => e.id === id)
  showConfirmModal({
    title: 'Delete Event',
    message: `Are you sure you want to delete "${event?.title || 'this event'}"? Related registrations will also be removed.`,
    confirmText: 'Delete',
    variant: 'danger',
    onConfirm: () => {
      events.value = events.value.filter((event) => event.id !== id)
      registrations.value = registrations.value.filter((r) => r.eventId !== id)
      saveEvents()
      saveRegistrations()
      if (editingEventId.value === id) editingEventId.value = null
      showFeedback('success', 'Event deleted.')
    },
  })
}

function startEditEvent(id) {
  const event = events.value.find((e) => e.id === id)
  showConfirmModal({
    title: 'Edit Event',
    message: `Are you sure you want to edit "${event?.title || 'this event'}"?`,
    confirmText: 'Edit',
    variant: 'primary',
    onConfirm: () => {
      editingEventId.value = id
    },
  })
}
function cancelEditEvent() {
  editingEventId.value = null
}

// --- Registrations (Participant Registration + Attendance Tracking) ---
const registrations = ref([])
const registrationSearchTerm = ref('')
const editingRegistrationId = ref(null)
const showAddRegistrationModal = ref(false)

function saveRegistrations() {
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations.value))
}

function getEventTitle(eventId) {
  return events.value.find((e) => e.id === eventId)?.title ?? 'Unknown Event'
}

const filteredRegistrations = computed(() => {
  const keyword = registrationSearchTerm.value.toLowerCase().trim()
  if (!keyword) return registrations.value
  return registrations.value.filter((r) => r.participantName.toLowerCase().includes(keyword))
})

const editingRegistration = computed(() =>
  editingRegistrationId.value === null
    ? null
    : registrations.value.find((r) => r.id === editingRegistrationId.value) || null
)

function addRegistration(newRegistration) {
  registrations.value.push({
    id: Date.now(),
    ...newRegistration,
    registeredAt: new Date().toISOString(),
    attendanceStatus: 'Not Marked',
  })
  saveRegistrations()
  showAddRegistrationModal.value = false
  showFeedback('success', 'Participant registered.')
}

function updateRegistration(updatedRegistration) {
  const index = registrations.value.findIndex((r) => r.id === editingRegistrationId.value)
  if (index === -1) return
  registrations.value[index] = { ...registrations.value[index], ...updatedRegistration }
  saveRegistrations()
  editingRegistrationId.value = null
  showFeedback('success', 'Registration updated.')
}

function deleteRegistration(id) {
  const reg = registrations.value.find((r) => r.id === id)
  showConfirmModal({
    title: 'Delete Registration',
    message: `Are you sure you want to delete the registration for "${reg?.participantName || 'this participant'}"?`,
    confirmText: 'Delete',
    variant: 'danger',
    onConfirm: () => {
      registrations.value = registrations.value.filter((r) => r.id !== id)
      saveRegistrations()
      if (editingRegistrationId.value === id) editingRegistrationId.value = null
      showFeedback('success', 'Registration deleted.')
    },
  })
}

function startEditRegistration(id) {
  const reg = registrations.value.find((r) => r.id === id)
  showConfirmModal({
    title: 'Edit Registration',
    message: `Are you sure you want to edit the registration for "${reg?.participantName || 'this participant'}"?`,
    confirmText: 'Edit',
    variant: 'primary',
    onConfirm: () => {
      editingRegistrationId.value = id
    },
  })
}
function cancelEditRegistration() {
  editingRegistrationId.value = null
}

function markAttendance(registrationId, status) {
  const index = registrations.value.findIndex((r) => r.id === registrationId)
  if (index === -1) return
  registrations.value[index] = { ...registrations.value[index], attendanceStatus: status }
  saveRegistrations()
  showFeedback('success', `Marked ${registrations.value[index].participantName} as ${status}.`)
}

function handleValidationError(message) {
  showFeedback('error', message)
}
</script>

<template>
  <LoginView v-if="!isAuthenticated" :is-dark-mode="isDarkMode" @login="handleLogin" @toggle-dark-mode="toggleDarkMode" />

  <div v-else class="min-h-screen flex flex-col">
    <AppHeader
      :current-view="currentView"
      :username="username"
      :is-dark-mode="isDarkMode"
      @navigate="navigate"
      @logout="handleLogout"
      @toggle-dark-mode="toggleDarkMode"
    />

    <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div
        v-if="feedback"
        class="rounded-md px-4 py-3 text-sm font-medium border"
        :class="feedback.type === 'success'
          ? 'bg-[color:var(--color-success)]/10 text-[color:var(--color-success)] border-[color:var(--color-success)]/30'
          : 'bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)] border-[color:var(--color-danger)]/30'"
      >
        {{ feedback.message }}
      </div>

      <template v-if="currentView === 'events'">
        <EventList
          :events="filteredEvents"
          :total-count="events.length"
          v-model:search-term="eventSearchTerm"
          @edit="startEditEvent"
          @delete="deleteEvent"
        >
          <template #action>
            <button
              type="button"
              class="w-full sm:w-auto rounded-md px-4 py-2 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              style="background-color: var(--color-primary);"
              @click="showAddEventModal = true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Event
            </button>
          </template>
        </EventList>
      </template>

      <template v-else-if="currentView === 'registrations'">
        <RegistrationList
          :registrations="filteredRegistrations"
          :total-count="registrations.length"
          :get-event-title="getEventTitle"
          v-model:search-term="registrationSearchTerm"
          @edit="startEditRegistration"
          @delete="deleteRegistration"
        >
          <template #action>
            <button
              type="button"
              class="w-full sm:w-auto rounded-md px-4 py-2 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              style="background-color: var(--color-primary);"
              @click="showAddRegistrationModal = true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Register Participant
            </button>
          </template>
        </RegistrationList>
      </template>

      <template v-else-if="currentView === 'attendance'">
        <AttendanceTracker :events="events" :registrations="registrations" @mark="markAttendance" />
      </template>

      <template v-else-if="currentView === 'reports'">
        <ReportsView :events="events" :registrations="registrations" />
      </template>
    </main>

    <AppFooter />
  </div>

  <!-- Confirm modal (shared across all views) -->
  <ConfirmModal
    :show="confirmModal.show"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :confirm-text="confirmModal.confirmText"
    :variant="confirmModal.variant"
    @confirm="handleConfirm"
    @cancel="handleCancelConfirm"
  />

  <!-- Edit modals -->
  <EditEventModal
    :show="editingEventId !== null"
    :event="editingEvent"
    @save="updateEvent"
    @cancel="cancelEditEvent"
    @validation-error="handleValidationError"
  />

  <EditRegistrationModal
    :show="editingRegistrationId !== null"
    :registration="editingRegistration"
    :events="events"
    @save="updateRegistration"
    @cancel="cancelEditRegistration"
    @validation-error="handleValidationError"
  />

  <!-- Add Event modal overlay -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showAddEventModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @mousedown.self="showAddEventModal = false"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>
        <div
          class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border shadow-2xl"
          style="background-color: var(--color-surface); border-color: var(--color-border);"
        >
          <button
            type="button"
            class="absolute top-3 right-3 rounded-md p-1.5 z-10"
            style="color: var(--color-text-muted);"
            aria-label="Close"
            @click="showAddEventModal = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <EventForm
            @submit="addEvent"
            @validation-error="handleValidationError"
          />
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Add Registration modal overlay -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showAddRegistrationModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @mousedown.self="showAddRegistrationModal = false"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>
        <div
          class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border shadow-2xl"
          style="background-color: var(--color-surface); border-color: var(--color-border);"
        >
          <button
            type="button"
            class="absolute top-3 right-3 rounded-md p-1.5 z-10"
            style="color: var(--color-text-muted);"
            aria-label="Close"
            @click="showAddRegistrationModal = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <RegistrationForm
            :events="events"
            @submit="addRegistration"
            @validation-error="handleValidationError"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
