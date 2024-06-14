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

## Props

| Prop        | Type         | Default | Description           | Required |
| ----------- | ------------ | ------- | --------------------- | -------- |
| title       | string       | ''      | title                 | false    |
| isDark      | boolean      | false   | one dark theme        | false    |
| disabled    | boolean      | false   | disabled              | false    |
| variables   | VariableItem | []      | variables for formula | false    |
| height      | number       | 200     | editor height         | false    |
| placeholder | string       | ''      | editor placeholder    | false    |
