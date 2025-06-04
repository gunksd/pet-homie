"use server"

import { put, list, del } from "@vercel/blob"
import { nanoid } from "nanoid"

// 点赞记录结构
export interface Like {
  id: string
  userId: string
  targetId: string // 被点赞的对象ID（宠物ID或商品ID）
  targetType: "pet" | "product" | "article"
  createdAt: Date
}

// 获取用户的所有点赞 (别名函数，用于兼容)
export async function getLikes(userId: string): Promise<Like[]> {
  return getUserLikes(userId)
}

// 获取用户的所有点赞
export async function getUserLikes(userId: string): Promise<Like[]> {
  try {
    const { blobs } = await list({
      prefix: `likes/${userId}/`,
    })

    const likes: Like[] = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const likeData = await response.json()
        likes.push(likeData)
      } catch (error) {
        console.error("读取点赞数据失败:", error)
      }
    }

    return likes
  } catch (error) {
    console.error("获取点赞列表失败:", error)
    return []
  }
}

// 检查用户是否已点赞
export async function isLiked(userId: string, targetId: string): Promise<boolean> {
  try {
    const userLikes = await getUserLikes(userId)
    return userLikes.some((like) => like.targetId === targetId)
  } catch (error) {
    console.error("检查点赞状态失败:", error)
    return false
  }
}

// 切换点赞状态 (添加或取消点赞)
export async function toggleLike(
  userId: string,
  targetId: string,
  targetType: "pet" | "product" | "article",
): Promise<{ liked: boolean; likeCount: number }> {
  try {
    const alreadyLiked = await isLiked(userId, targetId)

    if (alreadyLiked) {
      // 取消点赞
      await removeLike(userId, targetId)
      const likeCount = await getLikeCount(targetId)
      return { liked: false, likeCount }
    } else {
      // 添加点赞
      await addLike(userId, targetId, targetType)
      const likeCount = await getLikeCount(targetId)
      return { liked: true, likeCount }
    }
  } catch (error) {
    console.error("切换点赞状态失败:", error)
    throw error
  }
}

// 添加点赞
export async function addLike(
  userId: string,
  targetId: string,
  targetType: "pet" | "product" | "article",
): Promise<Like> {
  try {
    // 检查是否已点赞
    const alreadyLiked = await isLiked(userId, targetId)
    if (alreadyLiked) {
      throw new Error("已经点赞过了")
    }

    const newLike: Like = {
      id: nanoid(),
      userId,
      targetId,
      targetType,
      createdAt: new Date(),
    }

    const filename = `likes/${userId}/${newLike.id}.json`
    await put(filename, JSON.stringify(newLike), {
      access: "public",
      contentType: "application/json",
    })

    return newLike
  } catch (error) {
    console.error("添加点赞失败:", error)
    throw error
  }
}

// 取消点赞
export async function removeLike(userId: string, targetId: string): Promise<void> {
  try {
    const userLikes = await getUserLikes(userId)
    const like = userLikes.find((like) => like.targetId === targetId)

    if (like) {
      const filename = `likes/${userId}/${like.id}.json`
      await del(filename)
    }
  } catch (error) {
    console.error("取消点赞失败:", error)
    throw error
  }
}

// 获取某个对象的点赞数
export async function getLikeCount(targetId: string): Promise<number> {
  try {
    const { blobs } = await list({
      prefix: "likes/",
    })

    let count = 0
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const likeData = await response.json()
        if (likeData.targetId === targetId) {
          count++
        }
      } catch (error) {
        console.error("读取点赞数据失败:", error)
      }
    }

    return count
  } catch (error) {
    console.error("获取点赞数失败:", error)
    return 0
  }
}
