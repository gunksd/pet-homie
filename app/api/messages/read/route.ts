import { NextResponse } from "next/server"
import { markMessagesAsRead } from "@/lib/chat"

export async function POST(request: Request) {
  try {
    const { chatId, userId } = await request.json()

    if (!chatId || !userId) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    await markMessagesAsRead(chatId, userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("标记消息已读失败:", error)
    return NextResponse.json({ error: "标记消息已读失败" }, { status: 500 })
  }
}
