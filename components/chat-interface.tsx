"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Phone, Video, MoreVertical, ImageIcon } from "lucide-react"
import Link from "next/link"
import type { Chat, Message, Contact, User } from "@/lib/chat"
import { useToast } from "@/components/ui/use-toast"

// 创建客户端操作函数
async function sendMessageAction(chatId: string, senderId: string, content: string) {
  return fetch("/api/messages/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId, senderId, content }),
  }).then((res) => res.json())
}

async function markMessagesAsReadAction(chatId: string, userId: string) {
  return fetch("/api/messages/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId, userId }),
  })
}

async function generateAIResponseAction(userMessage: string) {
  return fetch("/api/ai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userMessage }),
  }).then((res) => res.json())
}

interface ChatInterfaceProps {
  chat: Chat
  messages: Message[]
  currentUser: User
  contact: Contact | null
}

export function ChatInterface({ chat, messages: initialMessages, currentUser, contact }: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [showPresetMessages, setShowPresetMessages] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // 预设消息
  const presetMessages = [
    "您好，请问现在方便聊天吗？",
    "我家宠物的情况怎么样了？",
    "什么时候可以安排下次检查？",
    "谢谢您的专业建议！",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 修改useEffect，使用客户端操作函数
  useEffect(() => {
    // 标记消息为已读
    markMessagesAsReadAction(chat.id, currentUser.id)
  }, [chat.id, currentUser.id])

  // 修改handleSendMessage函数，使用客户端操作函数
  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || newMessage.trim()
    if (!content || sending) return

    setSending(true)
    // 保持预设消息可见
    // setShowPresetMessages(false);

    try {
      // 发送用户消息
      const message = await sendMessageAction(chat.id, currentUser.id, content)
      setMessages((prev) => [...prev, message])

      if (!messageContent) {
        setNewMessage("")
      }

      // 如果是与AI助手的对话，生成AI回复
      if (contact?.id === "ai_assistant") {
        setTimeout(
          async () => {
            try {
              // 显示"正在输入"状态
              const typingMessage = await sendMessageAction(chat.id, contact.id, "正在思考中...")
              setMessages((prev) => [...prev, typingMessage])

              // 调用AI生成回复
              const { response: aiResponse } = await generateAIResponseAction(content)

              // 删除"正在输入"消息，添加真实回复
              setMessages((prev) => prev.filter((msg) => msg.id !== typingMessage.id))

              // 创建AI回复消息
              const aiMessage = await sendMessageAction(chat.id, contact.id, aiResponse)
              setMessages((prev) => [...prev, aiMessage])
            } catch (error) {
              console.error("AI回复生成失败:", error)

              // 删除"正在输入"消息
              setMessages((prev) => prev.filter((msg) => msg.content !== "正在思考中..."))

              // 发送错误提示
              const errorMessage = await sendMessageAction(
                chat.id,
                contact.id,
                "抱歉，我现在有点忙，请稍后再试。如果是紧急情况，建议联系专业兽医.",
              )
              setMessages((prev) => [...prev, errorMessage])

              toast({
                title: "AI回复失败",
                description: "网络连接问题，请稍后再试",
                variant: "destructive",
              })
            }
          },
          1000 + Math.random() * 2000,
        ) // 1-3秒随机延迟，模拟真实对话
      }
    } catch (error) {
      toast({
        title: "发送失败",
        description: "消息发送失败，请重试",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const messageDate = new Date(date)

    if (messageDate.toDateString() === today.toDateString()) {
      return "今天"
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "昨天"
    }

    return messageDate.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    })
  }

  // 格式化最后在线时间
  const formatLastSeen = (date?: Date) => {
    if (!date) return "离线"

    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // 如果在线时间在5分钟内，显示"在线"
    if (diff < 5 * 60 * 1000) return "在线"

    // 如果是今天
    if (date.toDateString() === now.toDateString()) {
      return `今天 ${date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
    }

    // 如果是昨天
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
    }

    // 其他日期
    return date.toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* 聊天头部 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Link href="/messages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="relative">
            <Avatar>
              <AvatarImage
                src={contact?.avatar || "/placeholder.svg?height=40&width=40&query=user"}
                alt={contact?.name || "未知联系人"}
              />
              <AvatarFallback>{(contact?.name || "?").charAt(0)}</AvatarFallback>
            </Avatar>
            {contact?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h1 className="font-medium">{contact?.name || "未知联系人"}</h1>
            <p className="text-xs text-muted-foreground">
              {contact?.online ? "在线" : `最后在线: ${formatLastSeen(contact?.lastSeen)}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser.id
          const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)
          const messageContact = isCurrentUser ? currentUser : contact

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center text-xs text-muted-foreground mb-4">{formatDate(message.timestamp)}</div>
              )}
              <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={messageContact?.avatar || "/placeholder.svg?height=32&width=32&query=user"}
                      alt={messageContact?.name || "未知联系人"}
                    />
                    <AvatarFallback>{(messageContact?.name || "?").charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 text-right ${
                        isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 预设消息 */}
      {showPresetMessages && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-muted-foreground mb-2">快捷回复：</p>
          <div className="flex flex-wrap gap-2">
            {presetMessages.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-8 bg-white"
                onClick={() => handleSendMessage(preset)}
                disabled={sending}
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 消息输入框 */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 bg-gray-100"
            disabled={sending}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || sending} className="rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
