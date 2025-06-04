"use server"

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// 创建DeepSeek客户端
const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-2521687cd38b4b958f38742347399297",
})

// 生成AI回复
export async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    const prompt = `你是一位专业的宠物医生AI助手，名叫"AI宠物助手"。你的特点：
- 专业：具备丰富的宠物医疗和护理知识
- 友好：语气温和亲切，像朋友一样关心宠物主人
- 实用：提供具体可行的建议和解决方案
- 简洁：回复要简明扼要，不要太长

用户消息: "${userMessage}"

请根据用户的消息内容，提供专业、友好且实用的回复。如果涉及严重健康问题，建议及时就医。回复要自然流畅，就像真人对话一样。`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 300,
      temperature: 0.8,
    })

    return text
  } catch (error) {
    console.error("生成AI回复失败:", error)

    // 提供一些备用回复
    const fallbackReplies = [
      "抱歉，我现在无法回复您的消息。请稍后再试，或者您可以描述一下宠物的具体情况。",
      "系统暂时繁忙，请稍后再试。如果是紧急情况，建议立即联系当地兽医。",
      "网络连接有问题，请稍后重试。有什么宠物问题我都很乐意帮助您！",
    ]

    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)]
  }
}

// 生成智能问候语
export async function generateGreeting(userName?: string): Promise<string> {
  try {
    const prompt = `作为AI宠物助手，为${userName || "宠物主人"}生成一个友好的问候语。要求：
- 简短亲切
- 体现专业性
- 主动询问可以帮助什么
- 不超过50字

直接输出问候语内容，不要添加引号或其他格式。`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 100,
      temperature: 0.9,
    })

    return text
  } catch (error) {
    console.error("生成问候语失败:", error)
    return "您好！我是AI宠物助手，很高兴为您服务。请问有什么可以帮助您的吗？"
  }
}
