<template>
    <div class="min-h-screen bg-yellow-400 px-2 md:px-4 py-6">
        <!-- 全局导航 -->
        <GlobalNavigation />

        <div class="max-w-4xl mx-auto">
            <!-- 页面标题 -->
            <div class="mb-6">
                <div class="bg-blue-500 text-white px-4 py-2 rounded-t-lg border-2 border-[#0A0910] border-b-0 inline-block">
                    <span class="font-bold">{{ isEditMode ? '编辑菜谱' : '创建菜谱' }}</span>
                </div>
                <div class="bg-white border-2 border-[#0A0910] rounded-lg rounded-tl-none p-4 md:p-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span class="text-white text-2xl">✍️</span>
                            </div>
                            <div>
                                <h1 class="text-md font-bold text-gray-800">{{ isEditMode ? '编辑我的菜谱' : '创建我的菜谱' }}</h1>
                                <p class="text-gray-600 text-xs">{{ isEditMode ? '修改菜谱信息' : '手动输入菜谱信息并保存' }}</p>
                            </div>
                        </div>
                        <router-link
                            to="/favorites"
                            class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                        >
                            ← 返回收藏
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- 表单区域 -->
            <div class="bg-white border-2 border-[#0A0910] rounded-lg p-4 md:p-6">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- 基本信息 -->
                    <div class="space-y-4">
                        <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">基本信息</h2>

                        <!-- 菜谱名称 -->
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2">
                                菜谱名称 <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="formData.name"
                                type="text"
                                required
                                placeholder="例如：宫保鸡丁"
                                class="w-full p-3 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <!-- 菜系 -->
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2">
                                菜系 <span class="text-red-500">*</span>
                            </label>
                            <select
                                v-model="formData.cuisine"
                                required
                                class="w-full p-3 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">请选择菜系</option>
                                <option v-for="cuisine in cuisineOptions" :key="cuisine" :value="cuisine">
                                    {{ cuisine }}
                                </option>
                                <option value="自定义">自定义</option>
                            </select>
                        </div>

                        <!-- 烹饪时间 -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">
                                    烹饪时间（分钟）<span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model.number="formData.cookingTime"
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="30"
                                    class="w-full p-3 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <!-- 难度 -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">
                                    难度 <span class="text-red-500">*</span>
                                </label>
                                <select
                                    v-model="formData.difficulty"
                                    required
                                    class="w-full p-3 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="easy">简单</option>
                                    <option value="medium">中等</option>
                                    <option value="hard">困难</option>
                                </select>
                            </div>
                        </div>

                        <!-- 图片URL（可选） -->
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2">
                                图片URL（可选）
                            </label>
                            <input
                                v-model="formData.imageUrl"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                class="w-full p-3 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <p class="text-xs text-gray-500 mt-1">可以输入图片链接，或留空稍后添加</p>
                        </div>
                    </div>

                    <!-- 食材列表 -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                            <h2 class="text-lg font-bold text-gray-800">所需食材 <span class="text-red-500">*</span></h2>
                            <button
                                type="button"
                                @click="addIngredient"
                                class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                            >
                                + 添加食材
                            </button>
                        </div>

                        <div v-if="formData.ingredients.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <p class="text-gray-500 text-sm">还没有添加食材，点击上方按钮添加</p>
                        </div>

                        <div v-else class="space-y-2">
                            <div
                                v-for="(_, index) in formData.ingredients"
                                :key="index"
                                class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <input
                                    v-model="formData.ingredients[index]"
                                    type="text"
                                    required
                                    :placeholder="`食材 ${index + 1}`"
                                    class="flex-1 p-2 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    @click="removeIngredient(index)"
                                    class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                                >
                                    删除
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 制作步骤 -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                            <h2 class="text-lg font-bold text-gray-800">制作步骤 <span class="text-red-500">*</span></h2>
                            <button
                                type="button"
                                @click="addStep"
                                class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                            >
                                + 添加步骤
                            </button>
                        </div>

                        <div v-if="formData.steps.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <p class="text-gray-500 text-sm">还没有添加步骤，点击上方按钮添加</p>
                        </div>

                        <div v-else class="space-y-4">
                            <div
                                v-for="(step, index) in formData.steps"
                                :key="index"
                                class="p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            {{ step.step }}
                                        </div>
                                        <span class="text-sm font-bold text-gray-700">步骤 {{ step.step }}</span>
                                    </div>
                                    <button
                                        type="button"
                                        @click="removeStep(index)"
                                        class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                                    >
                                        删除
                                    </button>
                                </div>

                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">步骤描述 <span class="text-red-500">*</span></label>
                                        <textarea
                                            v-model="step.description"
                                            required
                                            rows="2"
                                            :placeholder="`描述步骤 ${step.step} 的具体操作`"
                                            class="w-full p-2 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        ></textarea>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-1">时间（分钟，可选）</label>
                                            <input
                                                v-model.number="step.time"
                                                type="number"
                                                min="0"
                                                placeholder="5"
                                                class="w-full p-2 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-1">温度/火候（可选）</label>
                                            <input
                                                v-model="step.temperature"
                                                type="text"
                                                placeholder="中火"
                                                class="w-full p-2 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 烹饪技巧 -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                            <h2 class="text-lg font-bold text-gray-800">烹饪技巧（可选）</h2>
                            <button
                                type="button"
                                @click="addTip"
                                class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                            >
                                + 添加技巧
                            </button>
                        </div>

                        <div v-if="formData.tips.length === 0" class="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <p class="text-gray-500 text-sm">可以添加一些烹饪小技巧，让菜谱更完美</p>
                        </div>

                        <div v-else class="space-y-2">
                            <div
                                v-for="(_, index) in formData.tips"
                                :key="index"
                                class="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                            >
                                <input
                                    v-model="formData.tips[index]"
                                    type="text"
                                    :placeholder="`技巧 ${index + 1}`"
                                    class="flex-1 p-2 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    @click="removeTip(index)"
                                    class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                                >
                                    删除
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 提交按钮 -->
                    <div class="flex items-center justify-end gap-4 pt-4 border-t-2 border-gray-200">
                        <router-link
                            to="/favorites"
                            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                        >
                            取消
                        </router-link>
                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{ isSubmitting ? '保存中...' : isEditMode ? '更新菜谱' : '保存菜谱' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 底部 -->
        <GlobalFooter />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Recipe, RecipeStep } from '@/types'
