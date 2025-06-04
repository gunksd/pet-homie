import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getUserChats, getContactById } from "@/lib/chat"

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

  // 获取每个聊天的联系人信息
  const chatsWithContacts = await Promise.all(
    sortedChats.map(async (chat) => {
      const otherParticipantId = chat.participants.find((id) => id !== user.id)
      const contact = otherParticipantId ? await getContactById(otherParticipantId) : null
      return { chat, contact }
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
        {chatsWithContacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无消息</p>
          </div>
        ) : (
          chatsWithContacts.map(({ chat, contact }) => (
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
                    {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ""}
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
