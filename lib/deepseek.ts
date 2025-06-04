// 使用OpenAI SDK调用DeepSeek API
interface GenerateTextOptions {
  prompt: string
  max_tokens?: number
  temperature?: number
  top_p?: number
}

interface GenerateTextResponse {
  text: string
}

export class DeepSeekAI {
  private apiKey: string
  private baseUrl = "https://api.deepseek.com"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateText(options: GenerateTextOptions): Promise<GenerateTextResponse> {
    const { prompt, max_tokens = 1000, temperature = 0.7 } = options

    console.log("DeepSeek API调用参数:", { max_tokens, temperature })

    try {
      // 使用类似OpenAI SDK的方式调用
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
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
          max_tokens,
          temperature,
        }),
      })

      console.log("DeepSeek API响应状态:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("DeepSeek API错误响应:", errorText)

        if (response.status === 401) {
          throw new Error("API密钥无效，请检查配置")
        } else if (response.status === 429) {
          throw new Error("API调用频率超限，请稍后再试")
        } else if (response.status >= 500) {
          throw new Error("AI服务暂时不可用，请稍后再试")
        } else {
          throw new Error(`API请求失败 (${response.status}): ${errorText}`)
        }
      }

      const data = await response.json()
      console.log("DeepSeek API成功响应:", data)

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("API返回格式异常")
      }

      return {
        text: data.choices[0].message.content,
      }
    } catch (error) {
      console.error("DeepSeek API调用失败:", error)

      if (error instanceof Error) {
        throw error
      } else {
        throw new Error("网络请求失败，请检查网络连接")
      }
    }
  }
}
