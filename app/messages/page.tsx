import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MessageListItem } from "@/components/message-list-item"

// 硬编码的联系人数据，做演示用
const mockContacts = [
  {
    id: "chat_ai", // AI助手的聊天ID
    avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face",
    name: "AI宠物助手",
    message: "有什么宠物问题需要咨询吗？我很乐意帮助您！",
    time: "19:42",
    unreadCount: 0,
    online: true,
  },
  {
    id: "chat_vet_li", // 兽医的聊天ID
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "王晓明兽医",
    message: "上午10点到11点之间都可以，记得带上疫苗本",
    time: "15:40",
    unreadCount: 2,
    online: true,
  },
]

export default async function MessagesPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex items-center p-4 border-b bg-white">
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
        {mockContacts.map((contact) => (
          <MessageListItem
            key={contact.id}
            id={contact.id}
            avatar={contact.avatar}
            name={contact.name}
            message={contact.message}
            time={contact.time}
            unreadCount={contact.unreadCount}
            online={contact.online}
          />
        ))}
      </div>
    </div>
  )
}
