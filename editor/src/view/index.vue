<template>
  <div class="formula-editor">
    <div class="formula-editor-title" v-if="title">{{ title }} =</div>
    <div
      class="formula-editor-container"
      :class="{ hasTitle: title }"
      :key="`${refreshKey}_${refreshNum}`"
    >
      <Codemirror
        v-model="value"
        class="formula-editor-codemirror"
        :style="{ height: `${height}px`, minHeight: '200px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        :disabled="disabled"
        :placeholder="placeholder || '请输入...'"
        @ready="handleReady"
      />
    </div>
    <div class="formula-params">
      <!--变量-->
      <ul class="formula-params-variable formula-params-list">
        <li
          class="variable-item formula-params-item"
          v-for="item in variables"
          :key="item.value"
          @click="insertVariables(item)"
        >
          <span class="variable-item-label">{{ item.label }}</span>
          <span class="variable-item-desc" v-show="item.desc">{{ item.desc }}</span>
        </li>
      </ul>
      <!--数学方法-->
      <ul class="formula-params-maths formula-params-list">
        <li
          class="maths-item formula-params-item"
          v-for="item in MATH_LIST"
          :key="item"
          @click="insertMaths(item)"
          @mouseenter="activeMath = item"
        >
          {{ item }}
        </li>
      </ul>
      <div class="formula-maths-desc formula-params-list">
        <p class="math-desc">{{ MATH_DESC_LIST[activeMath].desc }}</p>
        <p class="math-usage">用法：{{ MATH_DESC_LIST[activeMath].usage }}</p>
        <p class="math-example">示例：{{ MATH_DESC_LIST[activeMath].example }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import {
  autocompletion,
  closeBrackets,
  type Completion,
  pickedCompletion
} from '@codemirror/autocomplete'

import { Codemirror } from 'vue-codemirror'

import { shallowRef, ref, computed, watch, type PropType } from 'vue'

import { createMathPlaceholder } from '../utils/placeholder'
import { MATH_LIST, MATH_DESC_LIST, MATH_REG, type MathName } from '../utils/math'

import { uuid } from '../utils/index'
import { VARIABLE_REG } from '../utils/formula'
import type { VariableItem } from '../interfaces'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isDark: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variables: {
    type: Array as PropType<VariableItem[]>,
    default: () => []
  },
  height: {
    type: Number,
    default: 200
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const refreshKey = uuid()
const refreshNum = ref(0)

const variablesVals = computed(() => {
  return props.variables.map(item => item.value)
})
// 输出值
const value = defineModel({ default: '' })
// 当前editor值
const editor = shallowRef<EditorView>()
// 当前聚焦的math
const activeMath = ref<MathName>('ABS')

// 变量高亮
const variablePlaceholder = createMathPlaceholder(
  VARIABLE_REG,
  match => {
    const val = match[1]
    const variable = props.variables.find(item => item.value === val)
    return (variable && variable.label) || '不可用字段'
  },
  'variable'
)

// 函数高亮
const mathsPlaceholder = createMathPlaceholder(
  MATH_REG,
  match => {
    return match[0]
  },
  'mathfunc'
)

// 函数的自动提示
const mathsCompletions: Completion[] = MATH_LIST.map(item => {
  return {
    label: item,
    type: 'keyword',
    apply: (view: EditorView, completion: Completion, from: number, to: number) => {
      view.dispatch({
        changes: {
          from,
          to,
          insert: `${completion.label}()`
        }
      })
      let cursor = editor.value?.state.selection.main.head || 0
      view.dispatch({
        selection: { anchor: cursor - 1 },
        annotations: pickedCompletion.of(completion)
      })
    }
  }
})

/**
 * code自动提示
 * @param context
 */
const autoCompletions = (context: any) => {
  let before = context.matchBefore(/\w+/)
  if (!context.explicit && !before) return null

  return {
    from: before ? before.from : context.pos,
    options: [...mathsCompletions],
    validFor: /^\w*$/
  }
}

// codemirror extensions
const extensions = computed(() => {
  const list = [
    javascript(),
    closeBrackets(),
    autocompletion({ override: [autoCompletions] }),
    variablePlaceholder,
    mathsPlaceholder
  ]
  if (props.isDark) {
    list.push(oneDark)
  }
  return list
})

/**
 * @desc 插入文本
 * @param text
 * @param template
 * @param isFunc 是否是函数
 */
const insertText = (text: string, template: (text: string) => string, isFunc = false) => {
  if (!editor.value) {
    return
  }
  const { from, to } = editor.value.state.selection.main
  const insert = template(text)
  const len = insert.length
  editor.value.dispatch({
    changes: {
      from,
      to,
      insert
    },
    selection: {
      anchor: from + (isFunc ? len - 1 : len)
    }
  })
  // 聚焦
  editor.value.focus()
}

// 插入变量
const insertVariables = (item: VariableItem) => {
  insertText(item.value, text => '${' + text + '}')
}

// 插入math方法
const insertMaths = (name: MathName) => {
  insertText(name, name => `${name}()`, true)
}

const handleReady = (payload: {
  view: EditorView
  state: EditorState
  container: HTMLDivElement
}) => {
  editor.value = payload.view
}

// 监听变量变化就行刷新
watch(
  () => variablesVals.value,
  () => {
    refreshNum.value++
  },
  {
    deep: true,
    immediate: true
  }
)

defineOptions({
  name: 'FormulaEditor'
})
</script>
