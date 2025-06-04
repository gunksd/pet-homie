import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface MessageListItemProps {
  id: string
  avatar: string
  name: string
  message: string
  time: string
  unreadCount: number
  online: boolean
}

export function MessageListItem({ id, avatar, name, message, time, unreadCount, online }: MessageListItemProps) {
  return (
    <Link href={`/messages/${id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{name}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{message}</p>
      </div>
      {unreadCount > 0 && (
        <div className="min-w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white px-1">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </Link>
  )
}
