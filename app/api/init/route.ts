import { NextResponse } from "next/server"
import { initializeDefaultUser } from "@/lib/auth"

export async function GET() {
  try {
    await initializeDefaultUser()
    return NextResponse.json({ message: "初始化完成" })
  } catch (error) {
    console.error("初始化失败:", error)
    return NextResponse.json({ error: "初始化失败" }, { status: 500 })
  }
}