import { FavoriteService } from '@/services/favoriteService'
import GlobalNavigation from '@/components/GlobalNavigation.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import { cuisines } from '@/config/cuisines'

const router = useRouter()
const route = useRoute()

// 表单数据
const formData = reactive<{
    name: string
    cuisine: string
    ingredients: string[]
    steps: RecipeStep[]
    cookingTime: number
    difficulty: 'easy' | 'medium' | 'hard'
    tips: string[]
    imageUrl: string
}>({
    name: '',
    cuisine: '',
    ingredients: [],
    steps: [],
    cookingTime: 30,
    difficulty: 'medium',
    tips: [],
    imageUrl: ''
})

const isSubmitting = ref(false)
const isEditMode = ref(false)
const editingRecipeId = ref<string | null>(null)

// 菜系选项（从配置中提取，加上自定义选项）
const cuisineOptions = computed(() => {
    return cuisines.map(c => c.name.replace('大师', '').replace('菜', ''))
})

// 添加食材
const addIngredient = () => {
    formData.ingredients.push('')
}

// 删除食材
const removeIngredient = (index: number) => {
    formData.ingredients.splice(index, 1)
}

// 添加步骤
const addStep = () => {
    const stepNumber = formData.steps.length + 1
    formData.steps.push({
        step: stepNumber,
        description: '',
        time: undefined,
        temperature: undefined
    })
}

// 删除步骤
const removeStep = (index: number) => {
    formData.steps.splice(index, 1)
    // 重新编号步骤
    formData.steps.forEach((step, idx) => {
        step.step = idx + 1
    })
}

// 添加技巧
const addTip = () => {
    formData.tips.push('')
}

// 删除技巧
const removeTip = (index: number) => {
    formData.tips.splice(index, 1)
}

