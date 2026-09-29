import { describe, expect, it } from 'vitest'
import { initialTasks, loadInitialTasks } from './tasks.js'

describe('loadInitialTasks', () => {
  it('returns a copied list of the hardcoded activities', async () => {
    const tasks = await loadInitialTasks({ delay: 0 })

    expect(tasks).toEqual(initialTasks)
    expect(tasks).not.toBe(initialTasks)
    expect(tasks[0]).not.toBe(initialTasks[0])
  })

  it('supports the empty-state demonstration', async () => {
    await expect(loadInitialTasks({ simulateEmpty: true, delay: 0 })).resolves.toEqual([])
  })

  it('supports the error-state demonstration', async () => {
    await expect(loadInitialTasks({ simulateError: true, delay: 0 })).rejects.toThrow(
      'The activity data could not be loaded.',
    )
  })
})
