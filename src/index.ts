import type { FitOptions } from './types'
import { directiveHooks } from './fit'
import { setupEvents } from './events'
export { leave } from './animations' // 动画相关

/**
 * The vue directive.
 */
export default function FitPlugin(defaultOptions: FitOptions): import('vue').Plugin {
  return {
    install(app: import('vue').App) {
      setupEvents()
      app.directive('fit', directiveHooks(defaultOptions))
    },
  }
}