// 处理表单提交
const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.name.trim()) {
        alert('请输入菜谱名称')
        return
    }
    if (!formData.cuisine) {
        alert('请选择菜系')
        return
    }
    if (formData.ingredients.length === 0 || formData.ingredients.some(ingredient => !ingredient.trim())) {
        alert('请至少添加一个食材，且所有食材不能为空')
        return
    }
    if (formData.steps.length === 0 || formData.steps.some(step => !step.description.trim())) {
        alert('请至少添加一个步骤，且所有步骤描述不能为空')
        return
    }

    isSubmitting.value = true

    try {
        // 清理空的技巧
        const validTips = formData.tips.filter(t => t.trim())
        
        // 清理步骤中的空值
        const validSteps = formData.steps.map(step => ({
            step: step.step,
            description: step.description.trim(),
            time: step.time || undefined,
            temperature: step.temperature?.trim() || undefined
        }))

        // 构建Recipe对象
        const now = new Date().toISOString()
        const recipe: Recipe = {
            id: isEditMode.value && editingRecipeId.value 
                ? editingRecipeId.value 
                : `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: formData.name.trim(),
            cuisine: formData.cuisine,
            ingredients: formData.ingredients.map(ing => ing.trim()).filter(ing => ing),
            steps: validSteps,
            cookingTime: formData.cookingTime,
            difficulty: formData.difficulty,
            tips: validTips,
            source: 'manual',
            createdAt: isEditMode.value ? undefined : now, // 编辑模式不更新创建时间
            updatedAt: now,
            imageUrl: formData.imageUrl.trim() || undefined
        }

        // 保存到收藏（使用favoriteService）
        if (isEditMode.value && editingRecipeId.value) {
            // 编辑模式：需要更新现有的收藏
            const favorites = FavoriteService.getFavorites()
            const favoriteIndex = favorites.findIndex(fav => fav.recipe.id === editingRecipeId.value)
            
            if (favoriteIndex !== -1) {
                // 更新现有收藏的recipe
                favorites[favoriteIndex].recipe = recipe
                // 保存回localStorage
                localStorage.setItem('yifan-fengshen-favorites', JSON.stringify(favorites))
            } else {
                // 如果找不到，就添加新的
                FavoriteService.addFavorite(recipe)
            }
        } else {
            // 新建模式：直接添加
            const success = FavoriteService.addFavorite(recipe)
            if (!success) {
                alert('保存失败，该菜谱可能已经存在')
                isSubmitting.value = false
                return
            }
        }

        // 成功提示
        alert(isEditMode.value ? '菜谱更新成功！' : '菜谱保存成功！')
        
        // 跳转到收藏页面
        router.push('/favorites')
    } catch (error) {
        console.error('保存菜谱失败:', error)
        alert('保存失败，请稍后重试')
    } finally {
        isSubmitting.value = false
    }
}

// 初始化：如果是编辑模式，加载现有数据
onMounted(() => {
    const recipeId = route.query.id as string | undefined
    if (recipeId) {
        // 编辑模式
        isEditMode.value = true
        editingRecipeId.value = recipeId
        
        // 从收藏中加载数据
        const favorites = FavoriteService.getFavorites()
        const favorite = favorites.find(fav => fav.recipe.id === recipeId)
        
        if (favorite && favorite.recipe.source === 'manual') {
            const recipe = favorite.recipe
            formData.name = recipe.name
            formData.cuisine = recipe.cuisine
            formData.ingredients = [...recipe.ingredients]
            formData.steps = recipe.steps.map(step => ({
                step: step.step,
                description: step.description,
                time: step.time,
                temperature: step.temperature
            }))
            formData.cookingTime = recipe.cookingTime
            formData.difficulty = recipe.difficulty
            formData.tips = [...(recipe.tips || [])]
            formData.imageUrl = recipe.imageUrl || ''
        } else {
            // 如果找不到或不是手动创建的，跳转到收藏页
            router.push('/favorites')
        }
    } else {
        // 新建模式：添加一个默认的食材和步骤
        addIngredient()
        addStep()
    }
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>

