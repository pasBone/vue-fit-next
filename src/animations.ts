import { defaultFitOptions, element$, elements } from './fit'
import type { Animate, AnimateNames, AnimateType, FitOptions, RequiredAnimateType } from './types'
import { getTranslateValue } from './utils'

let styleSheet: CSSStyleSheet | null = null

const DEFAULT_ANIMATE: RequiredAnimateType = {
  name: null,
  duration: 500,
  delay: 0,
}

function normalizeAnimateType(animate?: AnimateType | AnimateNames) {
  return typeof animate === 'string' ? { name: animate } : animate || {}
}

/** 合并默认、全局和元素级动画配置. */
export function resolveAnimateOptions(globalAnimate?: Animate, elementAnimate?: Animate) {
  return {
    enter: {
      ...DEFAULT_ANIMATE,
      ...normalizeAnimateType(globalAnimate?.enter),
      ...normalizeAnimateType(elementAnimate?.enter),
    },
    leave: {
      ...DEFAULT_ANIMATE,
      ...normalizeAnimateType(globalAnimate?.leave),
      ...normalizeAnimateType(elementAnimate?.leave),
    },
  }
}

/**
 * @description 给元素添加出场/入场动画
 * @param el
 * @param fitOptions
 */
export function setAnimate(el: HTMLElement, fitOptions: FitOptions) {
  const elementOptions = elements.get(el)!
  // 动态创建 styleSheet
  if (styleSheet === null)
    createStyleSheet()

  const animate = resolveAnimateOptions(fitOptions.animate, elementOptions.animate)

  // 将最后的动画配置记录到 elements 上
  elementOptions.animate = animate

  // 添加入场动画属性
  if (animate.enter.name)
    addAnimateProps(el, animate.enter)
}

/**
 * @description 给元素设置动画属性
 * @param el
 * @param animate
 */
export function addAnimateProps(el: HTMLElement, animate: RequiredAnimateType) {
  if (animate && animate.name) {
    const { scale, nanoId } = elements.get(el)!
    const { x, y } = getTranslateValue(el)
    const rules = createAnimationFrames(scale, x, y, nanoId)[animate.name]
    styleSheet?.insertRule(rules)
    Object.assign(el.style, {
      animationName: `${animate.name}_${nanoId}`,
      animationDelay: `${animate.delay}ms`,
      animationDuration: `${animate.duration}ms`,
      animationFillMode: 'both',
    })
  }
}

/**
 * @description transition leave hooks
 * @param parent
 * @param remove
 */
export function leave(parent: Element, remove: () => void) {
  const fitElements: NodeListOf<HTMLElement> = parent.querySelectorAll('[data-fit]')
  removeRules()

  let animateElementCount = 0
  let removed = false
  const removeOnce = () => {
    if (removed)
      return
    removed = true
    remove()
  }

  fitElements.forEach((el) => {
    const leaveAnimate = elements.get(el)?.animate?.leave
    if (typeof leaveAnimate !== 'object' || !leaveAnimate.name)
      return

    addAnimateProps(el, leaveAnimate as RequiredAnimateType)
    el.addEventListener('animationend', (event) => {
      event.stopPropagation()
      removeOnce()
    }, { once: true })
    animateElementCount++
  })

  if (fitElements.length === 0 || animateElementCount === 0)
    setTimeout(removeOnce)
}

/** create style sheet */
function createStyleSheet() {
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.setAttribute('id', 'fitAnimated')
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(style)
  styleSheet = style.sheet
}

/** remove animate css rules */
function removeRules() {
  const rules = styleSheet?.cssRules
  if (rules) {
    while (rules.length)
      styleSheet?.deleteRule(0)
  }
}

/** update animate css rules */
export function updateRules(el: HTMLElement) {
  const { scale, x, y, nanoId, animate } = elements.get(el)!
  if (animate && typeof animate.enter === 'object' && animate.enter.name) {
    const rules = createAnimationFrames(scale, x, y, nanoId)[animate.enter.name as AnimateNames]
    styleSheet?.insertRule(rules)
  }
}

/** animation frames */
export function createAnimationFrames(scale: number, x: number, y: number, nanoId: string): Record<AnimateNames, string> {
  if (defaultFitOptions?.mode === 'zoom')
    scale = 1

  return {

    slideInLeft: `@keyframes slideInLeft_${nanoId} {
      from {
        transform: translate3d(-100%, ${y}px, 0) scale(${scale}, ${scale});
        visibility: visible;
      }
      to {
        transform: translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale});
      }
    }`,

    slideInRight: `@keyframes slideInRight_${nanoId} {
      from {
        transform: translate3d(100%, ${y}px, 0) scale(${scale}, ${scale});
        visibility: visible;
      }
      to {
        transform: translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale});
      }
    }`,

    slideOutLeft: `@keyframes slideOutLeft_${nanoId} {
      from {
        transform: translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale});
      }
      to {
        visibility: hidden;
        transform: translate3d(-100%, ${y}px, 0) scale(${scale}, ${scale});
      }
    }`,

    slideOutRight: `@keyframes slideOutRight_${nanoId} {
      from {
        transform: translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale});
      }
      to {
        visibility: hidden;
        transform: translate3d(100%, ${y}px, 0) scale(${scale}, ${scale});
      }
    }`,

    slideInUp: `@keyframes slideInUp_${nanoId} {
      from {
        transform: translate3d(${x}px, -100%, 0) scale(${scale}, ${scale});
        visibility: visible;
      }
      to {
        transform: translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale});
      }
    }`,

    slideInDown: `@keyframes slideInDown_${nanoId} {
      from {
        transform: translate3d(${x}px, 100%, 0) scale(${scale}, ${scale});
        visibility: visible;
      }
      to {
        transform: translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale});
      }
    }`,

    slideOutUp: `@keyframes slideOutUp_${nanoId} {
      from {
        transform: translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale});
      }
      to {
        visibility: hidden;
        transform: translate3d(${x}px, -100%, 0) scale(${scale}, ${scale});
      }
    }`,

    slideOutDown: `@keyframes slideOutDown_${nanoId} {
      from {
        transform: translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale});
      }
      to {
        visibility: hidden;
        transform: translate3d(${x}px, 100%, 0) scale(${scale}, ${scale});
      }
    }`,
  }
}

element$.subscribe((value) => {
  if (value === null) {
    removeRules()
    elements.forEach((opt, el) => {
      updateRules(el)
    })
  }
  else {
    // 初始化给每个元素添加动画
    setAnimate(value, defaultFitOptions)
  }
})
