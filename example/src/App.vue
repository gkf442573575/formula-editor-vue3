<template>
  <div style="margin: 10px">
    <input type="text" readonly v-model="result" placeholder="输出结果" class="result-input" />
    <button @click="getResult" style="margin-left: 10px" class="result-btn">获取结果</button>
    <input v-model="isDark" type="checkbox" id="switch" style="margin-left: 10px" />
    <label for="switch" style="margin-left: 5px">Dark</label>
  </div>

  <formula-editor v-model="code" :title="'公式编辑器'" :variables="variables" :is-dark="isDark" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { evalFormula, type VariableItem } from 'formula-editor-vue3'

const variables = ref<VariableItem[]>([])

const code = ref('${d2345678} + 2 + SUM(${d2345678}, 2)')

const result = ref('')
const isDark = ref(false)

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

<style scoped>
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
</style>
