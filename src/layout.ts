import type { Origin } from './types'

export interface LayoutMetrics {
  viewportWidth: number
  viewportHeight: number
  elementWidth: number
  elementHeight: number
  offsetTop: number
  offsetLeft: number
  offsetRight: number
  offsetBottom: number
}

const ORIGIN_ALIGNMENT: Record<Origin, { horizontal: 'left' | 'center' | 'right'; vertical: 'top' | 'center' | 'bottom' }> = {
  left: { horizontal: 'left', vertical: 'top' },
  leftTop: { horizontal: 'left', vertical: 'top' },
  leftCenter: { horizontal: 'left', vertical: 'center' },
  leftBottom: { horizontal: 'left', vertical: 'bottom' },
  center: { horizontal: 'center', vertical: 'top' },
  centerTop: { horizontal: 'center', vertical: 'top' },
  centerCenter: { horizontal: 'center', vertical: 'center' },
  centerBottom: { horizontal: 'center', vertical: 'bottom' },
  right: { horizontal: 'right', vertical: 'top' },
  rightTop: { horizontal: 'right', vertical: 'top' },
  rightCenter: { horizontal: 'right', vertical: 'center' },
  rightBottom: { horizontal: 'right', vertical: 'bottom' },
}

/** 将指令参数规范为支持的对齐方式. */
export function normalizeOrigin(origin?: string): Origin {
  return origin && origin in ORIGIN_ALIGNMENT ? origin as Origin : 'left'
}

/** 根据元素尺寸、偏移量和缩放值计算位移. */
export function calculateTranslate(metrics: LayoutMetrics, scale: number, origin: Origin) {
  const alignment = ORIGIN_ALIGNMENT[origin]
  const scaledOffsetLeft = metrics.offsetLeft * (scale - 1)
  const scaledOffsetTop = metrics.offsetTop * (scale - 1)

  const horizontal = {
    left: scaledOffsetLeft,
    center: (metrics.viewportWidth - metrics.elementWidth * scale) / 2 + scaledOffsetLeft,
    right: metrics.offsetRight * (1 - scale),
  }
  const vertical = {
    top: scaledOffsetTop,
    center: (metrics.viewportHeight - metrics.elementHeight * scale) / 2 + scaledOffsetTop,
    bottom: metrics.offsetBottom * (1 - scale),
  }

  return {
    x: horizontal[alignment.horizontal],
    y: vertical[alignment.vertical],
  }
}

/** 获取与位移计算相匹配的 CSS transform-origin. */
export function getTransformOrigin(origin: Origin) {
  const { horizontal, vertical } = ORIGIN_ALIGNMENT[origin]
  const x = horizontal === 'right' ? 'right' : 'left'
  const y = vertical === 'bottom' ? 'bottom' : 'top'
  return `${x} ${y}`
}
