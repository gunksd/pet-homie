import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">聊天不存在</h2>
      <p className="text-muted-foreground text-center mb-6">您要查找的聊天可能已被删除或不存在</p>
      <Button asChild>
        <Link href="/messages">返回消息列表</Link>
      </Button>
    </div>
  )
}
