import TDesignPro from 't-design-pro'
import TDesign from 'tdesign-vue-next'
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './locales'
import router from './router'
import { store } from './store'
import 'virtual:uno.css'
import 'tdesign-vue-next/es/style/index.css'
import 't-design-pro/dist/styles/index.css'
import './style/variables.css'
import './style/index.css'
import './permission'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(TDesign)
app.use(TDesignPro)
app.use(i18n)

app.mount('#app')
