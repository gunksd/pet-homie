import { NextResponse } from "next/server"
import { initializeChatData } from "@/lib/chat"

export async function GET() {
  try {
    await initializeChatData()
    return NextResponse.json({ message: "聊天数据初始化完成" })
  } catch (error) {
    console.error("初始化聊天数据失败:", error)
    return NextResponse.json({ error: "初始化聊天数据失败" }, { status: 500 })
  }
}
