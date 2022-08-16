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

/** 位置对齐方式，和CSS margin 的书写顺序一样：上右下左中 */
export type Origin = 'top' | 'right' | 'bottom' | 'left' | 'center'

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
  origin: Origin

  /** 缩放值 */
  scale: number

  /** translateX */
  x: number

  /** translateY */
  y: number

  /** 锁定 x 轴或者 y 轴 */
  lockX: boolean
  lockY: boolean

  /** nanoId */
  nanoId: string

  /** 出场入场动画 */
  animate?: Animate

}

export type RequiredAnimateType = Required<AnimateType>
