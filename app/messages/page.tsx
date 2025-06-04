import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MessageListItem } from "@/components/message-list-item"

// 硬编码的联系人数据，做演示用
const mockContacts = [
  {
    id: "chat_ai",
    avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face",
    name: "AI宠物助手",
    message: "这种情况建议：🔍 先测量体温（正常37.5-39°C）；🥄 可以尝试用温水泡软狗粮...",
    time: "19:42",
    unreadCount: 0,
    online: true,
  },
  {
    id: "chat_shop",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "张小雅客服",
    message: "您好！您昨天下单的宠物零食已经发货啦～运单号：SF1234567890",
    time: "16:22",
    unreadCount: 1,
    online: true,
  },
  {
    id: "chat_vet_li",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "王晓明兽医",
    message: "上午10点到11点之间都可以，记得带上疫苗本",
    time: "15:40",
    unreadCount: 2,
    online: true,
  },
  {
    id: "chat_adoption",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
    name: "刘美丽",
    message: "感谢您对小白的关注，请问您方便明天来看看它吗？",
    time: "14:20",
    unreadCount: 1,
    online: false,
  },
  {
    id: "chat_1",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    name: "陈志华医生",
    message: "您好，我现在有空，什么时候能带您家狗狗过来呢？",
    time: "11:00",
    unreadCount: 1,
    online: true,
  },
  {
    id: "chat_2",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c9b8d4?w=150&h=150&fit=crop&crop=face",
    name: "李冰一",
    message: "猫猫的健康状态怎么样了呢",
    time: "10:47",
    unreadCount: 1,
    online: false,
  },
  {
    id: "chat_groomer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "赵小王",
    message: "豆豆的美容已经完成啦，您可以来接它了～今天表现很好呢",
    time: "昨天",
    unreadCount: 0,
    online: false,
  },
  {
    id: "chat_neighbor",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face",
    name: "张阿姨",
    message: "哈哈，它最喜欢晒太阳了",
    time: "09:20",
    unreadCount: 0,
    online: false,
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
