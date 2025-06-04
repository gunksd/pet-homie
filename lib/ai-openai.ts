"use server"

// 宠物类型映射
const petTypeMap = {
  dog: "狗",
  cat: "猫",
  other: "其他宠物",
}

// 宠物报告生成接口
export interface PetReportParams {
  name: string
  type: string
  age: string
  symptoms: string
}

// 使用原生方式调用DeepSeek API（按照官方文档）
export async function generatePetReportWithOpenAI(params: PetReportParams): Promise<string> {
  const { name, type, age, symptoms } = params
  const petType = petTypeMap[type as keyof typeof petTypeMap] || type

  console.log("AI生成参数:", { name, petType, age, symptoms })

  const prompt = `请你作为一名专业的宠物医生，根据以下信息生成一份详细的宠物健康报告：

宠物名称：${name}
宠物类型：${petType}
宠物年龄：${age}
症状描述：${symptoms}

请在报告中包含以下内容：
1. 可能的健康问题分析
2. 建议的检查项目
3. 初步护理建议
4. 是否需要立即就医的评估
5. 日常护理建议

请用专业但通俗易懂的语言撰写，避免使用过于专业的术语，以便宠物主人能够理解。
报告格式要清晰，分段呈现。`

  try {
    console.log("开始调用DeepSeek API...")

    // 按照官方文档的方式调用
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer sk-2521687cd38b4b958f38742347399297`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a professional veterinarian assistant. Please respond in Chinese.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    console.log("DeepSeek API响应状态:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DeepSeek API错误响应:", errorText)
      throw new Error(`API请求失败 (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log("DeepSeek API成功响应:", data)

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("API返回格式异常")
    }

    const text = data.choices[0].message.content

    if (!text) {
      throw new Error("AI返回的内容为空")
    }

    return text
  } catch (error) {
    console.error("AI生成报告失败:", error)

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        throw new Error("API密钥无效，请检查配置")
      } else if (error.message.includes("429")) {
        throw new Error("API调用频率超限，请稍后再试")
      } else if (error.message.includes("500")) {
        throw new Error("AI服务暂时不可用，请稍后再试")
      } else {
        throw new Error(`生成报告失败: ${error.message}`)
      }
    }

    throw new Error("生成报告失败，请稍后再试")
  }
}
