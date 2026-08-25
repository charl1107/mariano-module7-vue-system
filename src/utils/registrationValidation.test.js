import { describe, it, expect } from 'vitest'
import { validateRegistration } from './registrationValidation'

describe('validateRegistration', () => {
  it('accepts a complete, valid registration', () => {
    const result = validateRegistration({
      participantName: 'Maria Santos',
      email: 'maria.santos@example.com',
      eventId: 1001,
    })
    expect(result.valid).toBe(true)
  })

  it('rejects a registration with no event selected', () => {
    const result = validateRegistration({
      participantName: 'Maria Santos',
      email: 'maria.santos@example.com',
      eventId: '',
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Event is required')
  })

  // DEFECT TEST — expected to FAIL before the fix.
  // The current validateRegistration() only checks that the email field
  // is non-empty; it does not check the email is actually well-formed,
  // so a value like "not-an-email" is currently accepted as valid.
  it('rejects a registration with an invalid email format', () => {
    const result = validateRegistration({
      participantName: 'Maria Santos',
      email: 'not-an-email',
      eventId: 1001,
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Please enter a valid email address')
  })
})
