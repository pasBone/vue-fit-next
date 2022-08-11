import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { ElementOptions, FitOptions, TransformOrigin } from './types'
import { setAnimate } from './animations' // 动画相关
import './events' // 事件相关

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
  4: 'left top',
  5: 'center center',
  6: 'right center',
  // 下边部分
  7: 'left top',
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
export function getElementScale(origin: TransformOrigin): number {
  const vertical = ['1', '4', '7', '3', '6', '9', 'left']
  const horizontal = ['2', '8', 'right']
  const center = [5, 'center']
  if (vertical.includes(origin))
    return window.innerHeight / defaultFitOptions.height

  if (horizontal.includes(origin))
    return window.innerWidth / defaultFitOptions.width

  if (center.includes(origin))
    return (window.innerWidth / defaultFitOptions.width + window.innerHeight / defaultFitOptions.height) / 2

  return 1
}

/**
 * 设置单个元素的scale.
 */
export function setElementScale(el: HTMLElement, scale: number, options: ElementOptions) {
  if (defaultFitOptions.mode === 'zoom') {
    Object.assign(el.style, { zoom: scale })
  }
  else {
    Object.assign(el.style, {
      // transformOrigin: TRANSFORM_ORIGIN[options.origin],
      transformOrigin: 'left top',
      // transform: el.style.transform.replace(/scale\(.+?\)/g, scaleStr),
      transform: `matrix(${scale}, 0, 0, ${scale}, ${el.clientWidth - el.clientWidth * scale}, 0)`,
      // transform: `translate(0px, 0px) scale(${scale}, ${scale})`,
    })
  }
}

/** 指令对应的生命周期  */
export function directiveHooks(fitOptions: FitOptions): ObjectDirective {
  defaultFitOptions = fitOptions

  return {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      el.dataset.fit = ''

      const { arg, value } = binding

      const origin = value?.origin || arg || 'left'

      const scale = getElementScale(origin)

      const options: ElementOptions = {
        animate: value?.animate,
        origin,
        scale,
      }

      // 缓存注册过指令的元素
      elements.set(el, options)

      // 初始化时给每个元素设置scale
      setElementScale(el, scale, options)

      // 给每个元素添加动画
      // setAnimate(el, options, defaultFitOptions)
    },

    unmounted(el) {
      elements.delete(el)
    },
  }
}

