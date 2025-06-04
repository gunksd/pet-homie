import { getCurrentUser } from "@/lib/auth"
import { getChatById, getChatMessages, getContactById } from "@/lib/chat"
import { redirect, notFound } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"

interface ChatPageProps {
  params: {
    chatId: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const chat = await getChatById(params.chatId)
  if (!chat) {
    notFound()
  }

  const messages = await getChatMessages(params.chatId)
  const otherParticipantId = chat.participants.find((id) => id !== user.id)
  const contact = otherParticipantId ? await getContactById(otherParticipantId) : null

  return <ChatInterface chat={chat} messages={messages} currentUser={user} contact={contact} />
}
