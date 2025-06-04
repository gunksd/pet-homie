"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react"
import Link from "next/link"
import type { Chat, Message, Contact, User } from "@/lib/chat"
import { sendMessage, markMessagesAsRead } from "@/lib/chat"
import { useToast } from "@/components/ui/use-toast"

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

  useEffect(() => {
    // 标记消息为已读
    markMessagesAsRead(chat.id, currentUser.id)
  }, [chat.id, currentUser.id])

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || newMessage.trim()
    if (!content || sending) return

    setSending(true)
    setShowPresetMessages(false)

    try {
      const message = await sendMessage(chat.id, currentUser.id, content)
      setMessages((prev) => [...prev, message])
      if (!messageContent) {
        setNewMessage("")
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
              <AvatarImage src={contact?.avatar || "/placeholder.svg"} alt={contact?.name} />
              <AvatarFallback>{contact?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {contact?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h1 className="font-medium">{contact?.name}</h1>
            <p className="text-xs text-muted-foreground">
              {contact?.online
                ? "在线"
                : `最后在线：${contact?.lastSeen?.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`}
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
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser.id
          const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center text-xs text-muted-foreground mb-4">{formatDate(message.timestamp)}</div>
              )}
              <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                  {!isCurrentUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={contact?.avatar || "/placeholder.svg"} alt={contact?.name} />
                      <AvatarFallback>{contact?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
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
      {showPresetMessages && messages.length <= 2 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-muted-foreground mb-2">快捷回复：</p>
          <div className="flex flex-wrap gap-2">
            {presetMessages.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-8"
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
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
