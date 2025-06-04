import { NextResponse } from "next/server"
import { generateAIResponse } from "@/lib/ai-chat"

export async function POST(request: Request) {
  try {
    const { userMessage } = await request.json()

    if (!userMessage) {
      return NextResponse.json({ error: "用户消息不能为空" }, { status: 400 })
    }

    console.log("生成AI回复，用户消息:", userMessage)

    // 调用AI生成回复
    const response = await generateAIResponse(userMessage)

    console.log("AI回复生成成功:", response.slice(0, 50) + "...")

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI回复生成失败:", error)

    return NextResponse.json({ error: "生成AI回复失败", details: (error as Error).message }, { status: 500 })
  }
}
