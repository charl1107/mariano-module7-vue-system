<script setup>
import { reactive, ref } from 'vue'

defineProps({
  isDarkMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['login', 'toggle-dark-mode'])

// Hardcoded credentials. There is no authentication backend yet — this is a
// prototype-only gate so the "User Authentication" feature has an interface.
const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'admin123'

const form = reactive({ username: '', password: '' })
const error = ref('')
const showPassword = ref(false)

function handleSubmit() {
  if (!form.username.trim() || !form.password.trim()) {
    error.value = 'Please enter both a username and a password.'
    return
  }

  if (form.username.trim() === VALID_USERNAME && form.password === VALID_PASSWORD) {
    error.value = ''
    emit('login', form.username.trim())
  } else {
    error.value = 'Incorrect username or password.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 relative">
    <!-- Dark mode toggle -->
    <button
      type="button"
      class="absolute top-4 right-4 rounded-md p-2 border"
      style="border-color: var(--color-border); color: var(--color-primary-dark); background-color: var(--color-surface);"
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
    <div
      class="w-full max-w-sm rounded-lg border p-6 sm:p-8"
      style="background-color: var(--color-surface); border-color: var(--color-border);"
    >
      <div class="text-center mb-6">
        <img
          src="/ems_logo.svg"
          alt="EMS Logo"
          class="w-[100px] h-[100px] mx-auto mb-3 rounded-full object-contain"
        />
        <h1 class="font-display text-xl font-semibold" style="color: var(--color-primary-dark);">
          Event Management System
        </h1>
        <p class="text-sm mt-1" style="color: var(--color-text-muted);">
          Sign in to continue
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="username" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
            Username
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            autocomplete="username"
            class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-1" style="color: var(--color-text);">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="w-full rounded-md border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2"
              style="border-color: var(--color-border); background-color: var(--color-bg); --tw-ring-color: var(--color-primary);"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
              style="color: var(--color-text-muted);"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <!-- Eye icon (password hidden — click to show) -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <!-- Eye-off icon (password visible — click to hide) -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <p v-if="error" class="text-sm font-medium" style="color: var(--color-danger);">
          {{ error }}
        </p>

        <button
          type="submit"
          class="w-full rounded-md px-4 py-2 text-sm font-medium text-white"
          style="background-color: var(--color-primary);"
        >
          Sign In
        </button>
      </form>

      <p class="text-xs text-center mt-5" style="color: var(--color-text-muted);">
        Demo credentials: <strong>admin</strong> / <strong>admin123</strong><br />
        (hardcoded — no authentication backend yet)
      </p>
    </div>
  </div>
</template>
