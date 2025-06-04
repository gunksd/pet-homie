// 使用fetch API来模拟put操作，因为在脚本环境中无法直接使用@vercel/blob
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

// 示例领养宠物数据
const adoptionPets = [
  {
    id: "adoption-1",
    name: "小白",
    type: "dog",
    breed: "金毛",
    age: "2岁",
    gender: "male",
    location: "北京市朝阳区",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    description: "性格温顺，喜欢和小朋友玩耍，已经完成基础训练，会坐下、握手等基本指令。非常适合有小孩的家庭。",
    vaccinated: true,
    sterilized: true,
    contactInfo: {
      phone: "138****1234",
      wechat: "pet_lover_123",
      email: "contact@example.com",
    },
    requirements: ["有稳定的居住环境", "有养宠经验或愿意学习", "能够提供充足的运动时间", "定期带宠物体检"],
    adoptionFee: 0,
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2025-06-01T00:00:00.000Z",
    status: "available",
    publisherId: "publisher-1",
    publisherName: "爱心救助站",
  },
  {
    id: "adoption-2",
    name: "小花",
    type: "cat",
    breed: "英短",
    age: "1岁",
    gender: "female",
    location: "上海市浦东新区",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop",
    description: "安静乖巧，适合公寓饲养。喜欢晒太阳和玩逗猫棒，对人很亲近，会主动寻求抚摸。",
    vaccinated: true,
    sterilized: false,
    contactInfo: {
      phone: "139****5678",
      wechat: "cat_rescue_sh",
    },
    requirements: ["室内饲养", "定期清理猫砂", "提供营养均衡的猫粮"],
    adoptionFee: 200,
    createdAt: "2025-06-02T00:00:00.000Z",
    updatedAt: "2025-06-02T00:00:00.000Z",
    status: "available",
    publisherId: "publisher-2",
    publisherName: "上海猫咪救助",
  },
  {
    id: "adoption-3",
    name: "豆豆",
    type: "dog",
    breed: "柴犬",
    age: "3岁",
    gender: "male",
    location: "广州市天河区",
    image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop",
    description: "活泼好动，需要经常运动。对主人非常忠诚，警觉性高，是很好的看家犬。",
    vaccinated: true,
    sterilized: true,
    contactInfo: {
      phone: "137****9012",
      email: "guangzhou.rescue@example.com",
    },
    requirements: ["有院子或经常外出运动", "有养大型犬经验", "能够承担较高的食物费用"],
    adoptionFee: 500,
    createdAt: "2025-06-03T00:00:00.000Z",
    updatedAt: "2025-06-03T00:00:00.000Z",
    status: "available",
    publisherId: "publisher-3",
    publisherName: "广州宠物救助中心",
  },
  {
    id: "adoption-4",
    name: "咪咪",
    type: "cat",
    breed: "橘猫",
    age: "6个月",
    gender: "female",
    location: "深圳市南山区",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
    description: "年幼可爱，正在寻找温暖的家。非常活泼好奇，喜欢探索新环境，需要耐心的主人。",
    vaccinated: false,
    sterilized: false,
    contactInfo: {
      phone: "136****3456",
      wechat: "sz_pet_rescue",
    },
    requirements: ["愿意承担疫苗和绝育费用", "有耐心照顾幼猫", "定期体检"],
    adoptionFee: 0,
    createdAt: "2025-06-04T00:00:00.000Z",
    updatedAt: "2025-06-04T00:00:00.000Z",
    status: "available",
    publisherId: "publisher-4",
    publisherName: "深圳流浪动物救助",
  },
]

// 使用Vercel Blob API保存数据
async function putToBlob(filename, data) {
  const response = await fetch(`https://blob.vercel-storage.com/${filename}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${BLOB_READ_WRITE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 保存领养宠物数据
async function initAdoptionData() {
  console.log("开始初始化领养数据...")
  console.log("BLOB_READ_WRITE_TOKEN:", BLOB_READ_WRITE_TOKEN ? "已设置" : "未设置")

  if (!BLOB_READ_WRITE_TOKEN) {
    console.error("错误: BLOB_READ_WRITE_TOKEN 环境变量未设置")
    return
  }

  for (const pet of adoptionPets) {
    try {
      const filename = `adoption/pets/${pet.id}.json`
      await putToBlob(filename, pet)
      console.log(`✅ 已保存宠物: ${pet.name} (${pet.id})`)
    } catch (error) {
      console.error(`❌ 保存宠物 ${pet.name} 失败:`, error.message)
    }
  }

  // 保存宠物列表索引
  try {
    const petsList = adoptionPets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      location: pet.location,
      image: pet.image,
      status: pet.status,
    }))

    await putToBlob("adoption/pets-list.json", petsList)
    console.log("✅ 已保存宠物列表索引")
  } catch (error) {
    console.error("❌ 保存宠物列表索引失败:", error.message)
  }

  console.log("🎉 领养数据初始化完成！")
}

// 执行初始化
initAdoptionData().catch(console.error)
