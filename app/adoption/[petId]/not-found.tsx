import { Button } from "@/components/ui/button"
import { PawPrint } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <PawPrint className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">宠物不存在</h2>
      <p className="text-muted-foreground text-center mb-6">您要查找的宠物可能已被领养或不存在</p>
      <Button asChild>
        <Link href="/adoption">返回领养页面</Link>
      </Button>
    </div>
  )
}
