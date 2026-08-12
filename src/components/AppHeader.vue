<script setup>
import { ref } from 'vue'

defineProps({
  currentView: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: '',
  },
  isDarkMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate', 'logout', 'toggle-dark-mode'])

const NAV_ITEMS = [
  { key: 'events', label: 'Events' },
  { key: 'registrations', label: 'Registrations' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'reports', label: 'Reports' },
]

const mobileMenuOpen = ref(false)

function selectNav(key) {
  emit('navigate', key)
  mobileMenuOpen.value = false
}

function handleLogout() {
  mobileMenuOpen.value = false
  emit('logout')
}
</script>

<template>
  <header class="border-b" style="border-color: var(--color-border); background-color: var(--color-surface);">
    <div class="px-6 sm:px-10 lg:px-16 py-4">
      <div class="flex items-center justify-between gap-2 sm:gap-4">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src="/ems_logo.svg"
            alt="EMS Logo"
            class="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] shrink-0 rounded-full object-contain"
          />
          <div class="min-w-0">
            <h1 class="font-display text-base sm:text-xl lg:text-2xl font-semibold tracking-tight leading-tight" style="color: var(--color-primary-dark);">
              Event Management System
            </h1>
            <p class="text-xs hidden sm:block" style="color: var(--color-text-muted);">
              Create, review, and manage your events in one place.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <span class="text-sm hidden md:inline" style="color: var(--color-text-muted);">
            {{ username }}
          </span>

          <!-- Dark mode toggle: always visible, sits where Log Out used to be -->
          <button
            type="button"
            class="rounded-md p-2 border"
            style="border-color: var(--color-border); color: var(--color-primary-dark);"
            :aria-pressed="isDarkMode"
            aria-label="Toggle dark mode"
            @click="emit('toggle-dark-mode')"
          >
            <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <!-- Log Out: visible directly from tablet width up (no hamburger there) -->
          <button
            type="button"
            class="hidden sm:inline-flex rounded-md px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border whitespace-nowrap"
            style="border-color: var(--color-border); color: var(--color-text-muted);"
            @click="emit('logout')"
          >
            Log Out
          </button>

          <!-- Hamburger toggle: mobile only. Holds nav + Log Out. -->
          <button
            type="button"
            class="sm:hidden rounded-md p-2 border"
            style="border-color: var(--color-border); color: var(--color-primary-dark);"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle navigation menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tablet and up: horizontal tabs, always visible -->
      <nav class="hidden sm:flex gap-1 mt-4 -mb-px">
        <button
          v-for="item in NAV_ITEMS"
          :key="item.key"
          type="button"
          class="px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
          :style="currentView === item.key
            ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary-dark)' }
            : { borderColor: 'transparent', color: 'var(--color-text-muted)' }"
          @click="selectNav(item.key)"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- Mobile: dropdown menu, nav items + Log Out, only when toggled open -->
      <nav v-if="mobileMenuOpen" class="sm:hidden mt-3 flex flex-col gap-1 border-t pt-3" style="border-color: var(--color-border);">
        <button
          v-for="item in NAV_ITEMS"
          :key="item.key"
          type="button"
          class="text-left px-3 py-2 rounded-md text-sm font-medium"
          :style="currentView === item.key
            ? { backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-primary-dark)' }
            : { color: 'var(--color-text-muted)' }"
          @click="selectNav(item.key)"
        >
          {{ item.label }}
        </button>

        <div class="border-t mt-1 pt-1" style="border-color: var(--color-border);">
          <button
            type="button"
            class="w-full text-left px-3 py-2 rounded-md text-sm font-medium"
            style="color: var(--color-danger);"
            @click="handleLogout"
          >
            Log Out
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>
