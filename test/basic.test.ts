import { describe, expect, it } from 'vitest'
import FitPlugin from '../src'

describe('FitPlugin', () => {
  it('can be imported without browser globals', () => {
    expect(typeof FitPlugin).toBe('function')
  })
})
