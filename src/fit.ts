/* eslint-disable import/no-mutable-exports */
import { Subject } from 'rxjs'
import type { DirectiveBinding } from 'vue'
import { getComputedStyleNumber, nanoId } from './utils'
import type { ElementOptions, FitOptions, Origin } from './types'
import { calculateTranslate, getTransformOrigin, normalizeOrigin } from './layout'

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

  return Math.min(scaleX, scaleY) // 宽度与高度的比例取最小的，以确保屏幕可以完全显示
}

/** 缓存 translate 值 */
function getTranslate(el: HTMLElement, scale: number, origin: Origin = 'left') {
  return calculateTranslate({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    elementWidth: el.clientWidth,
    elementHeight: el.clientHeight,
    offsetTop: el.offsetTop,
    offsetLeft: el.offsetLeft,
    offsetRight: getComputedStyleNumber(el, 'right') + getComputedStyleNumber(el, 'margin-right'),
    offsetBottom: getComputedStyleNumber(el, 'bottom') + getComputedStyleNumber(el, 'margin-bottom'),
  }, scale, origin)
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
      transformOrigin: getTransformOrigin(origin),
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

/** 指令元素生命周期 mounted */
function mounted(el: HTMLElement, binding: DirectiveBinding) {
  const id = nanoId(8)
  el.dataset.fit = id

  const { arg, value } = binding

  const origin = normalizeOrigin(value?.origin || arg)

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

  document.documentElement.style.setProperty('--fit-element-scale', `${scale}`)
  document.documentElement.style.setProperty('--fit-body-scale', `${1}`)
}

/** 指令元素生命周期 unmounted */
function unmounted(el: HTMLElement) {
  elements.delete(el)
}

/** 指令对应的生命周期  */
export function directiveHooks(fitOptions: FitOptions) {
  defaultFitOptions = fitOptions
  return {
    mounted,
    unmounted,
    // 简单兼容 vue-2.x 版本
    bind: mounted,
    unbind: unmounted,
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
      document.documentElement.style.setProperty('--fit-element-scale', `${scale}`)
    })
  }
  else {
    setElementTransform(value)
  }
})
