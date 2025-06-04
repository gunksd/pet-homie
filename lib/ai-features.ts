"use server"

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// 创建DeepSeek客户端
const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-2521687cd38b4b958f38742347399297",
})

// 健康评估功能
export async function generateHealthAssessment(petName: string, petType: string): Promise<string> {
  const prompt = `作为专业宠物医生，为名叫${petName}的${petType}生成一份简要的健康评估指南。

请按以下格式输出：

# 🔍 ${petName}的健康评估指南

## 📊 日常健康检查要点

### 👀 外观检查
- 观察要点和正常标准

### 🍽️ 饮食评估  
- 食欲和饮水观察

### 🏃 行为评估
- 活动力和精神状态

### 🌡️ 基础体征
- 体温、呼吸、心率正常范围

## ⚠️ 异常信号识别

## 📅 定期检查建议

请保持内容简洁实用，适合宠物主人日常使用。`

  try {
    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 800,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("生成健康评估失败:", error)
    throw new Error("生成健康评估失败，请稍后再试")
  }
}

// 护理建议功能
export async function generateCareAdvice(petName: string, petType: string): Promise<string> {
  const prompt = `作为专业宠物医生，为名叫${petName}的${petType}生成详细的护理建议。

请按以下格式输出：

# 💝 ${petName}的专属护理方案

## 🏠 日常护理

### 🧼 清洁护理
- 洗澡频率和方法
- 毛发梳理技巧

### 🦷 口腔护理
- 刷牙方法和频率

### 💅 指甲护理
- 修剪技巧和注意事项

## 🍎 营养管理

### 🥘 饮食搭配
- 营养需求和食谱建议

### 💧 水分管理
- 饮水量和水质要求

## 🎾 运动锻炼

### 🏃 运动需求
- 运动量和运动方式

### 🎮 智力游戏
- 益智玩具和训练

## 🏥 预防保健

### 💉 疫苗计划
- 接种时间表

### 🐛 驱虫防护
- 内外驱虫建议

请提供具体实用的建议，帮助主人更好地照顾${petName}。`

  try {
    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 1000,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("生成护理建议失败:", error)
    throw new Error("生成护理建议失败，请稍后再试")
  }
}
