"use server"

import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File

  if (!file) {
    throw new Error("没有找到文件")
  }

  // 验证文件类型
  if (!file.type.startsWith("image/")) {
    throw new Error("只能上传图片文件")
  }

  // 生成唯一文件名
  const filename = `${nanoid()}-${file.name}`

  try {
    // 上传到Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    return {
      url: blob.url,
      filename: blob.pathname,
    }
  } catch (error) {
    console.error("上传图片失败:", error)
    throw new Error("上传图片失败，请稍后再试")
  }
}
