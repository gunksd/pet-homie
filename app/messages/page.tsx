"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { getUserChats, getContactById } from "@/lib/chat"
import { useRouter } from "next/navigation"

// 格式化最后在线时间
function formatLastSeen(date?: Date) {
  if (!date) return ""

  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 如果在线时间在5分钟内，显示"在线"
  if (diff < 5 * 60 * 1000) return "在线"

  // 如果是今天
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  }

  // 如果是昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return "昨天"
  }

  // 其他日期
  return date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
  })
}

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [chats, setChats] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }

        setUser(currentUser)

        const userChats = await getUserChats(currentUser.id)

        // 预处理聊天数据，获取联系人信息
        const chatsWithContacts = await Promise.all(
          userChats.map(async (chat) => {
            const otherParticipantId = chat.participants.find((id) => id !== currentUser.id)
            const contact = otherParticipantId ? await getContactById(otherParticipantId) : null
            return { chat, contact }
          }),
        )

        setChats(chatsWithContacts)
      } catch (error) {
        console.error("加载数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const filteredChats = chats.filter(
    ({ contact }) => !searchQuery || (contact?.name && contact.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>加载中...</p>
      </div>
    )
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
          filteredChats.map(({ chat, contact }) => (
            <Link
              key={chat.id}
              href={`/messages/${chat.id}`}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={contact?.avatar || "/placeholder.svg?height=48&width=48&query=user"}
                    alt={contact?.name || "用户"}
                  />
                  <AvatarFallback>{(contact?.name || "用户").charAt(0)}</AvatarFallback>
                </Avatar>
                {contact?.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{contact?.name || "用户"}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {chat.lastMessage?.timestamp ? formatLastSeen(chat.lastMessage.timestamp) : ""}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage?.content || "暂无消息"}</p>
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
