export interface VariableItem {
  label: string
  value: string
  desc?: string
  [key: string]: any
}

export interface MathItem {
  name: string
  handler: (...arg: any[]) => any
  desc?: string
  usage?: string
  example?: string
  [key: string]: any
}
