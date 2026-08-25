// Extracted from AttendanceTracker.vue's summary computed property.
export function getAttendanceSummary(registrations) {
  const present = registrations.filter((r) => r.attendanceStatus === 'Present').length
  const absent = registrations.filter((r) => r.attendanceStatus === 'Absent').length
  const notMarked = registrations.length - present - absent
  return { total: registrations.length, present, absent, notMarked }
}
