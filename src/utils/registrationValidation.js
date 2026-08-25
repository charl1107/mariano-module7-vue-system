// Extracted from RegistrationForm.vue's handleSubmit() so the validation
// rules can be unit tested independently of the component.

// BUG-01 FIX: previously this only checked that the email field was
// non-empty, so values like "not-an-email" were accepted. This regex
// requires a basic local-part@domain.tld shape.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegistration(form) {
  const errors = []

  if (!form.participantName || !form.participantName.trim()) {
    errors.push('Participant name is required')
  }

  if (!form.email || !form.email.trim()) {
    errors.push('Email is required')
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.push('Please enter a valid email address')
  }

  if (!form.eventId) {
    errors.push('Event is required')
  }

  return { valid: errors.length === 0, errors }
}
