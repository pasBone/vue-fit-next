import { describe, expect, it } from 'vitest'
import { createAnimationFrames, resolveAnimateOptions } from '../src/animations'

describe('animation configuration', () => {
  it('merges defaults, global options, and element options', () => {
    const options = resolveAnimateOptions({
      enter: 'slideInLeft',
      leave: { name: 'slideOutRight', duration: 800 },
    }, {
      enter: { delay: 100 },
      leave: { duration: 1200 },
    })

    expect(options.enter).toEqual({
      name: 'slideInLeft',
      duration: 500,
      delay: 100,
    })
    expect(options.leave).toEqual({
      name: 'slideOutRight',
      duration: 1200,
      delay: 0,
    })
  })

  it('creates valid pixel values for vertical leave animations', () => {
    const frames = createAnimationFrames(0.5, 10, 20, 'example')

    expect(frames.slideOutUp).toContain('translate3d(10px, 20px, 0)')
    expect(frames.slideOutDown).toContain('translate3d(10px, 20px, 0)')
  })
})
