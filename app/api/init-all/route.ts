import { NextResponse } from "next/server"
import { initializeDefaultUser } from "@/lib/auth"
import { initializeChatData } from "@/lib/chat"

export async function GET() {
  try {
    // 初始化默认用户
    await initializeDefaultUser()

    // 初始化聊天数据
    await initializeChatData()

    return NextResponse.json({ message: "所有数据初始化完成" })
  } catch (error) {
    console.error("初始化失败:", error)
    return NextResponse.json({ error: "初始化失败" }, { status: 500 })
  }
}
