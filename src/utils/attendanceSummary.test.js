import { describe, it, expect } from 'vitest'
import { getAttendanceSummary } from './attendanceSummary'

describe('getAttendanceSummary', () => {
  it('counts present, absent, and not-marked correctly', () => {
    const registrations = [
      { attendanceStatus: 'Present' },
      { attendanceStatus: 'Present' },
      { attendanceStatus: 'Absent' },
      { attendanceStatus: 'Not Marked' },
    ]
    expect(getAttendanceSummary(registrations)).toEqual({
      total: 4,
      present: 2,
      absent: 1,
      notMarked: 1,
    })
  })

  it('handles an event with no registrations', () => {
    expect(getAttendanceSummary([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      notMarked: 0,
    })
  })
})
