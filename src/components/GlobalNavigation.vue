<template>
    <nav class="bg-white border-2 border-[#0A0910] max-w-7xl mx-auto rounded-lg mb-4 shadow-lg">
        <div class="px-4 py-6 md:px-6">
            <!-- 桌面端导航 -->
            <div class="hidden md:flex items-center justify-between">
                <!-- Logo区域 -->
                <router-link to="/" class="flex items-center gap-3 transition-transform duration-200" @click="rotateLogo">
                    <div
                        class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center border-2 border-[#0A0910]"
                        :class="{ 'rotate-logo': isLogoRotating }"
                    >
                        <span class="text-white text-xl font-bold">饭</span>
                    </div>
                    <div>
                        <div class="text-2xl font-black text-dark-800 tracking-wider">
                            {{ pageTitle }}
                        </div>
                        <div class="text-xs text-gray-600 font-medium">{{ pageSubtitle }}</div>
                    </div>
                </router-link>

                <!-- 导航菜单 -->
                <div class="flex items-center gap-2">
                    <!-- 设置按钮 -->
                    <SettingsButton />
                    <!-- 主要功能 -->
                    <router-link
                        to="/"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>🏠</span>
                        <span>主页</span>
                    </router-link>
                    <router-link
                        to="/create"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/create' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>✍️</span>
                        <span>创建菜谱</span>
                    </router-link>
                    <router-link
                        to="/favorites"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/favorites' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>❤️</span>
                        <span>我的收藏</span>
                    </router-link>
                    <router-link
                        to="/about"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/about' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>📖</span>
                        <span>关于</span>
                    </router-link>
                </div>
            </div>

            <!-- 移动端导航 -->
            <div class="md:hidden">
                <!-- 顶部Logo和菜单按钮 -->
                <div class="flex items-center justify-between">
                    <router-link to="/" class="flex items-center gap-2" @click="rotateLogo">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center border-2 border-[#0A0910]"
                            :class="{ 'rotate-logo': isLogoRotating }"
                        >
                            <span class="text-white text-lg font-bold">饭</span>
                        </div>
                        <div>
                            <div class="text-lg font-black text-dark-800 tracking-wider">
                                {{ pageTitle }}
                            </div>
                            <div class="text-xs text-gray-600 font-medium">{{ pageSubtitle }}</div>
                        </div>
                    </router-link>
                    <div class="flex items-center gap-2">
                        <!-- 移动端设置按钮 -->
                        <SettingsButton />
                        <button @click="showMobileMenu = !showMobileMenu" class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg border-2 border-[#0A0910] transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- 移动端菜单 - 横向滚动标签栏 -->
                <div v-if="showMobileMenu" class="border-t-2 border-gray-200 pt-3 mt-3">
                    <!-- 横向滚动导航 -->
                    <div class="overflow-x-auto scrollbar-hide">
                        <div class="flex gap-2 pb-2 min-w-max">
                            <router-link
                                to="/"
                                @click="showMobileMenu = false"
                                class="flex items-center gap-1.5 px-3 py-2 rounded-full font-bold border-2 border-[#0A0910] transition-all duration-200 whitespace-nowrap text-sm"
                                :class="$route.path === '/' ? 'bg-yellow-400 text-gray-800 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'"
                            >
                                <span>🏠</span>
                                <span>主页</span>
                            </router-link>
                            <router-link
                                to="/create"
                                @click="showMobileMenu = false"
                                class="flex items-center gap-1.5 px-3 py-2 rounded-full font-bold border-2 border-[#0A0910] transition-all duration-200 whitespace-nowrap text-sm"
                                :class="$route.path === '/create' ? 'bg-yellow-400 text-gray-800 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'"
                            >
                                <span>✍️</span>
                                <span>创建菜谱</span>
                            </router-link>
                            <router-link
                                to="/favorites"
                                @click="showMobileMenu = false"
                                class="flex items-center gap-1.5 px-3 py-2 rounded-full font-bold border-2 border-[#0A0910] transition-all duration-200 whitespace-nowrap text-sm"
                                :class="$route.path === '/favorites' ? 'bg-yellow-400 text-gray-800 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'"
                            >
                                <span>❤️</span>
                                <span>我的收藏</span>
                            </router-link>
                            <router-link
                                to="/about"
                                @click="showMobileMenu = false"
                                class="flex items-center gap-1.5 px-3 py-2 rounded-full font-bold border-2 border-[#0A0910] transition-all duration-200 whitespace-nowrap text-sm"
                                :class="$route.path === '/about' ? 'bg-yellow-400 text-gray-800 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'"
                            >
                                <span>📖</span>
                                <span>关于</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import SettingsButton from './SettingsButton.vue'

const showMobileMenu = ref(false)
const isLogoRotating = ref(false)

const rotateLogo = () => {
    isLogoRotating.value = true
    setTimeout(() => {
        isLogoRotating.value = false
    }, 500)
}
const route = useRoute()

// 根据当前路由显示不同的页面标题
const pageTitle = computed(() => {
    switch (route.path) {
        case '/':
            return 'What to Eat'
        case '/create':
            return '创建菜谱'
        case '/favorites':
            return '我的收藏'
        case '/about':
            return 'About What to Eat'
        default:
            return 'What to Eat'
    }
})

const pageSubtitle = computed(() => {
    switch (route.path) {
        case '/':
            return 'AI Recipe Generator & Personal Recipe Manager'
        case '/create':
            return '记录你的独家秘方！'
        case '/favorites':
            return '珍藏美味，随时回味！'
        case '/about':
            return 'AI Recipe Generator & Personal Recipe Manager'
        default:
            return 'AI Recipe Generator & Personal Recipe Manager'
    }
})
</script>

<style scoped>
/* Logo旋转动画 */
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.rotate-logo {
    animation: rotate 0.5s ease-out;
}

/* 移动端菜单展开动画 */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.flex {
    animation: slideDown 0.3s ease-out;
}

/* 下拉菜单动画 */
@keyframes dropDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.absolute {
    animation: dropDown 0.2s ease-out;
}

/* 隐藏滚动条 */
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
