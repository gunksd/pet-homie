"use server"

import { put, list } from "@vercel/blob"
import { nanoid } from "nanoid"

// 领养宠物数据结构
export interface AdoptionPet {
  id: string
  name: string
  type: "dog" | "cat" | "other"
  breed: string
  age: string
  gender: "male" | "female"
  location: string
  image: string
  description: string
  vaccinated: boolean
  sterilized: boolean
  contactInfo: {
    phone: string
    wechat?: string
    email?: string
  }
  requirements?: string[]
  adoptionFee?: number
  createdAt: Date
  updatedAt: Date
  status: "available" | "pending" | "adopted"
  publisherId: string
  publisherName: string
}

// 领养申请数据结构
export interface AdoptionApplication {
  id: string
  petId: string
  applicantId: string
  applicantName: string
  applicantPhone: string
  applicantEmail?: string
  reason: string
  experience: string
  livingCondition: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}

// 获取所有可领养宠物
export async function getAdoptionPets(): Promise<AdoptionPet[]> {
  try {
    const { blobs } = await list({
      prefix: "adoption/pets/",
    })

    const pets: AdoptionPet[] = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const petData = await response.json()
        pets.push(petData)
      } catch (error) {
        console.error("读取领养宠物数据失败:", error)
      }
    }

    return pets
      .filter((pet) => pet.status === "available")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("获取领养宠物列表失败:", error)
    return []
  }
}

// 根据ID获取领养宠物
export async function getAdoptionPetById(petId: string): Promise<AdoptionPet | null> {
  try {
    const { blobs } = await list({
      prefix: "adoption/pets/",
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
    console.error("获取领养宠物信息失败:", error)
    return null
  }
}

// 搜索和筛选宠物
export async function searchAdoptionPets(filters: {
  query?: string
  type?: string
  location?: string
  vaccinated?: boolean
  sterilized?: boolean
}): Promise<AdoptionPet[]> {
  try {
    const allPets = await getAdoptionPets()

    return allPets.filter((pet) => {
      // 搜索关键词
      if (filters.query) {
        const query = filters.query.toLowerCase()
        const searchText = `${pet.name} ${pet.breed} ${pet.description} ${pet.location}`.toLowerCase()
        if (!searchText.includes(query)) return false
      }

      // 宠物类型
      if (filters.type && filters.type !== "all" && pet.type !== filters.type) {
        return false
      }

      // 地区
      if (filters.location && !pet.location.includes(filters.location)) {
        return false
      }

      // 疫苗状态
      if (filters.vaccinated !== undefined && pet.vaccinated !== filters.vaccinated) {
        return false
      }

      // 绝育状态
      if (filters.sterilized !== undefined && pet.sterilized !== filters.sterilized) {
        return false
      }

      return true
    })
  } catch (error) {
    console.error("搜索领养宠物失败:", error)
    return []
  }
}

// 提交领养申请
export async function submitAdoptionApplication(
  applicationData: Omit<AdoptionApplication, "id" | "createdAt" | "updatedAt" | "status">,
): Promise<AdoptionApplication> {
  try {
    const newApplication: AdoptionApplication = {
      id: nanoid(),
      ...applicationData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const filename = `adoption/applications/${newApplication.id}.json`
    await put(filename, JSON.stringify(newApplication), {
      access: "public",
      contentType: "application/json",
    })

    return newApplication
  } catch (error) {
    console.error("提交领养申请失败:", error)
    throw error
  }
}

// 获取用户的领养申请
export async function getUserAdoptionApplications(userId: string): Promise<AdoptionApplication[]> {
  try {
    const { blobs } = await list({
      prefix: "adoption/applications/",
    })

    const applications: AdoptionApplication[] = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const applicationData = await response.json()
        if (applicationData.applicantId === userId) {
          applications.push(applicationData)
        }
      } catch (error) {
        console.error("读取领养申请数据失败:", error)
      }
    }

    return applications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("获取领养申请列表失败:", error)
    return []
  }
}
