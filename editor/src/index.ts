import type { App, Plugin } from 'vue'
import './view/index.scss'

import Editor from './view/index.vue'

type SFCWithInstall<T> = T & Plugin

const withInstall = <T>(comp: T) => {
  ;(comp as SFCWithInstall<T>).install = (app: App) => {
    //注册组件
    app.component((comp as any).name, comp as any)
  }
  return comp as SFCWithInstall<T>
}

export { FORMULA_MATHS } from './utils/math'

export * from './interfaces'

export { evalFormula, isCloseBrackets } from './utils/formula'

export const FormulaEditor = withInstall(Editor)

export default FormulaEditor

// 用于提示
declare module 'vue' {
  export interface GlobalComponents {
    'formula-editor': typeof FormulaEditor
  }
}
