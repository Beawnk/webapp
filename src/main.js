import './assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import AppMenu from './components/AppMenu.vue'
import FieldNotifications from './components/FieldNotifications.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.component('AppMenu', AppMenu)
app.component('FieldNotifications', FieldNotifications)

app.mount('#app')