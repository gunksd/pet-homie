"use server"

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

// 模拟数据库 - 添加更多联系人
const contacts: Contact[] = [
  {
    id: "doctor_chen",
    name: "陈医生",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    online: true,
  },
  {
    id: "user_bingyi",
    name: "冰一",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c9b8d4?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: new Date("2025-06-04T10:47:00"),
  },
  {
    id: "vet_li",
    name: "李兽医",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    online: true,
  },
  {
    id: "ai_assistant",
    name: "AI宠物助手",
    avatar: "https://images.unsplash.com/photo-1679958157996-3c1d7c1c0a88?w=150&h=150&fit=crop&crop=face",
    online: true,
  },
  {
    id: "pet_shop",
    name: "宠物商店客服",
    avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=face",
    online: true,
  },
  {
    id: "adoption_center",
    name: "领养中心",
    avatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: new Date("2025-06-04T14:20:00"),
  },
  {
    id: "groomer_wang",
    name: "美容师小王",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: new Date("2025-06-03T16:30:00"),
  },
  {
    id: "neighbor_zhang",
    name: "邻居张阿姨",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
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

  // 与冰一的对话
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
]

// 更新聊天列表
const chats: Chat[] = [
  {
    id: "chat_1",
    participants: ["1", "doctor_chen"],
    lastMessage: messages.find((m) => m.id === "msg_2"),
    unreadCount: 1,
    createdAt: new Date("2025-06-04T10:00:00"),
    updatedAt: new Date("2025-06-04T11:05:00"),
  },
  {
    id: "chat_shop",
    participants: ["1", "pet_shop"],
    lastMessage: messages.find((m) => m.id === "msg_7"),
    unreadCount: 1,
    createdAt: new Date("2025-06-04T16:00:00"),
    updatedAt: new Date("2025-06-04T16:22:00"),
  },
  {
    id: "chat_adoption",
    participants: ["1", "adoption_center"],
    lastMessage: messages.find((m) => m.id === "msg_9"),
    unreadCount: 1,
    createdAt: new Date("2025-06-04T14:00:00"),
    updatedAt: new Date("2025-06-04T14:25:00"),
  },
  {
    id: "chat_ai",
    participants: ["1", "ai_assistant"],
    lastMessage: messages.find((m) => m.id === "msg_6"),
    unreadCount: 0,
    createdAt: new Date("2025-06-04T18:00:00"),
    updatedAt: new Date("2025-06-04T19:38:30"),
  },
  {
    id: "chat_2",
    participants: ["1", "user_bingyi"],
    lastMessage: messages.find((m) => m.id === "msg_4"),
    unreadCount: 1,
    createdAt: new Date("2025-06-04T09:00:00"),
    updatedAt: new Date("2025-06-04T10:50:00"),
  },
  {
    id: "chat_groomer",
    participants: ["1", "groomer_wang"],
    lastMessage: messages.find((m) => m.id === "msg_10"),
    unreadCount: 0,
    createdAt: new Date("2025-06-03T16:00:00"),
    updatedAt: new Date("2025-06-03T16:30:00"),
  },
  {
    id: "chat_neighbor",
    participants: ["1", "neighbor_zhang"],
    lastMessage: messages.find((m) => m.id === "msg_12"),
    unreadCount: 0,
    createdAt: new Date("2025-06-04T09:00:00"),
    updatedAt: new Date("2025-06-04T09:20:00"),
  },
]

// 获取用户的聊天列表
export async function getUserChats(userId: string): Promise<Chat[]> {
  return chats.filter((chat) => chat.participants.includes(userId))
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
    id: `msg_${Date.now()}`,
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
