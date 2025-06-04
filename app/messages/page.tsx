"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

// 模拟聊天数据
const mockChats = [
  {
    id: "chat_1",
    contact: {
      id: "doctor_chen",
      name: "陈医生",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      online: true,
    },
    lastMessage: {
      content: "您好，我现在有空，什么时候能带您家狗狗过来呢？",
      timestamp: new Date("2025-06-04T11:00:00"),
      isRead: false,
    },
    unreadCount: 1,
  },
  {
    id: "chat_2",
    contact: {
      id: "user_bingyi",
      name: "冰一",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c9b8d4?w=150&h=150&fit=crop&crop=face",
      online: false,
    },
    lastMessage: {
      content: "猫猫在健康状态怎么样了呢",
      timestamp: new Date("2025-06-04T10:47:00"),
      isRead: false,
    },
    unreadCount: 10,
  },
  {
    id: "chat_3",
    contact: {
      id: "vet_li",
      name: "李兽医",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      online: true,
    },
    lastMessage: {
      content: "记得按时给宠物服药哦，有任何问题随时联系我",
      timestamp: new Date("2025-06-04T09:30:00"),
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: "chat_4",
    contact: {
      id: "pet_store",
      name: "宠物商店",
      avatar: "https://images.unsplash.com/photo-1579197073550-bf44b469a6fe?w=150&h=150&fit=crop&crop=face",
      online: true,
    },
    lastMessage: {
      content: "您购买的宠物用品已发货，预计明天送达",
      timestamp: new Date("2025-06-03T15:20:00"),
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: "chat_5",
    contact: {
      id: "groomer_wang",
      name: "王美容师",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      online: false,
    },
    lastMessage: {
      content: "您的预约已确认，周六上午10点，请准时到店",
      timestamp: new Date("2025-06-03T14:05:00"),
      isRead: true,
    },
    unreadCount: 0,
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (date: Date) => {
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
      return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })
    }
  }

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex items-center p-4 border-b bg-blue-50">
        <Link href="/" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">消息</h1>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索"
            className="pl-9 rounded-full bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无消息</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <Link
              key={chat.id}
              href={`/messages/${chat.id}`}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.contact.avatar || "/placeholder.svg"} alt={chat.contact.name} />
                  <AvatarFallback>{chat.contact.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {chat.contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{chat.contact.name}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(chat.lastMessage.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage.content}</p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="min-w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white px-1">
                  {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
