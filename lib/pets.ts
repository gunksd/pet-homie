"use server"

// 宠物数据类型
export interface Pet {
  id: string
  name: string
  type: string
  breed: string
  age: string
  gender: string
  location: string
  image: string
  description: string
  vaccinated: boolean
  sterilized: boolean
  weight?: string
  traits?: string[]
  shelterAddress?: string
  shelterName?: string
  shelterPhone?: string
  createdAt: Date
}

// 模拟宠物数据库
const pets: Pet[] = [
  {
    id: "1",
    name: "小白",
    type: "狗",
    breed: "金毛",
    age: "2岁",
    gender: "公",
    location: "北京市朝阳区",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    description:
      "小白是一只非常友善的金毛，性格温顺，喜欢和小朋友玩耍。它被前主人因为搬家无法继续饲养而送到收容所。小白已经接受过基础训练，会坐下、握手等简单指令。它喜欢户外活动，也很享受在家里与人亲近的时光。",
    vaccinated: true,
    sterilized: true,
    weight: "25kg",
    traits: ["友善", "活泼", "亲人", "已训练", "适合家庭"],
    shelterAddress: "北京市朝阳区建国路88号宠物乐园",
    shelterName: "朝阳区宠物收容中心",
    shelterPhone: "010-12345678",
    createdAt: new Date("2025-05-15"),
  },
  {
    id: "2",
    name: "小花",
    type: "猫",
    breed: "英短",
    age: "1岁",
    gender: "母",
    location: "上海市浦东新区",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop",
    description:
      "小花是一只安静乖巧的英短猫，毛色为银灰色，眼睛圆圆的很有神。它性格独立但不怕生，喜欢在安静的环境中休息，也会主动寻求人类的抚摸。小花已经做过绝育手术，接种了全部疫苗，适合公寓饲养。",
    vaccinated: true,
    sterilized: false,
    weight: "3.5kg",
    traits: ["安静", "独立", "不怕生", "适合公寓"],
    shelterAddress: "上海市浦东新区张杨路500号",
    shelterName: "浦东新区动物救助站",
    shelterPhone: "021-87654321",
    createdAt: new Date("2025-05-20"),
  },
  {
    id: "3",
    name: "豆豆",
    type: "狗",
    breed: "柴犬",
    age: "3岁",
    gender: "公",
    location: "广州市天河区",
    image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop",
    description:
      "豆豆是一只活泼好动的柴犬，有着典型的柴犬微笑脸。它非常聪明，学习能力强，但有时会有些固执。豆豆喜欢户外活动，需要定期运动来消耗精力。它与其他狗狗相处融洽，但对陌生人有些警惕。",
    vaccinated: true,
    sterilized: true,
    weight: "12kg",
    traits: ["活泼", "聪明", "警惕", "需要运动"],
    shelterAddress: "广州市天河区天河路200号",
    shelterName: "广州市流浪动物救助中心",
    shelterPhone: "020-98765432",
    createdAt: new Date("2025-05-25"),
  },
  {
    id: "4",
    name: "咪咪",
    type: "猫",
    breed: "橘猫",
    age: "6个月",
    gender: "母",
    location: "深圳市南山区",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
    description:
      "咪咪是一只年幼可爱的橘猫，性格活泼好奇，对周围的一切都充满探索欲。它非常亲人，喜欢被抱着和抚摸。咪咪还在成长阶段，需要均衡的营养和适当的玩耍时间。它已接种了第一轮疫苗，正在寻找温暖的家。",
    vaccinated: false,
    sterilized: false,
    weight: "2kg",
    traits: ["活泼", "好奇", "亲人", "年幼"],
    shelterAddress: "深圳市南山区科技园路10号",
    shelterName: "深圳市小动物保护协会",
    shelterPhone: "0755-56781234",
    createdAt: new Date("2025-06-01"),
  },
  {
    id: "5",
    name: "黑豆",
    type: "狗",
    breed: "拉布拉多",
    age: "4岁",
    gender: "公",
    location: "北京市海淀区",
    image: "https://images.unsplash.com/photo-1579557354493-4a0a7ff7ec4b?w=400&h=400&fit=crop",
    description:
      "黑豆是一只成年拉布拉多，毛色为纯黑色，体型健壮。它曾经是一只导盲犬训练生，但因为性格过于活泼而未能通过考核。黑豆非常聪明，掌握了多种指令，对人友善，适合有经验的主人。",
    vaccinated: true,
    sterilized: true,
    weight: "30kg",
    traits: ["聪明", "活泼", "友善", "需要运动", "已训练"],
    shelterAddress: "北京市海淀区中关村南大街5号",
    shelterName: "海淀区动物救助中心",
    shelterPhone: "010-87654321",
    createdAt: new Date("2025-05-10"),
  },
  {
    id: "6",
    name: "雪球",
    type: "猫",
    breed: "布偶猫",
    age: "2岁",
    gender: "母",
    location: "上海市静安区",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop",
    description:
      "雪球是一只美丽的布偶猫，有着蓝色的眼睛和柔软的长毛。它性格温顺，喜欢跟随主人，有着'小狗性格'的特点。雪球适应能力强，可以与其他宠物和谐相处，但需要定期梳理毛发。",
    vaccinated: true,
    sterilized: true,
    weight: "4kg",
    traits: ["温顺", "亲人", "适应力强", "需要梳理"],
    shelterAddress: "上海市静安区南京西路100号",
    shelterName: "静安区爱心动物之家",
    shelterPhone: "021-12345678",
    createdAt: new Date("2025-05-18"),
  },
  {
    id: "7",
    name: "可可",
    type: "狗",
    breed: "泰迪",
    age: "1岁",
    gender: "母",
    location: "广州市越秀区",
    image: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=400&h=400&fit=crop",
    description:
      "可可是一只小型泰迪犬，毛色为棕色，被毛卷曲蓬松。它性格活泼好动，喜欢与人互动和玩耍。可可已经学会了基本的如厕训练，但仍需要进一步的训练和社交化。它不掉毛，适合对宠物毛发过敏的家庭。",
    vaccinated: true,
    sterilized: false,
    weight: "3kg",
    traits: ["活泼", "亲人", "不掉毛", "需要训练"],
    shelterAddress: "广州市越秀区解放北路50号",
    shelterName: "广州市小动物保护协会",
    shelterPhone: "020-87651234",
    createdAt: new Date("2025-05-28"),
  },
  {
    id: "8",
    name: "灰灰",
    type: "猫",
    breed: "美短",
    age: "3岁",
    gender: "公",
    location: "深圳市福田区",
    image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&h=400&fit=crop",
    description:
      "灰灰是一只成年美短猫，毛色为灰色虎斑。它性格独立，但也喜欢在主人身边休息。灰灰已经完全适应了室内生活，会使用猫砂盆和猫抓板。它喜欢安静的环境，适合单身人士或安静的家庭。",
    vaccinated: true,
    sterilized: true,
    weight: "5kg",
    traits: ["独立", "安静", "适应室内", "易于照顾"],
    shelterAddress: "深圳市福田区福华路100号",
    shelterName: "深圳市爱心动物救助中心",
    shelterPhone: "0755-12345678",
    createdAt: new Date("2025-05-05"),
  },
]

// 获取所有宠物
export async function getAllPets(): Promise<Pet[]> {
  return pets
}

// 根据ID获取宠物
export async function getPetById(id: string): Promise<Pet | null> {
  return pets.find((pet) => pet.id === id) || null
}

// 根据类型筛选宠物
export async function getPetsByType(type: string): Promise<Pet[]> {
  if (type === "all") return pets
  return pets.filter((pet) => pet.type === type)
}

// 搜索宠物
export async function searchPets(query: string): Promise<Pet[]> {
  const lowercaseQuery = query.toLowerCase()
  return pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(lowercaseQuery) ||
      pet.breed.toLowerCase().includes(lowercaseQuery) ||
      pet.location.toLowerCase().includes(lowercaseQuery) ||
      pet.description.toLowerCase().includes(lowercaseQuery),
  )
}
