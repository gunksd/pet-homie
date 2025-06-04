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

    const prompt = `作为专业宠物医生，为${petType}${petName}制定健康评估指南。

请生成一份详细的健康评估报告，包含：

# 🏥 ${petName}的健康评估指南

## 📊 日常健康检查清单
- 体温、心率、呼吸频率的正常范围
- 眼部、耳部、口腔检查要点
- 皮肤和毛发状况评估
- 行为和精神状态观察

## 🚨 异常信号识别
- 需要立即就医的紧急症状
- 常见疾病的早期征象
- 年龄相关的健康风险

## 📅 定期检查建议
- 疫苗接种时间表
- 体检频率建议
- 预防性护理措施

## 💡 家庭护理技巧
- 日常观察要点
- 简单的健康监测方法
- 紧急情况的应对措施

请用专业但易懂的语言，结合${petType}的特点给出具体建议。`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 1200,
      temperature: 0.7,
    })

    return NextResponse.json({ report: text })
  } catch (error) {
    console.error("生成健康评估失败:", error)
    return NextResponse.json({ error: "生成健康评估失败" }, { status: 500 })
  }
}
