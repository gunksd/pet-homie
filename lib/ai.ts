"use server"

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// 创建DeepSeek客户端（使用OpenAI兼容接口）
const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-2521687cd38b4b958f38742347399297",
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

  const prompt = `请你作为一名专业的宠物医生，根据以下信息生成一份详细的宠物健康报告：

**宠物信息：**
- 宠物名称：${pet.name}
- 宠物类型：${pet.type}
- 品种：${pet.breed}
- 宠物年龄：${pet.age}
- 体重：${pet.weight}
- 上次体检：${pet.lastCheckup}
- 当前状况：${pet.symptoms}

请生成一份专业的健康评估报告，包含当前状况分析、可能的健康问题、建议检查项目、护理建议等内容。请使用中文回复，内容要专业但通俗易懂。`

  try {
    console.log("开始调用DeepSeek API...")

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    console.log("DeepSeek API响应成功")

    if (!text || text.trim().length === 0) {
      throw new Error("AI返回的内容为空")
    }

    return text
  } catch (error) {
    console.error("AI生成报告失败:", error)

    // 返回一个默认的报告模板
    return `# 🐾 ${pet.name}的健康评估报告

## 📋 基本信息
- **姓名：** ${pet.name}
- **种类：** ${pet.type}（${pet.breed}）
- **年龄：** ${pet.age}
- **体重：** ${pet.weight}
- **上次体检：** ${pet.lastCheckup}
- **评估日期：** ${new Date().toLocaleDateString("zh-CN")}

## 🔍 当前状况分析
根据您提供的信息，${pet.name}目前的状况是：${pet.symptoms}

## ⚠️ 可能的健康问题
基于观察到的症状，建议关注以下方面：
- 定期监测食欲和精神状态
- 注意观察是否有其他异常症状

## 💊 护理建议
- 保持规律的饮食和作息
- 适量运动，保持身体健康
- 定期体检，及时发现问题

## 📞 后续建议
如症状持续或加重，请及时咨询专业兽医。

---
*本报告由AI助手生成，仅供参考。如有严重症状，请立即咨询专业兽医。*`
  }
}
