import type { MathItem } from '../interfaces'

import { mean, max, min, sum } from 'lodash-es'

/**
 * @desc 进行公式计算的方法
 */
export const FORMULA_MATHS: MathItem[] = [
  {
    name: 'ABS',
    handler: (num: any) => {
      return isNaN(Number(num)) ? '' : Math.abs(num)
    },
    desc: 'ABS函数可以获取一个数的绝对值',
    usage: 'ABS(数字)',
    example: 'ABS(-8) 可以返回8，也就是-8的绝对值'
  },
  {
    name: 'AVERAGE',
    handler: (...nums: any[]) => {
      const result = mean(nums.map(num => (isNaN(Number(num)) ? 0 : Number(num))))
      return result || ''
    },
    desc: 'AVERAGE函数可以获取一组数值的算术平均值',
    usage: 'AVERAGE(数字1, 数字2, ...)',
    example: 'AVERAGE(语文成绩, 数学成绩, 英语成绩) 返回三门课程的平均分'
  },
  {
    name: 'FIXED',
    handler: (num: any, digit?: number) => {
      return isNaN(Number(num)) ? '' : parseFloat(num).toFixed(digit || 0)
    },
    desc: 'FIXED函数可将数字舍入到指定的小数位数并输出为文本',
    usage: 'FIXED(数字, 小数位数)',
    example: 'FIXED(3.1415, 2) 返回"3.14"'
  },
  {
    name: 'MAX',
    handler: (...nums: any[]) => {
      const result = max(nums.map(num => (isNaN(Number(num)) ? 0 : Number(num))))
      return result || ''
    },
    desc: 'MAX函数可以获取一组数值的最大值',
    usage: 'MAX(数字1, 数字2, ...)',
    example: 'MAX(语文成绩, 数学成绩, 英语成绩) 返回三门课程中的最高分'
  },
  {
    name: 'MIN',
    handler: (...nums: any[]) => {
      const result = min(nums.map(num => (isNaN(Number(num)) ? 0 : Number(num))))
      return result || ''
    },
    desc: 'MIN函数可以获取一组数值的最小值',
    usage: 'MIN(数字1, 数字2, ...)',
    example: 'MIN(语文成绩, 数学成绩, 英语成绩)返回三门课程中的最低分'
  },
  {
    name: 'RAND',
    handler: () => {
      return Math.random()
    },
    desc: 'RAND函数可返回大于等于0且小于1的均匀分布随机实数',
    usage: 'RAND()',
    example: 'RAND() 返回0.424656'
  },
  {
    name: 'SQRT',
    handler: (num: any) => {
      return isNaN(Number(num)) ? '' : Math.sqrt(num)
    },
    desc: 'SQRT函数可以获取一个数字的正平方根',
    usage: 'SQRT(数字)',
    example: 'SQRT(9) 返回3，也就是9的正平方根'
  },
  {
    name: 'SUM',
    handler: (...nums: any[]) => {
      const result = sum(nums.map(num => (isNaN(Number(num)) ? 0 : Number(num))))
      return result || ''
    },
    desc: 'SUM函数可以获取一组数值的总和',
    usage: 'SUM(数字1, 数字2, ...)',
    example: 'SUM(语文成绩, 数学成绩, 英语成绩) 返回三门课程的总分'
  },
  {
    name: 'LOWER',
    handler: (str: any) => {
      return str && typeof str === 'string' ? str.toLowerCase() : ''
    },
    desc: 'LOWER函数可以将一个文本中的所有大写字母转换为小写字母',
    usage: 'LOWER(文本)',
    example: 'LOWER("QWER") 返回"qwer"'
  },
  {
    name: 'UPPER',
    handler: (str: any) => {
      return str && typeof str === 'string' ? str.toUpperCase() : ''
    },
    desc: 'UPPER函数可以将一个文本中的所有小写字母转换为大写字母',
    usage: 'UPPER(文本)',
    example: 'UPPER("qwer") 返回"QWER"'
  },
  {
    name: 'REPEAT',
    handler: (str: any, times: any) => {
      times = isNaN(parseInt(times)) ? 0 : Math.abs(parseInt(times))
      return str && typeof str === 'string' ? str.repeat(times) : ''
    },
    desc: 'REPT函数可以将文本重复一定次数',
    usage: 'REPT(文本, 重复次数)',
    example: 'REPT("TEST", 3) 返回"TESTTESTTEST"'
  },
  {
    name: 'AND',
    handler: (...bools: any[]) => {
      return bools.every(bool => !!bool)
    },
    desc: '如果所有参数都为真，AND 函数返回布尔值 true，否则返回布尔值 false',
    usage: 'AND(逻辑表达式1, 逻辑表达式2, ...)',
    example:
      'AND(语文成绩>90, 数学成绩>90, 英语成绩>90)，如果三门课成绩都> 90，返回true，否则返回false'
  },

  {
    name: 'OR',
    handler: (...bools: any[]) => {
      return bools.some(bool => !!bool)
    },
    desc: '如果任意参数为真，OR 函数返回布尔值 true；如果所有参数为假，返回布尔值 false。',
    usage: 'OR(逻辑表达式1, 逻辑表达式2, ...)',
    example: 'OR(语文成绩>90, 数学成绩>90, 英语成绩>90)，任何一门课成绩>90，返回true，否则返回false'
  },
  {
    name: 'NOT',
    handler: (bool: any) => {
      return !bool
    },
    desc: 'NOT函数返回与指定表达式相反的布尔值。',
    usage: 'NOT(逻辑表达式)',
    example: 'NOT(语文成绩>60)，如果语文成绩大于60返回false，否则返回true'
  },
  {
    name: 'IF',
    handler: (bool: any, trueVal: any, falseVal: any) => {
      return bool
        ? trueVal !== undefined && trueVal !== null
          ? trueVal
          : ''
        : falseVal !== undefined && falseVal !== null
        ? falseVal
        : ''
    },
    desc: 'IF函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值',
    usage: 'IF(逻辑表达式, 为true时返回的值, 为false时返回的值)',
    example: 'IF(语文成绩>60, "及格", "不及格")，当语文成绩>60时返回及格，否则返回不及格。'
  }
]
