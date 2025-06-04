"use server"

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// 创建DeepSeek客户端（使用OpenAI兼容接口）
const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-2521687cd38b4b958f38742347399297",
})

// 预设的用户宠物数据（服务器端）
const userPets = [
  {
    name: "豆豆",
    type: "狗",
    breed: "金毛",
    age: "2岁",
    symptoms: "最近食欲有所下降，偶尔咳嗽，但精神状态还算良好，喜欢玩耍",
    weight: "25公斤",
    lastCheckup: "3个月前",
  },
  {
    name: "小橘",
    type: "猫",
    breed: "橘猫",
    age: "1岁",
    symptoms: "毛发有些干燥，偶尔打喷嚏，食欲正常，活泼好动",
    weight: "4.5公斤",
    lastCheckup: "6个月前",
  },
]

// 生成宠物健康报告
export async function generatePetReport(petIndex = 0): Promise<string> {
  const pet = userPets[petIndex] || userPets[0]

  console.log("AI生成参数:", pet)

  const prompt = `请你作为一名专业的宠物医生，根据以下信息生成一份详细的宠物健康报告。请直接输出Markdown格式内容，不要包含代码块标记：

**宠物信息：**
- 宠物名称：${pet.name}
- 宠物类型：${pet.type}
- 品种：${pet.breed}
- 宠物年龄：${pet.age}
- 体重：${pet.weight}
- 上次体检：${pet.lastCheckup}
- 当前状况：${pet.symptoms}

请按照以下结构生成报告：

# 🐾 ${pet.name}的健康评估报告

## 📋 基本信息
- **姓名：** ${pet.name}
- **种类：** ${pet.type}（${pet.breed}）
- **年龄：** ${pet.age}
- **体重：** ${pet.weight}
- **上次体检：** ${pet.lastCheckup}
- **评估日期：** ${new Date().toLocaleDateString("zh-CN")}

## 🔍 当前状况分析
基于观察到的症状进行详细分析...

## ⚠️ 可能的健康问题
根据症状列出可能的健康问题...

## 🧪 建议检查项目
推荐的具体检查项目...

## 💊 护理建议
具体的日常护理建议...

## 🚨 紧急程度评估
评估当前症状的紧急程度...

## 📝 日常护理要点
长期的日常护理建议...

## 📞 后续建议
何时复查、注意事项等...

---
*本报告由AI助手生成，仅供参考。如有严重症状，请立即咨询专业兽医。*

请确保内容专业但通俗易懂，使用适当的emoji和markdown格式使报告更加美观易读。针对${pet.name}的具体情况（${pet.symptoms}）给出专业的分析和建议。`

  try {
    console.log("开始调用DeepSeek API...")

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 1500,
      temperature: 0.7,
    })

    console.log("DeepSeek API响应成功:", text)

    if (!text) {
      throw new Error("AI返回的内容为空")
    }

    return text
  } catch (error) {
    console.error("AI生成报告失败:", error)

    if (error instanceof Error) {
      if (error.message.includes("API") || error.message.includes("401")) {
        throw new Error("AI服务认证失败，请检查API密钥配置")
      } else if (error.message.includes("429")) {
        throw new Error("API调用频率超限，请稍后再试")
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        throw new Error("网络连接失败，请检查网络后重试")
      } else if (error.message.includes("timeout")) {
        throw new Error("请求超时，请稍后再试")
      } else {
        throw new Error(`生成报告失败: ${error.message}`)
      }
    }

    throw new Error("生成报告失败，请稍后再试")
  }
}
