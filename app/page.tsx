import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Bell, ChevronRight, ShoppingBag, PawPrint, Users, Sparkles, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="flex flex-col pb-20">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between p-4 bg-blue-50">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt="用户头像" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">早上好！</p>
            <h2 className="font-medium">{user.name}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 功能导航 */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-white">
        <Link href="/shop" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xs">商城</span>
        </Link>
        <Link href="/adoption" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
            <PawPrint className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xs">领养</span>
        </Link>
        <Link href="/community" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xs">社区</span>
        </Link>
        <Link href="/ai-assistant" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xs">AI助手</span>
        </Link>
      </div>

      {/* 推荐内容 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">为您推荐</h3>
          <Link href="/recommendations" className="text-sm text-muted-foreground flex items-center">
            更多 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <Link href="/articles/1">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop"
                  alt="狗狗护理"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h4 className="font-bold text-lg">如何护理狗狗毛发</h4>
                  <p className="text-sm">专业指南帮助您保持爱犬毛发健康亮丽</p>
                  <Button variant="secondary" size="sm" className="mt-2 bg-white text-black hover:bg-gray-100">
                    阅读更多
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 最新资讯 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">最新资讯</h3>
          <Link href="/news" className="text-sm text-muted-foreground flex items-center">
            更多 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/articles/2">
            <Card className="overflow-hidden">
              <div className="relative h-32">
                <Image
                  src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop"
                  alt="小橘猫"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-2">
                <h4 className="font-medium text-sm">小橘猫的日常护理</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">小橘</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Card className="overflow-hidden">
            <div className="relative h-32">
              <Image
                src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=300&h=300&fit=crop"
                alt="一篮子小猫"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-2">
              <h4 className="font-medium text-sm">多猫家庭的和谐相处</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">猫咪家族</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
