import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { getUserChats, getContactById } from "@/lib/chat"
import { redirect } from "next/navigation"

export default async function MessagesPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const chats = await getUserChats(user.id)

  // 预处理聊天数据，获取联系人信息
  const chatsWithContacts = await Promise.all(
    chats.map(async (chat) => {
      const otherParticipantId = chat.participants.find((id) => id !== user.id)
      const contact = otherParticipantId ? await getContactById(otherParticipantId) : null
      return { chat, contact }
    }),
  )

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">消息</h1>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索" className="pl-9 rounded-full" />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {chatsWithContacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无消息</p>
          </div>
        ) : (
          chatsWithContacts.map(({ chat, contact }) => (
            <Link key={chat.id} href={`/messages/${chat.id}`} className="flex items-center gap-3 p-4 hover:bg-muted/50">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact?.avatar || "/placeholder.svg"} alt={contact?.name} />
                  <AvatarFallback>{contact?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {contact?.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{contact?.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {chat.lastMessage?.timestamp.toLocaleTimeString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage?.content}</p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white">
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
