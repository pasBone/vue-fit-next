import { BehaviorSubject, bufferWhen, debounceTime, filter, fromEvent, map, merge, mergeMap, scan, switchMap, takeUntil, tap, throttleTime } from 'rxjs'
import { defaultFitOptions, element$ } from './fit'
import { getTranslateValue } from './utils'

interface TransformType { scale?: number; x: number; y: number }

let initialized = false

const isSpaceKey = (event: KeyboardEvent) => event.code === 'Space'
const isCtrlKey = (event: WheelEvent) => event.ctrlKey

/**
 * 初始化仅在浏览器中使用的全局交互事件。
 *
 * 事件在插件安装时延迟注册，避免仅导入包时访问 DOM，
 * 同时防止多个 Vue 应用重复安装监听器。
 */
export function setupEvents() {
  if (initialized || typeof window === 'undefined' || typeof document === 'undefined')
    return

  const body = document.body
  if (!body)
    return

  initialized = true

  /** 设置 body transform */
  const bodyTransform$ = new BehaviorSubject({ scale: 1, x: 0, y: 0 })
  const cursor = body.style.cursor
  const fitMask = createMask()

  const resize$ = fromEvent(window, 'resize')
  const keyup$ = fromEvent<KeyboardEvent>(window, 'keyup')
  const mouseup$ = fromEvent<MouseEvent>(window, 'mouseup')
  const keydown$ = fromEvent<KeyboardEvent>(window, 'keydown')
  const mousedown$ = fromEvent<MouseEvent>(window, 'mousedown')
  const mousemove$ = fromEvent<MouseEvent>(window, 'mousemove')
  const mousewheel$ = fromEvent<WheelEvent>(window, 'mousewheel', { passive: false })

  const spaceUp$ = keyup$.pipe(filter(isSpaceKey))
  const spaceDown$ = keydown$.pipe(filter(isSpaceKey))

  /** 按住 space 键的同时鼠标点击界面进行拖动. */
  spaceDown$.pipe(
    tap(() => body.style.cursor = 'all-scroll'),
    mergeMap(() => mousedown$.pipe(
      map((event) => {
        const { x, y } = getTranslateValue(body)
        return {
          x: event.clientX - x,
          y: event.clientY - y,
        }
      }),
      mergeMap(({ x, y }) => mousemove$.pipe(
        map(event => ({
          x: event.clientX - x,
          y: event.clientY - y,
        })),
        takeUntil(mouseup$),
      )),
      throttleTime(20),
      takeUntil(spaceUp$),
    )),
  ).subscribe((value) => {
    bodyTransform$.next(setBodyTransform(body, value))
  })

  spaceUp$.subscribe(() => {
    body.style.cursor = cursor
  })

  /** 双击 space 键进行位置复原. */
  spaceDown$.pipe(
    bufferWhen(() => spaceDown$.pipe(debounceTime(250))),
    filter(list => list.length === 2),
  ).subscribe(() => {
    bodyTransform$.next(setBodyTransform(body, { x: 0, y: 0, scale: 1 }))
  })

  /** 按住 ctrl 键的同时滚动鼠标，实现整体缩放及位置偏移. */
  const ctrlMousewheel$ = (seed: Required<TransformType>) => mousewheel$.pipe(
    filter(isCtrlKey),
    tap(event => event.preventDefault()),
    scan(calcTransform, seed),
  )

  /** 进行拖动或者放大时添加遮罩以免影响 3D 场景. */
  merge(
    spaceDown$,
    keydown$.pipe(filter(event => event.ctrlKey)),
  ).pipe(throttleTime(500)).subscribe(() => {
    fitMask.style.display = 'block'
  })

  /** 键盘抬起时移除遮罩. */
  keyup$.subscribe(() => {
    fitMask.style.display = 'none'
  })

  /** body transform 发生变化时重新订阅 ctrlMousewheel. */
  bodyTransform$.pipe(
    switchMap(ctrlMousewheel$),
  ).subscribe(transform => setBodyTransform(body, transform))

  /** 监听窗口 resize 事件，通知 element 的订阅者. */
  resize$.pipe(
    throttleTime(10),
  ).subscribe(() => element$.next(null))
}

/** 创建 mask element. */
function createMask() {
  const fitMask = document.createElement('div')
  fitMask.id = 'fitMask'
  Object.assign(fitMask.style, {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    background: 'none',
    zIndex: 9999,
    display: 'none',
  })
  document.body.appendChild(fitMask)
  return fitMask
}

/** 计算 transform 的值. */
function calcTransform(seed: Required<TransformType>, event: WheelEvent) {
  const scaleStep = defaultFitOptions.scaleStep || 0.05
  const { x, y } = seed
  let { scale } = seed
  const xs = (event.clientX - x) / scale
  const ys = (event.clientY - y) / scale
  scale += event.deltaY > 0 ? -scaleStep : scaleStep
  if (scale >= 0.1 && scale <= 10) {
    const dx = event.clientX - xs * scale
    const dy = event.clientY - ys * scale
    return { scale, x: dx, y: dy }
  }
  return seed
}

/** 设置 body 的缩放和位移. */
function setBodyTransform(body: HTMLElement, transform: TransformType) {
  const { x, y, scale: nextScale } = transform
  const scale = nextScale || Number(body.dataset.scale) || 1
  Object.assign(body.style, {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    transformOrigin: '0 0',
  })
  body.dataset.scale = `${scale}`
  document.documentElement.style.setProperty('--fit-body-scale', `${scale}`)
  return { scale, x, y }
}
