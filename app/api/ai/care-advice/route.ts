import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// 创建DeepSeek客户端
const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-2521687cd38b4b958f38742347399297",
})

export async function POST(request: Request) {
  try {
    const { petName, petType } = await request.json()

    const prompt = `作为专业宠物护理专家，为${petType}${petName}制定个性化护理方案。

请生成一份详细的护理建议报告：

# 🌟 ${petName}的个性化护理方案

## 🍽️ 营养管理
- 适合的食物类型和品牌推荐
- 喂食频率和分量控制
- 营养补充建议
- 禁忌食物清单

## 🏃 运动与活动
- 每日运动量建议
- 适合的运动类型
- 室内外活动安排
- 年龄相关的运动调整

## 🛁 日常护理
- 毛发梳理和洗澡频率
- 指甲修剪和牙齿清洁
- 耳部和眼部护理
- 皮肤保养要点

## 🏠 环境优化
- 居住环境布置建议
- 温度和湿度控制
- 安全隐患排查
- 玩具和用品选择

## 💊 预防保健
- 疫苗和驱虫计划
- 定期体检安排
- 常见疾病预防
- 应急药品准备

请结合${petType}的生理特点和行为习性，提供实用的护理建议。`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 1200,
      temperature: 0.7,
    })

    return NextResponse.json({ report: text })
  } catch (error) {
    console.error("生成护理建议失败:", error)
    return NextResponse.json({ error: "生成护理建议失败" }, { status: 500 })
  }
}
