import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Favorites from './views/Favorites.vue'
import CreateRecipe from './views/CreateRecipe.vue'
import { autoRefreshEnvSettings } from './utils/envWatcher'
import './style.css'

const routes = [
    { path: '/', component: Home },
    { path: '/create', component: CreateRecipe },
    { path: '/favorites', component: Favorites },
    { path: '/about', component: About }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 初始化应用
const app = createApp(App).use(router)

// 在应用挂载前检查环境变量变化并自动刷新
autoRefreshEnvSettings()

// 挂载应用
app.mount('#app')
