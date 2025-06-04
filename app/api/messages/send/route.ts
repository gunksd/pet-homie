import { NextResponse } from "next/server"
import { sendMessage } from "@/lib/chat"

export async function POST(request: Request) {
  try {
    const { chatId, senderId, content } = await request.json()

    if (!chatId || !senderId || !content) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const message = await sendMessage(chatId, senderId, content)
    return NextResponse.json(message)
  } catch (error) {
    console.error("发送消息失败:", error)
    return NextResponse.json({ error: "发送消息失败" }, { status: 500 })
  }
}
