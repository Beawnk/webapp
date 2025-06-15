import './assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Menu from './components/Menu.vue'
import FieldNotifications from './components/FieldNotifications.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.component('Menu', Menu)
app.component('FieldNotifications', FieldNotifications)

app.mount('#app')