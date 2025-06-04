import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getUserChats, getContactById, getChatMessages } from "@/lib/chat"
import { MessageListItem } from "@/components/message-list-item"

// 格式化时间显示
function formatTime(date: Date) {
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  if (isToday) {
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  } else {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return "昨天"
    }
    return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })
  }
}

export default async function MessagesPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  // 获取用户的聊天列表并按最后消息时间排序
  const userChats = await getUserChats(user.id)
  const sortedChats = userChats.sort((a, b) => {
    const timeA = a.lastMessage?.timestamp.getTime() || 0
    const timeB = b.lastMessage?.timestamp.getTime() || 0
    return timeB - timeA // 最新的在前面
  })

  // 获取每个聊天的联系人信息和最新消息
  const chatsWithDetails = await Promise.all(
    sortedChats.map(async (chat) => {
      const otherParticipantId = chat.participants.find((id) => id !== user.id)
      const contact = otherParticipantId ? await getContactById(otherParticipantId) : null

      // 获取这个聊天的最新3条消息
      const allMessages = await getChatMessages(chat.id)
      const recentMessages = allMessages.slice(-3) // 最新3条消息

      return { chat, contact, recentMessages }
    }),
  )

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
          <Input placeholder="搜索" className="pl-9 rounded-full bg-white" />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {chatsWithDetails.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无消息</p>
          </div>
        ) : (
          chatsWithDetails.map(({ chat, contact, recentMessages }) => (
            <div key={chat.id} className="border-b border-gray-100">
              {/* 聊天头部 */}
              <MessageListItem
                id={chat.id}
                avatar={contact?.avatar || "/placeholder.svg?height=48&width=48"}
                name={contact?.name || "未知联系人"}
                message={chat.lastMessage?.content || "暂无消息"}
                time={chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ""}
                unreadCount={chat.unreadCount}
                online={contact?.online || false}
              />

              {/* 最新消息预览 */}
              {recentMessages.length > 0 && (
                <div className="px-4 pb-3 space-y-1">
                  {recentMessages.slice(-2).map((message) => {
                    // 只显示最新2条
                    const isCurrentUser = message.senderId === user.id
                    const senderName = isCurrentUser ? "我" : contact?.name || "对方"

                    return (
                      <div key={message.id} className="text-xs text-gray-500 truncate">
                        <span className="font-medium">{senderName}:</span> {message.content}
                      </div>
                    )
                  })}

                  {/* 查看更多链接 */}
                  <Link
                    href={`/messages/${chat.id}`}
                    className="inline-flex items-center text-xs text-primary hover:underline"
                  >
                    查看完整对话 <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
