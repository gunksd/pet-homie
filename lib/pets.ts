"use server"

import { put, list, del } from "@vercel/blob"
import { nanoid } from "nanoid"

// 宠物数据结构
export interface Pet {
  id: string
  userId: string
  name: string
  type: "dog" | "cat" | "other"
  breed: string
  age: string
  weight: string
  gender: "male" | "female"
  avatar?: string
  description?: string
  medicalHistory?: string[]
  vaccinations?: Vaccination[]
  createdAt: Date
  updatedAt: Date
}

export interface Vaccination {
  id: string
  name: string
  date: Date
  nextDue?: Date
  veterinarian?: string
}

// 从Blob存储获取用户的所有宠物
export async function getUserPets(userId: string): Promise<Pet[]> {
  try {
    const { blobs } = await list({
      prefix: `pets/${userId}/`,
    })

    const pets: Pet[] = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const petData = await response.json()
        pets.push(petData)
      } catch (error) {
        console.error("读取宠物数据失败:", error)
      }
    }

    return pets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("获取宠物列表失败:", error)
    return []
  }
}

// 根据ID获取宠物
export async function getPetById(petId: string): Promise<Pet | null> {
  try {
    const { blobs } = await list({
      prefix: "pets/",
    })

    for (const blob of blobs) {
      if (blob.pathname.includes(petId)) {
        const response = await fetch(blob.url)
        const petData = await response.json()
        return petData
      }
    }

    return null
  } catch (error) {
    console.error("获取宠物信息失败:", error)
    return null
  }
}

// 保存宠物到Blob存储
async function savePet(pet: Pet): Promise<void> {
  try {
    const filename = `pets/${pet.userId}/${pet.id}.json`
    await put(filename, JSON.stringify(pet), {
      access: "public",
      contentType: "application/json",
    })
  } catch (error) {
    console.error("保存宠物数据失败:", error)
    throw new Error("保存宠物数据失败")
  }
}

// 添加新宠物
export async function addPet(
  userId: string,
  petData: Omit<Pet, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Pet> {
  try {
    const newPet: Pet = {
      id: nanoid(),
      userId,
      ...petData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await savePet(newPet)
    return newPet
  } catch (error) {
    console.error("添加宠物失败:", error)
    throw error
  }
}

// 更新宠物信息
export async function updatePet(petId: string, updates: Partial<Pet>): Promise<Pet> {
  try {
    const pet = await getPetById(petId)
    if (!pet) {
      throw new Error("宠物不存在")
    }

    const updatedPet = {
      ...pet,
      ...updates,
      updatedAt: new Date(),
    }

    await savePet(updatedPet)
    return updatedPet
  } catch (error) {
    console.error("更新宠物信息失败:", error)
    throw error
  }
}

// 删除宠物
export async function deletePet(petId: string): Promise<void> {
  try {
    const pet = await getPetById(petId)
    if (!pet) {
      throw new Error("宠物不存在")
    }

    const filename = `pets/${pet.userId}/${petId}.json`
    await del(filename)
  } catch (error) {
    console.error("删除宠物失败:", error)
    throw error
  }
}
