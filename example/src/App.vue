<template>
  <div style="margin: 10px">
    <input type="text" readonly v-model="result" placeholder="输出结果" class="result-input" />
    <button @click="getResult" style="margin-left: 10px" class="result-btn">获取结果</button>
    <input v-model="isDark" type="checkbox" id="switch" style="margin-left: 10px" />
    <label for="switch" style="margin-left: 5px">Dark</label>
  </div>
  <formula-editor v-model="code" :title="'公式编辑器'" :variables="variables" :is-dark="isDark" />
  <h4>使用slot自定义内容</h4>
  <div style="margin: 10px">
    <input
      type="text"
      readonly
      v-model="customResult"
      placeholder="输出结果"
      class="result-input"
    />
    <button @click="getCustomResult" style="margin-left: 10px" class="result-btn">
      获取自定义结果
    </button>
  </div>
  <formula-editor
    v-model="customCode"
    :title="'自定义计算MATHS'"
    :variables="customVariables"
    :is-dark="isDark"
    :math-list="customMathList"
  >
    <template #variable="{ insert }">
      <ul class="custom-variables-list">
        <li v-for="item in customVariables" :key="item.value" @click="insert(item.value)">
          {{ item.label }}
        </li>
      </ul>
    </template>
    <template #math="{ insert }">
      <ul class="custom-maths-list">
        <li v-for="item in customMathList" :key="item.name" @click="insert(item.name)">
          {{ item.name }}
        </li>
      </ul>
    </template>
  </formula-editor>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { evalFormula, FORMULA_MATHS, type VariableItem, type MathItem } from 'formula-editor-vue3'

const variables = ref<VariableItem[]>([])

const code = ref('${d2345678} + 2 + SUM(${d2345678}, 2)')

const result = ref('')
const isDark = ref(false)

const customVariables = ref<VariableItem[]>([
  {
    label: '当前日期',
    value: 'd1345678'
  }
])
const customCode = ref('GET_DATE(${d1345678})')
const customResult = ref('')
const customMathList = ref<MathItem[]>([
  {
    name: 'GET_DATE',
    handler: date => {
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }
  }
])

const getCustomResult = () => {
  const data = {
    d1345678: new Date('2024-12-01')
  }
  try {
    customResult.value = evalFormula(
      customCode.value,
      text => {
        return `['${text}']`
      },
      data,
      customMathList.value
    )
  } catch (error) {
    console.error('formula error >>>', error)
  }
}

const getResult = () => {
  const data = {
    d2345678: 1
  }
  try {
    result.value = evalFormula(
      code.value,
      text => {
        return `['${text}']`
      },
      data
    )
  } catch (error) {
    console.error('formula error >>>', error)
  }
}

onMounted(() => {
  variables.value = [
    {
      label: '单行文本',
      value: 'd2345678',
      desc: '字符串'
    }
  ]
})
</script>

<style lang="scss">
.result-btn {
  padding: 4px 10px;
  background-color: transparent;
  outline: none;
  border: 1px solid #275efe;
  color: #275efe;
  cursor: pointer;
  border-radius: 4px;
}
.result-btn:hover {
  box-shadow: 0 0 10px #738bd3;
}

.result-input {
  padding: 4px 10px;
  border: 1px solid #275efe;
  outline: none;
}
ul,
li {
  list-style: none;
}

.custom-variables-list {
  width: 40%;
  height: 100%;
  float: left;
  border: 1px solid #dcdfe6;
  padding: 10px;
  li {
    cursor: pointer;
    &:hover {
      color: #275efe;
    }
  }
}
.custom-maths-list {
  width: 40%;
  height: 100%;
  float: left;
  border: 1px solid #dcdfe6;
  margin-left: 10px;
  padding: 10px;
  li {
    cursor: pointer;
    &:hover {
      color: #275efe;
    }
  }
}
</style>
