// 确保AI助手的ID正确
export interface Contact {
  id: string
  name: string
  avatar: string
  online?: boolean
  lastSeen?: Date
  role?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
}

export interface Chat {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
}

// 模拟数据库
const users: User[] = [
  {
    id: "1",
    name: "张小明",
    email: "pet@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
]

const contacts: Contact[] = [
  {
    id: "ai_assistant", // AI助手的联系人ID
    name: "AI宠物助手",
    avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face",
    online: true,
    role: "assistant",
  },
  {
    id: "vet_li",
    name: "王晓明兽医",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: new Date(),
    role: "veterinarian",
  },
  // 其他联系人...
]

const chats: Chat[] = [
  {
    id: "chat_ai", // AI助手的聊天ID
    participants: ["1", "ai_assistant"], // 用户ID和AI助手ID
    unreadCount: 0,
  },
  {
    id: "chat_vet_li",
    participants: ["1", "vet_li"],
    unreadCount: 2,
  },
  // 其他聊天...
]

// 聊天消息
const messages: Message[] = [
  // AI助手的聊天消息
  {
    id: "msg_ai_1",
    chatId: "chat_ai",
    senderId: "ai_assistant",
    content: "您好！我是AI宠物助手，很高兴为您服务。请问有什么可以帮助您的吗？",
    timestamp: new Date(Date.now() - 86400000), // 1天前
    read: true,
  },
  {
    id: "msg_ai_2",
    chatId: "chat_ai",
    senderId: "1",
    content: "我家狗狗最近不太爱吃东西，应该怎么办？",
    timestamp: new Date(Date.now() - 3600000), // 1小时前
    read: true,
  },
  {
    id: "msg_ai_3",
    chatId: "chat_ai",
    senderId: "ai_assistant",
    content:
      "狗狗不爱吃东西可能有多种原因。首先，请检查它是否有其他异常症状，如精神不振、呕吐或腹泻。如果没有这些症状，可以尝试：1. 更换不同口味的狗粮；2. 确保食物新鲜且温度适宜；3. 规律喂食，避免零食过多。如果情况持续超过24小时，建议咨询兽医。",
    timestamp: new Date(Date.now() - 3500000), // 58分钟前
    read: true,
  },

  // 兽医的聊天消息
  {
    id: "msg_vet_1",
    chatId: "chat_vet_li",
    senderId: "1",
    content: "王医生，我想给我家的猫咪预约下周的疫苗接种，请问什么时间方便？",
    timestamp: new Date(Date.now() - 7200000), // 2小时前
    read: true,
  },
  {
    id: "msg_vet_2",
    chatId: "chat_vet_li",
    senderId: "vet_li",
    content: "您好，下周一到周五上午9点到12点，下午2点到5点都可以。您有什么时间偏好吗？",
    timestamp: new Date(Date.now() - 5400000), // 1.5小时前
    read: false,
  },
  {
    id: "msg_vet_3",
    chatId: "chat_vet_li",
    senderId: "1",
    content: "下周二上午可以吗？",
    timestamp: new Date(Date.now() - 3600000), // 1小时前
    read: true,
  },
  {
    id: "msg_vet_4",
    chatId: "chat_vet_li",
    senderId: "vet_li",
    content: "下周二上午10点怎么样？记得带上疫苗本哦",
    timestamp: new Date(Date.now() - 1800000), // 30分钟前
    read: false,
  },
]

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
  // 在实际应用中，这里会从cookie或session中获取用户ID
  // 这里简化为直接返回第一个用户
  return users[0] || null
}

// 获取用户的所有聊天
export async function getUserChats(userId: string): Promise<Chat[]> {
  return chats
    .filter((chat) => chat.participants.includes(userId))
    .map((chat) => {
      // 找到最后一条消息
      const chatMessages = messages.filter((msg) => msg.chatId === chat.id)
      const lastMessage = chatMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]

      // 计算未读消息数
      const unreadCount = chatMessages.filter((msg) => !msg.read && msg.senderId !== userId).length

      return {
        ...chat,
        lastMessage,
        unreadCount,
      }
    })
}

// 获取聊天详情
export async function getChatById(chatId: string): Promise<Chat | null> {
  const chat = chats.find((c) => c.id === chatId)
  if (!chat) return null

  // 找到最后一条消息
  const chatMessages = messages.filter((msg) => msg.chatId === chatId)
  const lastMessage = chatMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]

  return {
    ...chat,
    lastMessage,
    unreadCount: chatMessages.filter((msg) => !msg.read).length,
  }
}

// 确保消息的 timestamp 是有效的 Date 对象
export async function getChatMessages(chatId: string): Promise<Message[]> {
  return messages
    .filter((msg) => msg.chatId === chatId)
    .map((msg) => ({
      ...msg,
      // 确保 timestamp 是 Date 对象
      timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// 获取联系人详情
export async function getContactById(contactId: string): Promise<Contact | null> {
  return contacts.find((c) => c.id === contactId) || null
}

// 标记消息为已读
export async function markMessagesAsRead(chatId: string, userId: string): Promise<void> {
  // 在实际应用中，这里会更新数据库
  // 这里简化为直接修改内存中的数据
  messages.forEach((msg) => {
    if (msg.chatId === chatId && msg.senderId !== userId && !msg.read) {
      msg.read = true
    }
  })
}

// 同样确保发送消息时 timestamp 是 Date 对象
export async function sendMessage(chatId: string, senderId: string, content: string): Promise<Message> {
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    chatId,
    senderId,
    content,
    timestamp: new Date(),
    read: false,
  }

  messages.push(newMessage)
  return newMessage
}

// 初始化默认用户
export async function initializeDefaultUser(): Promise<User> {
  // 检查默认用户是否已存在
  const defaultUser = users.find((u) => u.id === "1")
  if (defaultUser) {
    return defaultUser
  }

  // 创建默认用户
  const newUser: User = {
    id: "1",
    name: "张小明",
    email: "pet@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  }

  users.push(newUser)
  return newUser
}

// 初始化默认聊天
export async function initializeDefaultChats(): Promise<void> {
  // 确保默认用户存在
  const defaultUser = await initializeDefaultUser()

  // 检查默认聊天是否已存在
  const aiChatExists = chats.some((c) => c.id === "chat_ai")
  if (!aiChatExists) {
    // 创建与AI助手的聊天
    chats.push({
      id: "chat_ai",
      participants: [defaultUser.id, "ai_assistant"],
      unreadCount: 0,
    })

    // 添加初始消息
    messages.push({
      id: `msg_ai_welcome`,
      chatId: "chat_ai",
      senderId: "ai_assistant",
      content: "您好！我是AI宠物助手，很高兴为您服务。请问有什么可以帮助您的吗？",
      timestamp: new Date(),
      read: false,
    })
  }

  // 检查与兽医的聊天是否已存在
  const vetChatExists = chats.some((c) => c.id === "chat_vet_li")
  if (!vetChatExists) {
    // 创建与兽医的聊天
    chats.push({
      id: "chat_vet_li",
      participants: [defaultUser.id, "vet_li"],
      unreadCount: 0,
    })
  }
}

// 初始化聊天数据（添加缺失的导出）
export async function initializeChatData(): Promise<void> {
  // 初始化默认用户和聊天
  await initializeDefaultUser()
  await initializeDefaultChats()
  console.log("聊天数据已初始化")
}
