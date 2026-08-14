import { describe, expect, it } from 'vitest'
import { calculateTranslate, getTransformOrigin, normalizeOrigin } from '../src/layout'

const metrics = {
  viewportWidth: 1920,
  viewportHeight: 1080,
  elementWidth: 400,
  elementHeight: 200,
  offsetTop: 50,
  offsetLeft: 100,
  offsetRight: 20,
  offsetBottom: 30,
}

describe('layout calculations', () => {
  it('normalizes missing and unsupported origins', () => {
    expect(normalizeOrigin()).toBe('left')
    expect(normalizeOrigin('unsupported')).toBe('left')
    expect(normalizeOrigin('centerCenter')).toBe('centerCenter')
  })

  it('calculates translations from horizontal and vertical alignment', () => {
    expect(calculateTranslate(metrics, 0.5, 'leftTop')).toEqual({ x: -50, y: -25 })
    expect(calculateTranslate(metrics, 0.5, 'centerCenter')).toEqual({ x: 810, y: 465 })
    expect(calculateTranslate(metrics, 0.5, 'rightBottom')).toEqual({ x: 10, y: 15 })
  })

  it('maps origins to the existing transform-origin behavior', () => {
    expect(getTransformOrigin('leftCenter')).toBe('left top')
    expect(getTransformOrigin('centerBottom')).toBe('left bottom')
    expect(getTransformOrigin('rightBottom')).toBe('right bottom')
  })
})
