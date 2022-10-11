import type { App, Plugin } from 'vue'
import type { FitOptions } from './types'
import { directiveHooks } from './fit'
import './events' // 事件相关
export { leave } from './animations' // 动画相关

/**
 * The vue directive.
 */
export default function FitPlugin(defaultOptions: FitOptions): Plugin | any {
  return {
    install(app: App) {
      app.directive('fit', directiveHooks(defaultOptions))
    },
  }
}
