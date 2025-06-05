"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Edit } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  // 硬编码的联系人数据
  const contacts = [
    {
      id: "chat_ai",
      name: "AI宠物助手",
      avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face",
      lastMessage: "有什么可以帮助您的吗？",
      timestamp: "刚刚",
      unreadCount: 0,
      online: true,
    },
    {
      id: "chat_vet_li",
      name: "王晓明兽医",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      lastMessage: "下周二上午10点怎么样？记得带上疫苗本哦",
      timestamp: "30分钟前",
      unreadCount: 1,
      online: true,
    },
  ]

  return (
    <div className="flex flex-col h-screen pb-20 bg-background">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-medium text-foreground">消息</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Edit className="h-5 w-5 text-foreground" />
        </Button>
      </div>

      {/* 搜索框 */}
      <div className="p-4 bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索联系人或消息" className="pl-10 bg-muted/30 border-border" />
        </div>
      </div>

      {/* 联系人列表 */}
      <div className="flex-1 overflow-auto bg-background">
        {contacts.map((contact) => (
          <Link
            key={contact.id}
            href={`/messages/${contact.id}`}
            className="flex items-center gap-3 p-4 hover:bg-muted/50 border-b border-border/50 transition-colors"
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                <AvatarFallback className="bg-primary/10 text-primary">{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {contact.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
                <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
            </div>
            {contact.unreadCount > 0 && (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground">{contact.unreadCount}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
