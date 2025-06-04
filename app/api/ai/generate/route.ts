import { NextResponse } from "next/server"
import { generateAIResponse } from "@/lib/ai-chat"

export async function POST(request: Request) {
  try {
    const { userMessage } = await request.json()

    if (!userMessage) {
      return NextResponse.json({ error: "缺少用户消息" }, { status: 400 })
    }

    const response = await generateAIResponse(userMessage)
    return NextResponse.json({ response })
  } catch (error) {
    console.error("生成AI回复失败:", error)
    return NextResponse.json({ error: "生成AI回复失败" }, { status: 500 })
  }
}
