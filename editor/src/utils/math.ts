import { mean, max, min, sum } from 'lodash'

export enum MathKey {
  ABS,
  AVERAGE,
  FIXED,
  MAX,
  MIN,
  RAND,
  SQRT,
  SUM,
  LOWER,
  UPPER,
  REPEAT,
  AND,
  IF,
  OR,
  NOT
}

// 方法名称类型
export type MathName = keyof typeof MathKey

// 方法列表
export const MATH_LIST = Object.keys(MathKey).filter(item => isNaN(Number(item))) as MathName[]

// math的正则
export const MATH_REG = new RegExp(MATH_LIST.join('|'), 'g')

// 方法描述
export const MATH_DESC_LIST: Record<MathName, { desc: string; usage: string; example: string }> = {
  ABS: {
    desc: 'ABS函数可以获取一个数的绝对值',
    usage: 'ABS(数字)',
    example: 'ABS(-8) 可以返回8，也就是-8的绝对值'
  },
  AVERAGE: {
    desc: 'AVERAGE函数可以获取一组数值的算术平均值',
    usage: 'AVERAGE(数字1, 数字2, ...)',
    example: 'AVERAGE(语文成绩, 数学成绩, 英语成绩) 返回三门课程的平均分'
  },
  FIXED: {
    desc: 'FIXED函数可将数字舍入到指定的小数位数并输出为文本',
    usage: 'FIXED(数字, 小数位数)',
    example: 'FIXED(3.1415, 2) 返回"3.14"'
  },
  MAX: {
    desc: 'MAX函数可以获取一组数值的最大值',
    usage: 'MAX(数字1, 数字2, ...)',
    example: 'MAX(语文成绩, 数学成绩, 英语成绩) 返回三门课程中的最高分'
  },
  MIN: {
    desc: 'MIN函数可以获取一组数值的最小值',
    usage: 'MIN(数字1, 数字2, ...)',
    example: 'MIN(语文成绩, 数学成绩, 英语成绩)返回三门课程中的最低分'
  },
  RAND: {
    desc: 'RAND函数可返回大于等于0且小于1的均匀分布随机实数',
    usage: 'RAND()',
    example: 'RAND() 返回0.424656'
  },
  SQRT: {
    desc: 'SQRT函数可以获取一个数字的正平方根',
    usage: 'SQRT(数字)',
    example: 'SQRT(9) 返回3，也就是9的正平方根'
  },
  SUM: {
    desc: 'SUM函数可以获取一组数值的总和',
    usage: 'SUM(数字1, 数字2, ...)',
    example: 'SUM(语文成绩, 数学成绩, 英语成绩) 返回三门课程的总分'
  },
  LOWER: {
    desc: 'LOWER函数可以将一个文本中的所有大写字母转换为小写字母',
    usage: 'LOWER(文本)',
    example: 'LOWER("QWER") 返回"qwer"'
  },
  UPPER: {
    desc: 'UPPER函数可以将一个文本中的所有小写字母转换为大写字母',
    usage: 'UPPER(文本)',
    example: 'UPPER("qwer") 返回"QWER"'
  },
  REPEAT: {
    desc: 'REPT函数可以将文本重复一定次数',
    usage: 'REPT(文本, 重复次数)',
    example: 'REPT("云服务", 3) 返回"云服务云服务云服务"'
  },
  AND: {
    desc: '如果所有参数都为真，AND 函数返回布尔值 true，否则返回布尔值 false',
    usage: 'AND(逻辑表达式1, 逻辑表达式2, ...)',
    example:
      'AND(语文成绩>90, 数学成绩>90, 英语成绩>90)，如果三门课成绩都> 90，返回true，否则返回false'
  },
  IF: {
    desc: 'IF函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值',
    usage: 'IF(逻辑表达式, 为true时返回的值, 为false时返回的值)',
    example: 'IF(语文成绩>60, "及格", "不及格")，当语文成绩>60时返回及格，否则返回不及格。'
  },
  OR: {
    desc: '如果任意参数为真，OR 函数返回布尔值 true；如果所有参数为假，返回布尔值 false。',
    usage: 'OR(逻辑表达式1, 逻辑表达式2, ...)',
    example: 'OR(语文成绩>90, 数学成绩>90, 英语成绩>90)，任何一门课成绩>90，返回true，否则返回false'
  },
  NOT: {
    desc: 'NOT函数返回与指定表达式相反的布尔值。',
    usage: 'NOT(逻辑表达式)',
    example: 'NOT(语文成绩>60)，如果语文成绩大于60返回false，否则返回true'
  }
}

/**
 * @desc 进行公式计算的方法
 */
export const FORMULA_MATHS: Record<MathName, (...arg: any[]) => boolean | number | string> = {
  ABS: (num: any) => {
    return isNaN(Number(num)) ? '' : Math.abs(num)
  },
  AVERAGE: (...nums: any[]) => {
    const result = mean(nums.map(num => (isNaN(Number(num)) ? 0 : Number(num))))
    return result || ''
  },
  FIXED: (num: any, digit?: number) => {
    return isNaN(Number(num)) ? '' : parseFloat(num).toFixed(digit || 0)
  },
  MAX: (...nums: any[]) => {
    const result = max(nums.map(num => (isNaN(Number(num)) ? 0 : Number(num))))
    return result || ''
  },
  MIN: (...nums: any[]) => {
    const result = min(nums.map(num => (isNaN(Number(num)) ? 0 : Number(num))))
    return result || ''
  },
  RAND: () => {
    return Math.random()
  },
  SQRT: (num: any) => {
    return isNaN(Number(num)) ? '' : Math.sqrt(num)
  },
  SUM: (...nums: any[]) => {
    const result = sum(nums.map(num => (isNaN(Number(num)) ? 0 : Number(num))))
    return result || ''
  },
  LOWER: (str: any) => {
    return str && typeof str === 'string' ? str.toLowerCase() : ''
  },
  UPPER: (str: any) => {
    return str && typeof str === 'string' ? str.toUpperCase() : ''
  },
  REPEAT: (str: any, times: any) => {
    times = isNaN(parseInt(times)) ? 0 : Math.abs(parseInt(times))
    return str && typeof str === 'string' ? str.repeat(times) : ''
  },
  AND: (...bools: any[]) => {
    return bools.every(bool => !!bool)
  },
  OR: (...bools: any[]) => {
    return bools.some(bool => !!bool)
  },
  IF: (bool: any, trueVal: any, falseVal: any) => {
    return bool
      ? trueVal !== undefined && trueVal !== null
        ? trueVal
        : ''
      : falseVal !== undefined && falseVal !== null
      ? falseVal
      : ''
  },
  NOT: (bool: any) => {
    return !bool
  }
}

export type FORMULA_MATHS_TYPE = typeof FORMULA_MATHS
