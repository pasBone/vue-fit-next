/* eslint-disable import/no-mutable-exports */
import { Subject } from 'rxjs'
import type { DirectiveBinding, ObjectDirective } from 'vue'
import { nanoId } from './utils'
import type { ElementOptions, FitOptions, Lock, Origin } from './types'
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
export function getElementScale(lock: Lock): number {
  if (lock.x)
    return window.innerHeight / defaultFitOptions.height

  if (lock.y)
    return window.innerWidth / defaultFitOptions.width

  const w = window.innerWidth / defaultFitOptions.width
  const h = window.innerHeight / defaultFitOptions.height
  const scale = Math.min(w, h) // 宽度与高度的比例取最小的，以确保屏幕可以完全显示
  return scale
}

function getTranslate(el: HTMLElement, scale: number, origin: Origin) {
  let translate = { x: 0, y: 0 }
  switch (origin) {
    case 'top':
      translate = { x: 0, y: 0 }
      break
    case 'right':
      translate = { x: el.clientWidth - el.clientWidth * scale, y: 0 }
      break
    case 'bottom':
      translate = { x: el.clientWidth - el.clientWidth * scale, y: window.innerHeight - el.clientHeight * scale }
      break
    case 'left':
      translate = { x: 0, y: window.innerHeight - el.clientHeight * scale }
      break
    case 'center':
      translate = { x: (window.innerWidth - el.clientWidth * scale) / 2, y: 0 }
      break
  }
  return translate
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
      const id = nanoId(8)
      el.dataset.fit = id

      const { arg, value } = binding

      const origin = value?.origin || arg || 'top'

      const lock = Object.assign({ x: false, y: false }, value?.lock)

      const scale = getElementScale(lock)

      // 添加基本属性值
      setElementOptions(el, {
        animate: value?.animate,
        origin,
        scale,
        nanoId: id,
        lock,
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
      const scale = getElementScale(opt.lock)
      setElementOptions(el, { scale })
      setElementTransform(el)
    })
  }
  else {
    setElementTransform(value)
  }
})
