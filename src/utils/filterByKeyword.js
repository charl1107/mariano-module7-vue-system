// Extracted from App.vue's filteredEvents/filteredRegistrations computed
// properties. `field` is the property to match against (e.g. 'title' for
// events, 'participantName' for registrations).
export function filterByKeyword(list, keyword, field) {
  const term = (keyword || '').toLowerCase().trim()
  if (!term) return list
  return list.filter((item) => (item[field] || '').toLowerCase().includes(term))
}
