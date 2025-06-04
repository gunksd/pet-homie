"use server"

import { put, list, del } from "@vercel/blob"
import { nanoid } from "nanoid"

// 购物车商品结构
export interface CartItem {
  id: string
  userId: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  quantity: number
  addedAt: Date
}

// 获取用户购物车 (别名函数，用于兼容)
export async function getCartItems(userId: string): Promise<CartItem[]> {
  return getUserCart(userId)
}

// 获取用户购物车
export async function getUserCart(userId: string): Promise<CartItem[]> {
  try {
    const { blobs } = await list({
      prefix: `cart/${userId}/`,
    })

    const cartItems: CartItem[] = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const itemData = await response.json()
        cartItems.push(itemData)
      } catch (error) {
        console.error("读取购物车数据失败:", error)
      }
    }

    return cartItems.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  } catch (error) {
    console.error("获取购物车失败:", error)
    return []
  }
}

// 添加商品到购物车
export async function addToCart(
  userId: string,
  productId: string,
  productName: string,
  productImage: string,
  productPrice: number,
  quantity = 1,
): Promise<CartItem> {
  try {
    // 检查是否已存在该商品
    const existingItems = await getUserCart(userId)
    const existingItem = existingItems.find((item) => item.productId === productId)

    if (existingItem) {
      // 更新数量
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
      }

      const filename = `cart/${userId}/${existingItem.id}.json`
      await put(filename, JSON.stringify(updatedItem), {
        access: "public",
        contentType: "application/json",
      })

      return updatedItem
    } else {
      // 添加新商品
      const newItem: CartItem = {
        id: nanoid(),
        userId,
        productId,
        productName,
        productImage,
        productPrice,
        quantity,
        addedAt: new Date(),
      }

      const filename = `cart/${userId}/${newItem.id}.json`
      await put(filename, JSON.stringify(newItem), {
        access: "public",
        contentType: "application/json",
      })

      return newItem
    }
  } catch (error) {
    console.error("添加到购物车失败:", error)
    throw error
  }
}

// 更新购物车商品数量
export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
  try {
    const { blobs } = await list({
      prefix: "cart/",
    })

    for (const blob of blobs) {
      if (blob.pathname.includes(itemId)) {
        const response = await fetch(blob.url)
        const itemData = await response.json()

        const updatedItem = {
          ...itemData,
          quantity,
        }

        await put(blob.pathname, JSON.stringify(updatedItem), {
          access: "public",
          contentType: "application/json",
        })
        break
      }
    }
  } catch (error) {
    console.error("更新购物车商品数量失败:", error)
    throw error
  }
}

// 从购物车删除商品
export async function removeFromCart(itemId: string): Promise<void> {
  try {
    const { blobs } = await list({
      prefix: "cart/",
    })

    for (const blob of blobs) {
      if (blob.pathname.includes(itemId)) {
        await del(blob.pathname)
        break
      }
    }
  } catch (error) {
    console.error("从购物车删除商品失败:", error)
    throw error
  }
}

// 清空用户购物车
export async function clearUserCart(userId: string): Promise<void> {
  try {
    const { blobs } = await list({
      prefix: `cart/${userId}/`,
    })

    for (const blob of blobs) {
      await del(blob.pathname)
    }
  } catch (error) {
    console.error("清空购物车失败:", error)
    throw error
  }
}
