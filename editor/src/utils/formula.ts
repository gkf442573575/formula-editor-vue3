import { MATH_REG } from './math'
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
 * @returns
 */
export const evalFormula = (
  formula: string,
  variableHandler: (variable: any) => string,
  formulaSope: { [key: string]: any }
) => {
  const isPass = isCloseBrackets(formula)
  if (!isPass) {
    throw new Error('括号不匹配')
  }

  try {
    // FIXME: 执行一个随机变量后，就能正确访问变量啦
    console.log(formulaSope && formulaSope[uuid()])
    // 处理变量
    let evalFormula = formula.replace(VARIABLE_REG, (match, p1) => {
      return 'formulaSope' + variableHandler(p1)
    })
    // 处理函数
    evalFormula = evalFormula.replace(MATH_REG, match => {
      return `FORMULA_MATHS['${match}']`
    })
    const result = eval(evalFormula)
    return result
  } catch (error) {
    throw error
  }
}
