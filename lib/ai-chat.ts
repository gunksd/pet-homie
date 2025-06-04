"use server"

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// 创建DeepSeek客户端
const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-2521687cd38b4b958f38742347399297", // 使用已有的API密钥
})

// 生成AI回复
export async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    const prompt = `你是一位专业的宠物医生助手，请对以下用户消息进行回复。回复要专业、友好且简洁。
    
用户消息: ${userMessage}

请直接回复内容，不要添加任何前缀如"作为宠物医生助手"等。`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 500,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("生成AI回复失败:", error)
    return "抱歉，我现在无法回复您的消息。请稍后再试。"
  }
}
