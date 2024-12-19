import type { App, Plugin } from 'vue'
import './view/index.scss'

import Editor from './view/index.vue'

export { FORMULA_MATHS } from './utils/math'

export * from './interfaces'

export { evalFormula, isCloseBrackets } from './utils/formula'

export default {
  install(app: App) {
    app.component(Editor.name || 'FormulaEditor', Editor)
  }
}

// 用于提示
declare module 'vue' {
  export interface GlobalComponents {
    FormulaEditor: typeof Editor
  }
}
