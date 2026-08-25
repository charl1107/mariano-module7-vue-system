import { describe, it, expect } from 'vitest'
import { filterByKeyword } from './filterByKeyword'

describe('filterByKeyword', () => {
  const events = [
    { id: 1, title: 'Freshman Orientation Day' },
    { id: 2, title: 'Career and Job Fair' },
  ]

  it('matches case-insensitively', () => {
    const result = filterByKeyword(events, 'JOB FAIR', 'title')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Career and Job Fair')
  })

  it('returns the full list when the keyword is empty', () => {
    expect(filterByKeyword(events, '', 'title')).toHaveLength(2)
  })
})
