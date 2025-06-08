import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, Heart, LogOut, Settings, Plus, Calendar, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col pb-20 bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-medium text-foreground">我的</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-foreground" />
        </Button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-6 flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800">
          <AvatarImage src="/favicon.png" alt="管理员头像" />
          <AvatarFallback className="bg-primary/10 text-primary">管</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-lg text-foreground">管理员</h2>
          <p className="text-sm text-muted-foreground">铲屎官 · 已认证</p>
          <Button variant="link" className="p-0 h-auto text-primary">
            查看并编辑个人资料
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="font-medium text-foreground">我的宠物</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <Card className="min-w-[140px] overflow-hidden bg-card border-border">
            <div className="relative h-24">
              <Image
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop"
                alt="金毛"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-2">
              <h4 className="font-medium text-sm text-foreground">豆豆</h4>
              <p className="text-xs text-muted-foreground">金毛 · 2岁</p>
            </CardContent>
          </Card>
          <Card className="min-w-[140px] overflow-hidden bg-card border-border">
            <div className="relative h-24">
              <Image
                src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop"
                alt="橘猫"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-2">
              <h4 className="font-medium text-sm text-foreground">小橘</h4>
              <p className="text-xs text-muted-foreground">橘猫 · 1岁</p>
            </CardContent>
          </Card>
          <Button variant="outline" className="min-w-[140px] h-auto flex flex-col gap-2 py-4 border-border">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-foreground">添加宠物</span>
          </Button>
        </div>

        <div className="space-y-1 pt-2">
          <Link
            href="/profile/favorites"
            className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <span className="text-foreground">我的收藏</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <Link
            href="/profile/appointments"
            className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">预约记录</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <Link
            href="/profile/orders"
            className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-foreground">订单记录</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <Link
            href="/profile/settings"
            className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Settings className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-foreground">设置</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <form action={signOut}>
            <Button type="submit" variant="ghost" className="w-full justify-start p-3 hover:bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-foreground">退出登录</span>
              </div>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
