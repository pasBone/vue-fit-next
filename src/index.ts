import type { App, Plugin } from 'vue'
import type { FitOptions } from './types'
import { directiveHooks } from './fit'

/**
 * The vue directive.
 */
export default function FitPlugin(defaultOptions: FitOptions): Plugin {
  return {
    install(app: App) {
      app.directive('fit', directiveHooks(defaultOptions))
    },
  }
}
