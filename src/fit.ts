/* eslint-disable import/no-mutable-exports */
import { Subject } from 'rxjs'
import type { DirectiveBinding, ObjectDirective } from 'vue'
import { getComputedStyleNumber, nanoId } from './utils'
import type { ElementOptions, FitOptions, Origin } from './types'
import './events' // 事件相关

/** 元素的变换值. */
export const element$ = new Subject<HTMLElement | null>()

/** 默认全局的配置  */
export let defaultFitOptions: FitOptions

/** 收集已经注册过的元素集合. */
export const elements = new Map<HTMLElement, ElementOptions>()

/**
 * 根据窗口大小计算元素的比例.
 */
export function getElementScale(lock: { x: boolean; y: boolean }): number {
  const scaleX = window.innerWidth / defaultFitOptions.width
  const scaleY = window.innerHeight / defaultFitOptions.height
  if (lock.x && lock.y)
    return (scaleX + scaleY) / 2

  if (lock.x)
    return scaleY

  if (lock.y)
    return scaleX

  const w = window.innerWidth / defaultFitOptions.width
  const h = window.innerHeight / defaultFitOptions.height
  const scale = Math.min(w, h) // 宽度与高度的比例取最小的，以确保屏幕可以完全显示
  return scale
}

/** 缓存 translate 值 */
function getTranslate(el: HTMLElement, scale: number, origin: Origin) {
  const offsetTop = el.offsetTop
  const offsetLeft = el.offsetLeft
  const offsetRight = (getComputedStyleNumber(el, 'right') + getComputedStyleNumber(el, 'margin-right'))
  const offsetBottom = (getComputedStyleNumber(el, 'bottom') + getComputedStyleNumber(el, 'margin-bottom'))

  if (origin === 'left' || origin === 'leftTop') {
    return {
      x: -offsetLeft + offsetLeft * scale,
      y: -offsetTop + offsetTop * scale,
    }
  }

  if (origin === 'center' || origin === 'centerTop') {
    return {
      x: (window.innerWidth - (el.clientWidth * scale)) / 2 - offsetLeft + offsetLeft * scale,
      y: -offsetTop + offsetTop * scale,
    }
  }

  if (origin === 'right' || origin === 'rightTop') {
    return {
      // x: (el.clientWidth - el.clientWidth * scale) + offsetRight * scale,
      x: offsetRight - offsetRight * scale,
      y: -offsetTop + offsetTop * scale,
    }
  }

  if (origin === 'leftCenter') {
    return {
      x: -offsetLeft + offsetLeft * scale,
      y: ((window.innerHeight - (el.clientHeight * scale)) / 2) - offsetTop + offsetTop * scale,
    }
  }

  if (origin === 'centerCenter') {
    return {
      x: (window.innerWidth - (el.clientWidth * scale)) / 2 - offsetLeft + offsetLeft * scale,
      y: ((window.innerHeight - (el.clientHeight * scale)) / 2) - offsetTop + offsetTop * scale,
    }
  }

  if (origin === 'rightCenter') {
    return {
      x: offsetRight - offsetRight * scale,
      y: ((window.innerHeight - (el.clientHeight * scale)) / 2) - offsetTop + offsetTop * scale,
    }
  }

  if (origin === 'leftBottom') {
    return {
      x: -offsetLeft + offsetLeft * scale,
      y: offsetBottom - offsetBottom * scale,
    }
  }

  if (origin === 'centerBottom') {
    return {
      x: (window.innerWidth - (el.clientWidth * scale)) / 2 - offsetLeft + offsetLeft * scale,
      y: offsetBottom - offsetBottom * scale,
    }
  }

  if (origin === 'rightBottom') {
    return {
      x: offsetRight - offsetRight * scale,
      y: offsetBottom - offsetBottom * scale,
    }
  }

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
    const originMap = {
      left: 'left top',
      center: 'left top',
      right: 'right top',
      leftTop: 'left top',
      leftCenter: 'left top',
      leftBottom: 'left bottom',

      centerTop: 'left top',
      centerCenter: 'left top',
      centerBottom: 'left bottom',

      rightTop: 'right top',
      rightCenter: 'right top',
      rightBottom: 'right bottom',
    }
    Object.assign(el.style, {
      // transformOrigin: TRANSFORM_ORIGIN[options.origin],
      // transform: el.style.transform.replace(/scale\(.+?\)/g, scaleStr),
      // transform: `matrix(${scale}, 0, 0, ${scale}, ${getTranslate(el, scale, options.origin)})`,
      transformOrigin: originMap[origin],
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
      const id = nanoId(8)
      el.dataset.fit = id

      const { arg, value } = binding

      const origin = value?.origin || arg || ''

      const lockX = value?.lockX || false
      const lockY = value?.lockY || false

      const scale = getElementScale({ x: lockX, y: lockY })

      // 添加基本属性值
      setElementOptions(el, {
        animate: value?.animate,
        origin,
        scale,
        nanoId: id,
        lockX,
        lockY,
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
  if (value === null) {
    elements.forEach((opt, el) => {
      const scale = getElementScale({ x: opt.lockX, y: opt.lockY })
      setElementOptions(el, { scale })
      setElementTransform(el)
    })
  }
  else {
    setElementTransform(value)
  }
})
