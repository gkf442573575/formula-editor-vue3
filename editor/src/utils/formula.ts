import { type MathItem } from '../interfaces'

import { FORMULA_MATHS } from './math'
import { uuid } from './index'

const isStrBrackets = (val: string) => /[\'\"]{1}/.test(val)

// 变量正则
export const VARIABLE_REG = /\$\{(.*?)\}/g

/**
 * @desc 检查符号是否关闭
 * @param content
 * @returns
 */
export const isCloseBrackets = (content: string) => {
  const brackets = [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ]
  const contentArr = content.split('')
  if (!contentArr.length) {
    return true
  }
  const bracketObj: { [key: string]: number } = {}
  const bracketLeft: string[] = []
  const bracketRight: string[] = []

  for (let i = 0; i < brackets.length; i++) {
    const [left, right] = brackets[i]
    bracketObj[left] = i + 1
    bracketObj[right] = -(i + 1)
    bracketLeft.push(left)
    bracketRight.push(right)
  }
  const stack = []
  for (let i = 0; i < contentArr.length; i++) {
    const item = contentArr[i]
    const current: number | undefined = bracketObj[item]
    if (!current) {
      continue
    }
    // 当这个符号作为字符串是跳过
    if (i > 0 && isStrBrackets(contentArr[i - 1]) && isStrBrackets(contentArr[i + 1])) {
      continue
    }
    if (bracketLeft.includes(item)) {
      stack.push(current)
    } else if (bracketRight.includes(item)) {
      const stackLen = stack.length
      // 是否对值匹配
      if (stackLen > 0 && stack[stackLen - 1] + current === 0) {
        stack.pop()
      } else {
        stack.push(current)
      }
    }
  }
  return stack.length === 0
}

/**
 * @desc 函数计算
 * @param formula 公式内容
 * @param variableHandler 变量处理, 用来取变量所在formulaSope中的值 返回示例 ['id']['d'][0] 则取formulaSope['id']['d'][0]的值
 * @param formulaSope 必填，变量处理通过链的方式取出参数
 * @param formulaMaths 非必填，函数处理
 * @returns
 */
export const evalFormula = (
  formula: string,
  variableHandler: (variable: any) => string,
  variableData: Record<string, any>,
  mathList: MathItem[] = FORMULA_MATHS
) => {
  const isPass = isCloseBrackets(formula)
  if (!isPass) {
    throw new Error('括号不匹配')
  }
  const formulaMaths: Record<string, (...arg: any[]) => any> = {}
  const nameList: string[] = mathList.map(item => {
    const { name, handler } = item
    formulaMaths[name] = handler
    return name
  })
  // 函数正则
  const MATH_REG = new RegExp(`${nameList.join('|')}`, 'g')
  try {
    // 执行一次随机变量才可访问
    const mock_variable = variableData && variableData[uuid()]
    const mock_math = formulaMaths && formulaMaths[uuid()]
    // 处理变量
    let evalFormula = formula.replace(VARIABLE_REG, (match, p1) => {
      return 'variableData' + variableHandler(p1)
    })
    // 处理函数
    evalFormula = evalFormula.replace(MATH_REG, match => {
      return `formulaMaths['${match}']`
    })
    const result = eval(evalFormula)
    return result
  } catch (error) {
    throw error
  }
}
