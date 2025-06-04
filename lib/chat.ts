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
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    online: true,
  },
  {
    id: "user_bingyi",
    name: "李冰一",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c9b8d4?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: new Date("2025-06-04T10:47:00"),
  },
  {
    id: "vet_li",
    name: "王晓明兽医",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    online: true,
  },
  {
    id: "ai_assistant",
    name: "AI宠物助手",
    avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face",
    online: true,
  },
  {
    id: "pet_shop",
    name: "张小雅客服",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    online: true,
  },
]

// 简化消息数据，只保留最近的几条
const messages: Message[] = [
  // AI助手对话 - 最新
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

  // 与兽医王晓明的对话
  {
    id: "msg_vet_3",
    chatId: "chat_vet_li",
    senderId: "vet_li",
    content: "上午10点到11点之间都可以，记得带上疫苗本",
    timestamp: new Date("2025-06-04T15:40:00"),
    type: "text",
    read: false,
  },

  // 领养中心对话
  {
    id: "msg_9",
    chatId: "chat_adoption",
    senderId: "1",
    content: "好的，我明天下午有时间",
    timestamp: new Date("2025-06-04T14:25:00"),
    type: "text",
    read: true,
  },

  // 与医生的对话
  {
    id: "msg_2",
    chatId: "chat_1",
    senderId: "1",
    content: "下午2点可以吗？",
    timestamp: new Date("2025-06-04T11:05:00"),
    type: "text",
    read: true,
  },
]

// 简化聊天列表，只保留5条最近的聊天
const chats: Chat[] = [
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
]

// 获取用户的聊天列表
export async function getUserChats(userId: string): Promise<Chat[]> {
  // 返回所有聊天，让页面组件决定显示多少条
  return chats
}

// 根据ID获取联系人信息
export async function getContactById(contactId: string): Promise<Contact | null> {
  return contacts.find((contact) => contact.id === contactId) || null
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

// 初始化聊天数据
export async function initializeChatData(): Promise<void> {
  console.log("聊天数据已初始化（使用内存数据）")
}
