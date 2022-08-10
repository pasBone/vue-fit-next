import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { ElementOptions, FitOptions } from './types'
import { setAnimate } from './animations' // 动画相关

/**
 *  -----------
 * | 1 | 2 | 3 |
 *  -----------
 * | 4 | 5 | 6 |
 *  -----------
 * | 7 | 8 | 9 |
 *  -----------
 */

export const TRANSFORM_ORIGIN = {
  // 上边部分
  1: 'left top',
  2: 'center top',
  3: 'right top',
  // 中间部分
  4: 'left center',
  5: 'center center',
  6: 'right center',
  // 下边部分
  7: 'left bottom',
  8: 'center bottom',
  9: 'right bottom',
  // 上部分简写
  left: 'left top',
  center: 'center top',
  right: 'right top',
}

/** 默认全局的配置  */
let defaultFitOptions: FitOptions

/** 收集已经注册过的元素集合. */
export const elements = new Map<HTMLElement, ElementOptions>()

/**
 * 根据窗口大小计算元素的比例.
 */
export function getElementScale(): number {
  const w = window.innerWidth / defaultFitOptions.width
  const h = window.innerHeight / defaultFitOptions.height
  const scale = Math.min(w, h) // 宽度与高度的比例取最小的，以确保屏幕可以完全显示
  return scale
}

/**
 * 设置单个元素的scale.
 */
export function setElementScale(el: HTMLElement, scale: number, options: ElementOptions) {
  const hasScale = el.style.transform.includes('scale')
  const scaleStr = `scale(${scale}, ${scale})`

  if (!hasScale)
    el.style.transform += scaleStr

  Object.assign(el.style, {
    pointerEvents: 'none',
    userSelect: 'none',
    transformOrigin: TRANSFORM_ORIGIN[options.origin],
    transform: el.style.transform.replace(/scale\(.+?\)/g, scaleStr),
  })
}

/** 指令对应的生命周期  */
export function directiveHooks(fitOptions: FitOptions): ObjectDirective {
  defaultFitOptions = fitOptions

  // 首次计算scale
  const scale = getElementScale()

  return {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      el.dataset.fit = ''
      const { arg, value } = binding
      const options: ElementOptions = {
        origin: value?.origin || arg || 'left',
        animate: value?.animate,
        scale,
      }

      // 缓存注册过指令的元素
      elements.set(el, options)

      // 初始化时给每个元素设置scale
      setElementScale(el, scale, options)

      // 给每个元素添加动画
      setAnimate(el, options, defaultFitOptions)
    },

    unmounted(el) {
      elements.delete(el)
    },
  }
}

