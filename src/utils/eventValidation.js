// Extracted from EventForm.vue's handleSubmit() so the validation
// rules can be unit tested independently of the component.
export function validateEvent(form) {
  const errors = []

  if (!form.title || !form.title.trim()) errors.push('Title is required')
  if (!form.description || !form.description.trim()) errors.push('Description is required')
  if (!form.eventDate) errors.push('Event date is required')
  if (!form.location || !form.location.trim()) errors.push('Location is required')

  return { valid: errors.length === 0, errors }
}
