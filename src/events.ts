import { BehaviorSubject, bufferWhen, debounceTime, filter, fromEvent, map, merge, mergeMap, scan, switchMap, takeUntil, tap, throttleTime } from 'rxjs'
import { defaultFitOptions, element$ } from './fit'
import { getTranslateValue } from './utils'

/** 设置 body transform */
const bodyTransform$ = new BehaviorSubject({ scale: 1, x: 0, y: 0 })

/** 每次缩放的增量. */
// const SCALE_STEP = defaultFitOptions.scaleStep || 0.05

/** body 元素 */
const body = document.querySelector('body')!
const cursor = body.style.cursor

/** 遮罩元素 */
const fitMask = createMask()

/** RxJS Observable  */
const resize$ = fromEvent<MouseEvent>(window, 'resize')
const keyup$ = fromEvent<KeyboardEvent>(window, 'keyup')
const mouseup$ = fromEvent<MouseEvent>(window, 'mouseup')
const keydown$ = fromEvent<KeyboardEvent>(window, 'keydown')
const mousedown$ = fromEvent<MouseEvent>(window, 'mousedown')
const mousemove$ = fromEvent<MouseEvent>(window, 'mousemove')
const mousewheel$ = fromEvent<WheelEvent>(window, 'mousewheel', { passive: false })

/** 是否是空格键 */
const isSpaceKey = (event: KeyboardEvent) => event.code === 'Space'
/** 是否是 Ctrl 键 */
const isCtrlKey = (event: WheelEvent) => event.ctrlKey

/** 空格键事件. */
const spaceUp$ = keyup$.pipe(filter(isSpaceKey))
const spaceDown$ = keydown$.pipe(filter(isSpaceKey))

interface TransformType { scale?: number; x: number; y: number }

/**
 * 按住 space 键的同时鼠标点击界面进行拖动.
 */
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
      map(ev => ({
        x: ev.clientX - x,
        y: ev.clientY - y,
      })),
      takeUntil(mouseup$),
    )),
    throttleTime(20),
    takeUntil(
      spaceUp$.pipe(
        tap(() => body.style.cursor = cursor),
      )),
  )),
).subscribe((value) => {
  bodyTransform$.next(setBodyTransform(value))
})

/**
 * 双击 space 键进行位置复原.
 */
spaceDown$.pipe(
  bufferWhen(() => spaceDown$.pipe(debounceTime(250))),
  filter(list => list.length === 2),
).subscribe(() => {
  bodyTransform$.next(setBodyTransform({ x: 0, y: 0, scale: 1 }))
})

/**
 *  按住 ctrl 键的同时滚动鼠标，实现整体缩放及位置偏移.
 */
const ctrlMousewheel$ = (seed: Required<TransformType>) => mousewheel$.pipe(
  filter(isCtrlKey),
  tap(event => event.preventDefault()),
  scan(calcTransform, seed),
)

/**
 * 进行拖动或者放大时添加遮罩以免影响3D场景
 */
merge(
  spaceDown$,
  mousewheel$.pipe(filter(isCtrlKey)),
)
  .pipe(throttleTime(500))
  .subscribe(() => {
    document.body.appendChild(fitMask)
  })

/**
 * 键盘抬起时移除遮罩
 */
keyup$.subscribe(() => {
  document.querySelector('#fitMask')?.remove()
})

/**
 * body transform 发生变化的时候重新订阅 ctrlMousewheel
 */
bodyTransform$.pipe(
  switchMap(ctrlMousewheel$),
).subscribe(setBodyTransform)

/**
 * 监听窗口 resize 事件，通知到 element 的订阅者.
 */
resize$.pipe(
  throttleTime(10),
  map(() => element$.next(null)),
).subscribe()

/**
 * 创建 mask element
 */
function createMask() {
  const fitMask = document.createElement('div')
  fitMask.id = 'fitMask'
  Object.assign(fitMask.style, {
    position: 'fixed',
    left: 0,
    top: 0,
    width: `${window.innerWidth}px`,
    height: `${window.innerHeight}px`,
    background: 'none',
    zIndex: 9999,
  })
  return fitMask
}

/** 计算 transform 的值 */
function calcTransform(seed: Required<TransformType>, event: WheelEvent) {
  const SCALE_STEP = defaultFitOptions.scaleStep || 0.05
  // eslint-disable-next-line prefer-const
  let { scale, x, y } = seed
  const xs = (event.clientX - x) / scale
  const ys = (event.clientY - y) / scale
  scale += (event.deltaY > 0 ? -SCALE_STEP : SCALE_STEP)
  if (scale >= 0.1 && scale <= 6) {
    const dx = event.clientX - xs * scale
    const dy = event.clientY - ys * scale
    return { scale, x: dx, y: dy }
  }
  return seed
}

/** 设置 body 的缩放和位移 */
function setBodyTransform(transform: TransformType) {
  const { x, y, scale: _scale } = transform
  const scale = _scale || Number(body.getAttribute('data-scale')) || 1
  Object.assign(body.style, {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    transformOrigin: '0 0',
  })
  body.setAttribute('data-scale', `${scale}`)
  return { scale, x, y }
}
