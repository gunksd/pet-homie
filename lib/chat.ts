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

// 模拟数据库
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
]

// 修改messages数组，添加更多预置消息
const messages: Message[] = [
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
  {
    id: "msg_3",
    chatId: "chat_1",
    senderId: "doctor_chen",
    content: "可以的，请准时到达宠物医院朝阳分院，记得带上豆豆的疫苗本。",
    timestamp: new Date("2025-06-04T11:10:00"),
    type: "text",
    read: false,
  },
  {
    id: "msg_4",
    chatId: "chat_1",
    senderId: "1", // 当前用户
    content: "好的，谢谢医生，我会准时带豆豆过去的。",
    timestamp: new Date("2025-06-04T11:15:00"),
    type: "text",
    read: true,
  },
  {
    id: "msg_5",
    chatId: "chat_2",
    senderId: "user_bingyi",
    content: "猫猫的健康状态怎么样了呢",
    timestamp: new Date("2025-06-04T10:47:00"),
    type: "text",
    read: false,
  },
  {
    id: "msg_6",
    chatId: "chat_2",
    senderId: "1", // 当前用户
    content: "小橘最近状态很好，食欲也恢复了",
    timestamp: new Date("2025-06-04T10:50:00"),
    type: "text",
    read: true,
  },
  {
    id: "msg_7",
    chatId: "chat_2",
    senderId: "user_bingyi",
    content: "太好了！上次推荐的猫粮效果不错吧？",
    timestamp: new Date("2025-06-04T10:52:00"),
    type: "text",
    read: false,
  },
  {
    id: "msg_8",
    chatId: "chat_2",
    senderId: "1", // 当前用户
    content: "是的，小橘很喜欢吃，毛发也变得更亮了",
    timestamp: new Date("2025-06-04T10:55:00"),
    type: "text",
    read: true,
  },
  {
    id: "msg_9",
    chatId: "chat_3",
    senderId: "vet_li",
    content: "您好，我看到您预约了明天上午10点的宠物美容服务，请问有什么特殊要求吗？",
    timestamp: new Date("2025-06-04T09:30:00"),
    type: "text",
    read: false,
  },
  {
    id: "msg_10",
    chatId: "chat_3",
    senderId: "1", // 当前用户
    content: "您好，希望能给我家金毛剪短一点，天气热了，谢谢！",
    timestamp: new Date("2025-06-04T09:45:00"),
    type: "text",
    read: true,
  },
]

// 修改chats数组，添加新的聊天
const chats: Chat[] = [
  {
    id: "chat_1",
    participants: ["1", "doctor_chen"],
    lastMessage: messages.find((m) => m.id === "msg_4"),
    unreadCount: 1,
    createdAt: new Date("2025-06-04T10:00:00"),
    updatedAt: new Date("2025-06-04T11:15:00"),
  },
  {
    id: "chat_2",
    participants: ["1", "user_bingyi"],
    lastMessage: messages.find((m) => m.id === "msg_8"),
    unreadCount: 2,
    createdAt: new Date("2025-06-04T09:00:00"),
    updatedAt: new Date("2025-06-04T10:55:00"),
  },
  {
    id: "chat_3",
    participants: ["1", "vet_li"],
    lastMessage: messages.find((m) => m.id === "msg_10"),
    unreadCount: 1,
    createdAt: new Date("2025-06-04T09:30:00"),
    updatedAt: new Date("2025-06-04T09:45:00"),
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
