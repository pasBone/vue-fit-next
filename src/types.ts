import type { TRANSFORM_ORIGIN } from './fit'

export type AnimateNames = 'slideInLeft' | 'slideInRight' | 'slideOutLeft' | 'slideOutRight' | 'slideInUp' | 'slideInDown' | 'slideOutUp' | 'slideOutDown'

export interface AnimateType {
  /** 动画名称 */
  name?: AnimateNames | null
  /** 过渡时长 */
  duration?: number
  /** 延时 */
  delay?: number
}

/** 组件的出场、入场动画 */
export interface Animate {
  enter?: AnimateType | AnimateNames
  leave?: AnimateType | AnimateNames
}

export type TransformOrigin = `${keyof typeof TRANSFORM_ORIGIN}`

/** 指令注册时全局的配置 */
export interface FitOptions {
  /** 设计稿的宽度 */
  width: number
  /** 设计稿的高度 */
  height: number
  /** 动画 */
  animate?: Animate
  /** 适配方式 */
  mode?: 'zoom' | 'scale'
}

/** 单个组件的个性配置 */
export interface ElementOptions extends Animate {

  /** 组件在css中的变换中心位置 */
  origin: TransformOrigin

  /** 缩放值 */
  scale: number

  /** 出场入场动画 */
  animate?: Animate

}
