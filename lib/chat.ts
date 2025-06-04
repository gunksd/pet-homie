"use server"

import { nanoid } from "nanoid"

// 聊天相关的类型定义
export interface Contact {
  id: string
  name: string
  avatar?: string
  online: boolean
  lastSeen?: Date
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: Date
  type: "text" | "image" | "file"
  read: boolean
}

export interface Chat {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// 硬编码联系人数据，使用真实的头像图片
const contacts: Contact[] = [
  {
    id: "doctor_chen",
    name: "陈志华医生",
    avatar: "/placeholder.svg?height=150&width=150",
    online: true,
  },
  {
    id: "user_bingyi",
    name: "李冰一",
    avatar: "/placeholder.svg?height=150&width=150",
    online: false,
    lastSeen: new Date("2025-06-04T10:47:00"),
  },
  {
    id: "vet_li",
    name: "王晓明兽医",
    avatar: "/placeholder.svg?height=150&width=150",
    online: true,
  },
  {
    id: "ai_assistant",
    name: "AI宠物助手",
    avatar: "/placeholder.svg?height=150&width=150",
    online: true,
  },
  {
    id: "pet_shop",
    name: "张小雅客服",
    avatar: "/placeholder.svg?height=150&width=150",
    online: true,
  },
  {
    id: "adoption_center",
    name: "刘美丽",
    avatar: "/placeholder.svg?height=150&width=150",
    online: false,
    lastSeen: new Date("2025-06-04T14:20:00"),
  },
  {
    id: "groomer_wang",
    name: "赵小王",
    avatar: "/placeholder.svg?height=150&width=150",
    online: false,
    lastSeen: new Date("2025-06-03T16:30:00"),
  },
  {
    id: "neighbor_zhang",
    name: "张阿姨",
    avatar: "/placeholder.svg?height=150&width=150",
    online: false,
    lastSeen: new Date("2025-06-04T09:15:00"),
  },
]

// 添加更多消息
const messages: Message[] = [
  // 与医生的对话
  {
    id: "msg_1",
    chatId: "chat_1",
    senderId: "doctor_chen",
    content: "您好，我现在有空，什么时候能带您家狗狗过来呢？",
    timestamp: new Date("2025-06-04T11:00:00"),
    type: "text",
    read: false,
  },
  {
    id: "msg_2",
    chatId: "chat_1",
    senderId: "1", // 当前用户
    content: "下午2点可以吗？",
    timestamp: new Date("2025-06-04T11:05:00"),
    type: "text",
    read: true,
  },

  // 与李冰一的对话
  {
    id: "msg_3",
    chatId: "chat_2",
    senderId: "user_bingyi",
    content: "猫猫的健康状态怎么样了呢",
    timestamp: new Date("2025-06-04T10:47:00"),
    type: "text",
    read: false,
  },
  {
    id: "msg_4",
    chatId: "chat_2",
    senderId: "1", // 当前用户
    content: "小橘最近状态很好，食欲也恢复了",
    timestamp: new Date("2025-06-04T10:50:00"),
    type: "text",
    read: true,
  },

  // AI助手对话
  {
    id: "msg_5",
    chatId: "chat_ai",
    senderId: "1", // 当前用户
    content: "您好，请问现在方便聊天吗？",
    timestamp: new Date("2025-06-04T19:38:00"),
    type: "text",
    read: true,
  },
  {
    id: "msg_6",
    chatId: "chat_ai",
    senderId: "ai_assistant",
    content: "您好！我是AI宠物助手，随时为您服务。请问有什么可以帮助您的吗？",
    timestamp: new Date("2025-06-04T19:38:30"),
    type: "text",
    read: true,
  },

  // 宠物商店对话
  {
    id: "msg_7",
    chatId: "chat_shop",
    senderId: "pet_shop",
    content: "您好！您昨天下单的宠物零食已经发货啦～运单号：SF1234567890",
    timestamp: new Date("2025-06-04T16:22:00"),
    type: "text",
    read: false,
  },

  // 领养中心对话
  {
    id: "msg_8",
    chatId: "chat_adoption",
    senderId: "adoption_center",
    content: "感谢您对小白的关注，请问您方便明天来看看它吗？",
    timestamp: new Date("2025-06-04T14:20:00"),
    type: "text",
    read: false,
  },
  {
    id: "msg_9",
    chatId: "chat_adoption",
    senderId: "1",
    content: "好的，我明天下午有时间",
    timestamp: new Date("2025-06-04T14:25:00"),
    type: "text",
    read: true,
  },

  // 美容师对话
  {
    id: "msg_10",
    chatId: "chat_groomer",
    senderId: "groomer_wang",
    content: "豆豆的美容已经完成啦，您可以来接它了～今天表现很好呢",
    timestamp: new Date("2025-06-03T16:30:00"),
    type: "text",
    read: true,
  },

  // 邻居对话
  {
    id: "msg_11",
    chatId: "chat_neighbor",
    senderId: "neighbor_zhang",
    content: "今天早上看到您家小橘在阳台上晒太阳，真可爱～",
    timestamp: new Date("2025-06-04T09:15:00"),
    type: "text",
    read: true,
  },
  {
    id: "msg_12",
    chatId: "chat_neighbor",
    senderId: "1",
    content: "哈哈，它最喜欢晒太阳了",
    timestamp: new Date("2025-06-04T09:20:00"),
    type: "text",
    read: true,
  },

  // AI助手更多对话
  {
    id: "msg_ai_1",
    chatId: "chat_ai",
    senderId: "1",
    content: "我家狗狗最近不爱吃东西，怎么办？",
    timestamp: new Date("2025-06-04T19:40:00"),
    type: "text",
    read: true,
  },
  {
    id: "msg_ai_2",
    chatId: "chat_ai",
    senderId: "ai_assistant",
    content:
      "狗狗食欲不振可能有几个原因：1️⃣ 检查食物是否新鲜；2️⃣ 观察是否有发热、呕吐等症状；3️⃣ 尝试少量多餐或更换食物。如果超过24小时不进食，建议及时就医检查。平时狗狗精神状态如何呢？",
    timestamp: new Date("2025-06-04T19:40:15"),
    type: "text",
    read: true,
  },
  {
    id: "msg_ai_3",
    chatId: "chat_ai",
    senderId: "1",
    content: "精神还可以，就是对平时爱吃的零食也不感兴趣",
    timestamp: new Date("2025-06-04T19:42:00"),
    type: "text",
    read: true,
  },
  {
    id: "msg_ai_4",
    chatId: "chat_ai",
    senderId: "ai_assistant",
    content:
      "这种情况建议：🔍 先测量体温（正常37.5-39°C）；🥄 可以尝试用温水泡软狗粮，或者加一点鸡汤调味；⏰ 如果明天还是不吃，就需要去医院检查了。有没有注意到狗狗的排便情况？",
    timestamp: new Date("2025-06-04T19:42:30"),
    type: "text",
    read: true,
  },

  // 与兽医王晓明的对话 - 修复chatId
  {
    id: "msg_vet_1",
    chatId: "chat_vet_li",
    senderId: "vet_li",
    content: "您好，关于豆豆的疫苗接种，建议下周二过来",
    timestamp: new Date("2025-06-04T15:30:00"),
    type: "text",
    read: false,
  },
  {
    id: "msg_vet_2",
    chatId: "chat_vet_li",
    senderId: "1",
    content: "好的，大概几点比较合适？",
    timestamp: new Date("2025-06-04T15:35:00"),
    type: "text",
    read: true,
  },
  {
    id: "msg_vet_3",
    chatId: "chat_vet_li",
    senderId: "vet_li",
    content: "上午10点到11点之间都可以，记得带上疫苗本",
    timestamp: new Date("2025-06-04T15:40:00"),
    type: "text",
    read: false,
  },
]

// 更新聊天列表 - 修复消息引用
const chats: Chat[] = [
  {
    id: "chat_1",
    participants: ["1", "doctor_chen"],
    lastMessage: {
      id: "msg_2",
      chatId: "chat_1",
      senderId: "1",
      content: "下午2点可以吗？",
      timestamp: new Date("2025-06-04T11:05:00"),
      type: "text",
      read: true,
    },
    unreadCount: 1,
    createdAt: new Date("2025-06-04T10:00:00"),
    updatedAt: new Date("2025-06-04T11:05:00"),
  },
  {
    id: "chat_shop",
    participants: ["1", "pet_shop"],
    lastMessage: {
      id: "msg_7",
      chatId: "chat_shop",
      senderId: "pet_shop",
      content: "您好！您昨天下单的宠物零食已经发货啦～运单号：SF1234567890",
      timestamp: new Date("2025-06-04T16:22:00"),
      type: "text",
      read: false,
    },
    unreadCount: 1,
    createdAt: new Date("2025-06-04T16:00:00"),
    updatedAt: new Date("2025-06-04T16:22:00"),
  },
  {
    id: "chat_vet_li",
    participants: ["1", "vet_li"],
    lastMessage: {
      id: "msg_vet_3",
      chatId: "chat_vet_li",
      senderId: "vet_li",
      content: "上午10点到11点之间都可以，记得带上疫苗本",
      timestamp: new Date("2025-06-04T15:40:00"),
      type: "text",
      read: false,
    },
    unreadCount: 2,
    createdAt: new Date("2025-06-04T15:00:00"),
    updatedAt: new Date("2025-06-04T15:40:00"),
  },
  {
    id: "chat_adoption",
    participants: ["1", "adoption_center"],
    lastMessage: {
      id: "msg_9",
      chatId: "chat_adoption",
      senderId: "1",
      content: "好的，我明天下午有时间",
      timestamp: new Date("2025-06-04T14:25:00"),
      type: "text",
      read: true,
    },
    unreadCount: 1,
    createdAt: new Date("2025-06-04T14:00:00"),
    updatedAt: new Date("2025-06-04T14:25:00"),
  },
  {
    id: "chat_ai",
    participants: ["1", "ai_assistant"],
    lastMessage: {
      id: "msg_ai_4",
      chatId: "chat_ai",
      senderId: "ai_assistant",
      content:
        "这种情况建议：🔍 先测量体温（正常37.5-39°C）；🥄 可以尝试用温水泡软狗粮，或者加一点鸡汤调味；⏰ 如果明天还是不吃，就需要去医院检查了。有没有注意到狗狗的排便情况？",
      timestamp: new Date("2025-06-04T19:42:30"),
      type: "text",
      read: true,
    },
    unreadCount: 0,
    createdAt: new Date("2025-06-04T18:00:00"),
    updatedAt: new Date("2025-06-04T19:42:30"),
  },
  {
    id: "chat_2",
    participants: ["1", "user_bingyi"],
    lastMessage: {
      id: "msg_4",
      chatId: "chat_2",
      senderId: "1",
      content: "小橘最近状态很好，食欲也恢复了",
      timestamp: new Date("2025-06-04T10:50:00"),
      type: "text",
      read: true,
    },
    unreadCount: 1,
    createdAt: new Date("2025-06-04T09:00:00"),
    updatedAt: new Date("2025-06-04T10:50:00"),
  },
  {
    id: "chat_groomer",
    participants: ["1", "groomer_wang"],
    lastMessage: {
      id: "msg_10",
      chatId: "chat_groomer",
      senderId: "groomer_wang",
      content: "豆豆的美容已经完成啦，您可以来接它了～今天表现很好呢",
      timestamp: new Date("2025-06-03T16:30:00"),
      type: "text",
      read: true,
    },
    unreadCount: 0,
    createdAt: new Date("2025-06-03T16:00:00"),
    updatedAt: new Date("2025-06-03T16:30:00"),
  },
  {
    id: "chat_neighbor",
    participants: ["1", "neighbor_zhang"],
    lastMessage: {
      id: "msg_12",
      chatId: "chat_neighbor",
      senderId: "1",
      content: "哈哈，它最喜欢晒太阳了",
      timestamp: new Date("2025-06-04T09:20:00"),
      type: "text",
      read: true,
    },
    unreadCount: 0,
    createdAt: new Date("2025-06-04T09:00:00"),
    updatedAt: new Date("2025-06-04T09:20:00"),
  },
]

// 获取用户的聊天列表
export async function getUserChats(userId: string): Promise<Chat[]> {
  console.log("=== getUserChats 调试信息 ===")
  console.log("查询用户聊天列表，用户ID:", userId)
  console.log("所有聊天数据:", chats)

  // 强制返回所有聊天用于调试
  console.log("返回所有聊天进行调试")
  return chats
}

// 根据ID获取联系人信息
export async function getContactById(contactId: string): Promise<Contact | null> {
  console.log("=== getContactById 调试信息 ===")
  console.log("查找联系人ID:", contactId)
  console.log("所有联系人数据:", contacts)

  const contact = contacts.find((contact) => contact.id === contactId) || null
  console.log("找到的联系人:", contact)

  return contact
}

// 根据ID获取聊天信息
export async function getChatById(chatId: string): Promise<Chat | null> {
  return chats.find((chat) => chat.id === chatId) || null
}

// 获取聊天消息
export async function getChatMessages(chatId: string): Promise<Message[]> {
  return messages
    .filter((message) => message.chatId === chatId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// 发送消息
export async function sendMessage(chatId: string, senderId: string, content: string): Promise<Message> {
  const newMessage: Message = {
    id: `msg_${nanoid()}`,
    chatId,
    senderId,
    content,
    timestamp: new Date(),
    type: "text",
    read: false,
  }

  messages.push(newMessage)

  // 更新聊天的最后消息
  const chat = chats.find((c) => c.id === chatId)
  if (chat) {
    chat.lastMessage = newMessage
    chat.updatedAt = new Date()

    // 如果发送者不是当前用户，增加未读计数
    if (senderId !== "1") {
      chat.unreadCount += 1
    }
  }

  return newMessage
}

// 标记消息为已读
export async function markMessagesAsRead(chatId: string, userId: string): Promise<void> {
  messages
    .filter((message) => message.chatId === chatId && message.senderId !== userId)
    .forEach((message) => {
      message.read = true
    })

  // 重置未读计数
  const chat = chats.find((c) => c.id === chatId)
  if (chat) {
    chat.unreadCount = 0
  }
}

// 初始化聊天数据（添加缺失的导出）
export async function initializeChatData(): Promise<void> {
  // 这个函数现在使用内存数据，所以不需要实际的初始化逻辑
  // 但保留导出以满足其他模块的依赖
  console.log("聊天数据已初始化（使用内存数据）")
}
