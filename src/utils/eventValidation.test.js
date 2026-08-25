import { describe, it, expect } from 'vitest'
import { validateEvent } from './eventValidation'

describe('validateEvent', () => {
  it('accepts a fully completed event', () => {
    const result = validateEvent({
      title: 'Software Engineering Symposium',
      description: 'Guest talks on modern development practices.',
      eventDate: '2026-09-05',
      location: 'SCS Auditorium',
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects an event with a whitespace-only title', () => {
    const result = validateEvent({
      title: '   ',
      description: 'Some description',
      eventDate: '2026-09-05',
      location: 'SCS Auditorium',
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Title is required')
  })
})
