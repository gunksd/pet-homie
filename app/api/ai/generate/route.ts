import { NextResponse } from "next/server"
import { generateAIResponse } from "@/lib/ai-chat"

export async function POST(request: Request) {
  try {
    const { userMessage } = await request.json()

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json({ error: "用户消息不能为空" }, { status: 400 })
    }

    console.log("收到AI生成请求，用户消息:", userMessage)

    // 调用AI生成回复
    const response = await generateAIResponse(userMessage)

    console.log("AI回复生成成功")

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI回复生成失败:", error)

    // 返回更详细的错误信息
    return NextResponse.json(
      {
        error: "生成AI回复失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
