import type { Recipe } from '@/types'
import { getImageGenerationConfig } from '@/utils/apiConfig'

export interface GeneratedImage {
    url: string
    id: string
}

export const generateRecipeImage = async (recipe: Recipe): Promise<GeneratedImage> => {
    // 从设置中获取图片生成配置
    const config = getImageGenerationConfig()

    // 验证配置
    if (!config.baseUrl || !config.apiKey || !config.model) {
        throw new Error('图片生成配置不完整，请在设置中配置API地址、密钥和模型')
    }

    // 构建图片生成的提示词
    const prompt = buildImagePrompt(recipe)

    // 检测模型类型，以确定支持的参数
    const modelLower = config.model.toLowerCase()
    const isDalle3 = modelLower.includes('dall-e-3') || modelLower === 'dall-e-3'
    const isDalle2 = modelLower.includes('dall-e-2') || modelLower === 'dall-e-2'

    // OpenAI DALL-E 支持的尺寸
    // DALL-E 3: 1024x1024, 1792x1024, 1024x1792
    // DALL-E 2: 256x256, 512x512, 1024x1024
    const size = isDalle3 ? '1024x1024' : (isDalle2 ? '1024x1024' : '1024x1024')

    // 构建请求体
    const requestBody: any = {
        model: config.model,
        prompt: prompt,
        n: 1,
        size: size
    }

    // 只有 DALL-E 3 支持 quality 和 style 参数
    if (isDalle3) {
        requestBody.quality = 'hd'
        requestBody.style = 'vivid'
    }

    console.log('图片生成请求配置:', {
        baseUrl: config.baseUrl,
        model: config.model,
        size: size,
        hasQuality: !!requestBody.quality,
        hasStyle: !!requestBody.style
    })

    try {
        const response = await fetch(config.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.apiKey}`
            },
            body: JSON.stringify(requestBody)
        })

        // 获取响应文本以便调试
        const responseText = await response.text()
        console.log('API响应状态:', response.status, response.statusText)
        console.log('API响应内容:', responseText.substring(0, 500)) // 只打印前500字符

        if (!response.ok) {
            // 尝试解析错误信息
            let errorMessage = `API请求失败: ${response.status} ${response.statusText}`
            try {
                const errorData = JSON.parse(responseText)
                if (errorData.error) {
                    errorMessage = errorData.error.message || errorData.error.code || errorMessage
                    console.error('API错误详情:', errorData.error)
                }
            } catch (e) {
                // 如果无法解析JSON，使用原始响应
                console.error('API错误响应:', responseText)
            }
            throw new Error(errorMessage)
        }

        const data = JSON.parse(responseText)

        // OpenAI 返回格式: { data: [{ url: "...", revised_prompt: "..." }] }
        if (data.data && Array.isArray(data.data) && data.data.length > 0 && data.data[0].url) {
            console.log('图片生成成功:', data.data[0].url)
            return {
                url: data.data[0].url,
                id: `${recipe.id}-${Date.now()}`
            }
        } else {
            console.error('API返回数据格式错误:', data)
            throw new Error('API返回数据格式错误: 缺少图片URL')
        }
    } catch (error) {
        console.error('生成图片失败:', error)
        // 提供更友好的错误信息
        if (error instanceof Error) {
            // 检查是否是常见的错误类型
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                throw new Error('API密钥无效，请检查设置中的API密钥')
            } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                throw new Error('请求过于频繁，请稍后再试')
            } else if (error.message.includes('insufficient_quota') || error.message.includes('quota')) {
                throw new Error('API账户余额不足，请充值后重试')
            } else if (error.message.includes('invalid') || error.message.includes('Invalid')) {
                throw new Error('请求参数无效: ' + error.message)
            }
            throw error
        }
        throw new Error('生成图片失败: ' + String(error))
    }
}

const buildImagePrompt = (recipe: Recipe): string => {
    // 根据菜谱信息构建详细的图片生成提示词
    const ingredients = recipe.ingredients.join('、')
    const cuisineStyle = recipe.cuisine.replace('大师', '').replace('菜', '')

    return `一道精美的${cuisineStyle}菜肴：${recipe.name}，主要食材包括${ingredients}。菜品摆盘精致，色彩丰富，光线柔和，专业美食摄影风格，高清画质，餐厅级别的视觉效果。背景简洁，突出菜品本身的美感。`
}
