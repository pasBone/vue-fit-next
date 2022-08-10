import { elements, getElementScale } from './fit'
import type { AnimateNames, AnimateType, ElementOptions, FitOptions } from './types'

type RequiredAnimateType = Required<AnimateType>

let styleSheet: CSSStyleSheet | null = null

/**
 * @description 给元素添加出场/入场动画
 * @param el
 * @param elementOptions
 * @param fitOptions
 */
export function setAnimate(el: HTMLElement, elementOptions: ElementOptions, fitOptions: FitOptions) {
  // 动态创建 styleSheet
  if (styleSheet === null)
    createStyleSheet()

  const animate = {
    enter: {
      name: null,
      duration: 500,
      delay: 0,
    } as RequiredAnimateType,
    leave: {
      name: null,
      duration: 500,
      delay: 0,
    } as RequiredAnimateType,
  }

  let enter = typeof fitOptions?.animate?.enter === 'string' ? { name: fitOptions?.animate?.enter } : fitOptions?.animate?.enter
  let leave = typeof fitOptions?.animate?.leave === 'string' ? { name: fitOptions?.animate?.leave } : fitOptions?.animate?.leave

  // 首先合并全局动画配置
  Object.assign(animate.enter, enter)
  Object.assign(animate.leave, leave)

  // 如果单个组件有设置 animate 属性
  if (typeof elementOptions.animate === 'object') {
    enter = typeof elementOptions.animate.enter === 'string' ? { name: elementOptions.animate.enter } : elementOptions.animate.enter
    leave = typeof elementOptions.animate.leave === 'string' ? { name: elementOptions.animate.leave } : elementOptions.animate.leave
  }

  // 然后合并单个组件的动画配置
  Object.assign(animate.enter, enter)
  Object.assign(animate.leave, leave)

  // 将最后的动画配置记录到elements上
  const options = elements.get(el)!
  options.animate = animate
  elements.set(el, options)

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
  if (animate.name) {
    Object.assign(el.style, {
      animationName: animate.name,
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
export function leave(parent: HTMLElement, remove: Function) {
  const fitElements: NodeListOf<HTMLElement> = parent.querySelectorAll('[data-fit]')

  fitElements.forEach((el) => {
    const options = elements.get(el) as Required<ElementOptions>
    const leave = options.animate.leave as RequiredAnimateType
    if (leave) {
      addAnimateProps(el, leave)
      el.addEventListener('animationend', (e) => {
        e.stopPropagation()
        remove()
      })
    }
    else {
      remove()
    }
  })
}

/** create style sheet */
function createStyleSheet() {
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.setAttribute('id', 'fitAnimated')
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(style)
  styleSheet = style.sheet
  insertRule()
}

/** insert animate css rules */
function insertRule() {
  const scale = getElementScale()
  const rules = setAnimationFrames(scale)
  for (const key in rules)
    styleSheet?.insertRule(rules[key as AnimateNames])
}

/** remove animate css rules */
function removeRule() {
  const rules = styleSheet?.cssRules
  if (rules) {
    for (let i = 0; i < rules?.length; i++)
      styleSheet?.deleteRule(i)
  }
}

/** update animate css rules */
export function updateRule() {
  removeRule()
  insertRule()
}

/** animation frames */
function setAnimationFrames(scale: number): Record<AnimateNames, string> {
  return {

    slideInLeft: `@keyframes slideInLeft {
      from {
        transform: scale(${scale}, ${scale}) translate3d(-100%, 0, 0);
        visibility: visible;
      }
      to {
        transform: scale(${scale}, ${scale}) translate3d(0, 0, 0);
      }
    }`,

    slideInRight: `@keyframes slideInRight {
      from {
        transform: scale(${scale}, ${scale}) translate3d(100%, 0, 0);
        visibility: visible;
      }
      to {
        transform: scale(${scale}, ${scale}) translate3d(0, 0, 0);
      }
    }`,

    slideOutLeft: `@keyframes slideOutLeft {
      from {
        transform: scale(${scale}, ${scale}) translate3d(0, 0, 0);
      }
      to {
        visibility: hidden;
        transform: scale(${scale}, ${scale}) translate3d(-100%, 0, 0);
      }
    }`,

    slideOutRight: `@keyframes slideOutRight {
      from {
        transform: scale(${scale}, ${scale}) translate3d(0, 0, 0);
      }
      to {
        visibility: hidden;
        transform: scale(${scale}, ${scale}) translate3d(100%, 0, 0);
      }
    }`,

    slideInUp: `@keyframes slideInUp {
      from {
        transform: scale(${scale}, ${scale}) translate3d(0, -100%, 0);
        visibility: visible;
      }
      to {
        transform: scale(${scale}, ${scale}) translate3d(0, 0, 0);
      }
    }`,

    slideInDown: `@keyframes slideInDown {
      from {
        transform: scale(${scale}, ${scale}) translate3d(0, 100%, 0);
        visibility: visible;
      }
      to {
        transform: scale(${scale}, ${scale}) translate3d(0, 0, 0);
      }
    }`,

    slideOutUp: `@keyframes slideOutUp {
      from {
        transform: scale(${scale}, ${scale}) translate3d(0, 0, 0);
      }
      to {
        visibility: hidden;
        transform: scale(${scale}, ${scale}) translate3d(0, -100%, 0);
      }
    }`,

    slideOutDown: `@keyframes slideOutDown {
      from {
        transform: scale(${scale}, ${scale}) translate3d(0, 0, 0);
      }
      to {
        visibility: hidden;
        transform: scale(${scale}, ${scale}) translate3d(0, 100%, 0);
      }
    }`,
  }
}
