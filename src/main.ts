import TDesign from 'tdesign-vue-next'
import { createApp } from 'vue'
import App from './App.vue'
import 'tdesign-vue-next/es/style/index.css'
import './style.css'

const app = createApp(App)
app.use(TDesign)

app.mount('#app')
