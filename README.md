# formula-editor-vue3

#### Formula Editor for Vue3 Built with [vue-codemirror](https://github.surmon.me/vue-codemirror) + [codemirror6](https://codemirror.net/)

## Install

```bash
npm install formula-editor-vue3 --save
```

## Usage

#### main.ts

```ts
import { createApp } from 'vue'

import App from './App.vue'

import FormulaEditor from 'formula-editor-vue3'
import 'formula-editor-vue3/dist/style.css'

const app = createApp(App)

app.use(FormulaEditor)

app.mount('#app')
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["formula-editor-vue3/type"]
  }
}
```

#### \*.vue

```html
<template>
  <div style="margin: 10px">
    <input type="text" readonly v-model="result" />
    <button @click="getResult">获取结果</button>
  </div>
  <formula-editor v-model="code" :variables="variables" />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import { evalFormula, type VariableItem } from 'formula-editor-vue3'

  const variables = ref<VariableItem[]>([])

  const code = ref('${d2345678} + 2 + SUM(${d2345678}, 2)')

  const result = ref('')

  const getResult = () => {
    const data = {
      d2345678: 1
    }
    try {
      // 使用eval来进行计算获取结果，通过处理变量来获取再data中的值，然后进行计算
      result.value = evalFormula(
        code.value,
        variable => {
          return `['${variable}']`
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
```

#### \*.vue use slot

```html
<template>
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
</script>
```

## Props

| Prop        | Type         | Default       | Description           | Required |
| ----------- | ------------ | ------------- | --------------------- | -------- |
| title       | string       | ''            | title                 | false    |
| isDark      | boolean      | false         | one dark theme        | false    |
| disabled    | boolean      | false         | disabled              | false    |
| height      | number       | 200           | editor height         | false    |
| placeholder | string       | ''            | editor placeholder    | false    |
| variables   | VariableItem | []            | variables for formula | false    |
| mathList    | MathItem     | FORMULA_MATHS | math list for formula | false    |

## Slots

| Slot Name | props  | type                     | Description             |
| --------- | ------ | ------------------------ | ----------------------- |
| math      | insert | (mathName:string)=> void | insert math formula     |
| variable  | insert | (varName:string)=> void  | insert variable formula |
