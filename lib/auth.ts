"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { put, list, del } from "@vercel/blob"
import { nanoid } from "nanoid"

// 用户数据结构
export interface User {
  id: string
  name: string
  email: string
  password: string // 在实际项目中应该加密存储
  avatar?: string
  phone?: string
  createdAt: Date
}

// 从Blob存储获取所有用户
async function getAllUsers(): Promise<User[]> {
  try {
    const { blobs } = await list({
      prefix: "users/",
    })

    const users: User[] = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const userData = await response.json()
        users.push(userData)
      } catch (error) {
        console.error("读取用户数据失败:", error)
      }
    }

    return users
  } catch (error) {
    console.error("获取用户列表失败:", error)
    return []
  }
}

// 根据邮箱获取用户
async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((user) => user.email === email) || null
}

// 根据ID获取用户
async function getUserById(id: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((user) => user.id === id) || null
}

// 保存用户到Blob存储
async function saveUser(user: User): Promise<void> {
  try {
    const filename = `users/${user.id}.json`
    await put(filename, JSON.stringify(user), {
      access: "public",
      contentType: "application/json",
    })
  } catch (error) {
    console.error("保存用户数据失败:", error)
    throw new Error("保存用户数据失败")
  }
}

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get("user_id")?.value

    if (!userId) return null

    return await getUserById(userId)
  } catch (error) {
    console.error("获取当前用户失败:", error)
    return null
  }
}

// 登录
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const user = await getUserByEmail(email)

    if (!user || user.password !== password) {
      throw new Error("邮箱或密码错误")
    }

    // 确保用户ID是 "1"，与聊天数据匹配
    const cookieStore = cookies()
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7天
    })

    return user
  } catch (error) {
    console.error("登录失败:", error)
    throw error
  }
}

// 注册
export async function signUp(name: string, email: string, password: string): Promise<User> {
  try {
    // 检查用户是否已存在
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      throw new Error("该邮箱已被注册")
    }

    // 创建新用户
    const newUser: User = {
      id: nanoid(),
      name,
      email,
      password, // 在实际项目中应该加密
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date(),
    }

    // 保存到Blob存储
    await saveUser(newUser)

    // 设置登录状态
    const cookieStore = cookies()
    cookieStore.set("user_id", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7天
    })

    return newUser
  } catch (error) {
    console.error("注册失败:", error)
    throw error
  }
}

// 登出
export async function signOut() {
  try {
    const cookieStore = cookies()
    cookieStore.delete("user_id")
    redirect("/auth/login")
  } catch (error) {
    console.error("登出失败:", error)
    redirect("/auth/login")
  }
}

// 检查认证状态
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

// 更新用户信息
export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  try {
    const user = await getUserById(userId)
    if (!user) {
      throw new Error("用户不存在")
    }

    const updatedUser = { ...user, ...updates }
    await saveUser(updatedUser)

    return updatedUser
  } catch (error) {
    console.error("更新用户信息失败:", error)
    throw error
  }
}

// 删除用户
export async function deleteUser(userId: string): Promise<void> {
  try {
    const filename = `users/${userId}.json`
    await del(filename)
  } catch (error) {
    console.error("删除用户失败:", error)
    throw error
  }
}

// 初始化默认用户（仅在开发环境）
export async function initializeDefaultUser(): Promise<void> {
  try {
    const existingUser = await getUserByEmail("pet@example.com")
    if (existingUser) return

    const defaultUser: User = {
      id: "1",
      name: "宠物爱好者",
      email: "pet@example.com",
      password: "123456",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c9b8d4?w=150&h=150&fit=crop&crop=face",
      phone: "13800138000",
      createdAt: new Date("2024-01-01"),
    }

    await saveUser(defaultUser)
    console.log("默认用户已创建")
  } catch (error) {
    console.error("初始化默认用户失败:", error)
  }
}
