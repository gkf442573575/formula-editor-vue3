import { createApp } from 'vue'
import App from './App.vue'

import FormulaEditor from 'formula-editor-vue3'
import 'formula-editor-vue3/dist/style.css'

const app = createApp(App)

app.use(FormulaEditor)

app.mount('#app')
