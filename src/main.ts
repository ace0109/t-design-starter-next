import TDesign from 'tdesign-vue-next'
import { createApp } from 'vue'
import i18n from '@/locales'
import App from './App.vue'
import 'virtual:uno.css'
import 'tdesign-vue-next/es/style/index.css'
import './style.css'

const app = createApp(App)
app.use(TDesign)
app.use(i18n)

app.mount('#app')
