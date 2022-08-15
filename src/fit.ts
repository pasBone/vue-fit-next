/* eslint-disable import/no-mutable-exports */
import { Subject } from 'rxjs'
import type { DirectiveBinding, ObjectDirective } from 'vue'
import { nanoId } from './utils'
import type { ElementOptions, FitOptions, TransformOrigin } from './types'
import './events' // 事件相关

/** 元素的变换值. */
export const element$ = new Subject<HTMLElement | number>()

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
export let defaultFitOptions: FitOptions

/** 收集已经注册过的元素集合. */
export const elements = new Map<HTMLElement, ElementOptions>()

/**
 * 根据窗口大小计算元素的比例.
 */
export function getElementScale(): number {
  // const vertical = ['1', '4', '7', '3', '6', '9', 'left']
  // const horizontal = ['2', '8', 'right']
  // const center = [5, 'center']
  // if (vertical.includes(origin))
  //   return window.innerHeight / defaultFitOptions.height

  // if (horizontal.includes(origin))
  //   return window.innerWidth / defaultFitOptions.width

  // if (center.includes(origin))
  //   return (window.innerWidth / defaultFitOptions.width + window.innerHeight / defaultFitOptions.height) / 2

  const w = window.innerWidth / defaultFitOptions.width
  const h = window.innerHeight / defaultFitOptions.height
  const scale = Math.min(w, h) // 宽度与高度的比例取最小的，以确保屏幕可以完全显示
  return scale
}

function getTranslate(el: HTMLElement, scale: number, origin: TransformOrigin) {
  if (origin === '3' || origin === 'right')
    return { x: el.clientWidth - el.clientWidth * scale, y: 0 }

  return { x: 0, y: 0 }
}

/**
 * 设置单个元素的scale.
 */
export function setElementTransform(el: HTMLElement) {
  const { scale, origin } = elements.get(el)!
  const { x, y } = getTranslate(el, scale, origin)
  if (defaultFitOptions.mode === 'zoom') {
    Object.assign(el.style, { zoom: scale })
  }
  else {
    Object.assign(el.style, {
      // transformOrigin: TRANSFORM_ORIGIN[options.origin],
      // transform: el.style.transform.replace(/scale\(.+?\)/g, scaleStr),
      // transform: `matrix(${scale}, 0, 0, ${scale}, ${getTranslate(el, scale, options.origin)})`,
      transformOrigin: 'left top',
      transform: `translate(${x}px, ${y}px) scale(${scale}, ${scale})`,
    })
  }
}

/** 更新每个元素的 option transform 值 */
export function setElementOptions(el: HTMLElement, options: Partial<ElementOptions>) {
  const result = Object.assign({}, elements.get(el), options)
  const { scale, origin } = result
  const { x, y } = getTranslate(el, scale, origin)
  // 缓存注册过指令的元素及配置
  elements.set(el, Object.assign({}, elements.get(el), {
    ...result,
    x,
    y,
  }))
  // 通知订阅者
  element$.next(el)
}

/** 指令对应的生命周期  */
export function directiveHooks(fitOptions: FitOptions): ObjectDirective {
  defaultFitOptions = fitOptions

  return {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const scale = getElementScale()
      const id = nanoId(8)
      el.dataset.fit = id

      const { arg, value } = binding

      const origin = value?.origin || arg || 'left'

      // 添加基本属性值
      setElementOptions(el, {
        animate: value?.animate,
        origin,
        scale,
        nanoId: id,
      })
    },

    unmounted(el) {
      elements.delete(el)
    },
  }
}

/**
 * 订阅 element，缩放元素及更新样式规则.
 */
element$.subscribe((value) => {
  if (typeof value === 'number') {
    elements.forEach((opt, el) => {
      setElementOptions(el, { scale: value })
      setElementTransform(el)
    })
  }
  else {
    setElementTransform(value)
  }
})
