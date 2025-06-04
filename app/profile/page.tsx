"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, Heart, LogOut, Settings, Plus, Calendar, ShoppingBag, Edit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser, signOut } from "@/lib/auth"
import { getUserPets } from "@/lib/pets"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [pets, setPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }

        setUser(currentUser)
        const userPets = await getUserPets(currentUser.id)
        setPets(userPets)
      } catch (error) {
        console.error("加载数据失败:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">我的</h1>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile/settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-6 flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-white">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt="用户头像" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-bold text-lg">{user.name}</h2>
          <p className="text-sm text-muted-foreground">铲屎官 · 已认证</p>
          <Button variant="link" className="p-0 h-auto text-primary" asChild>
            <Link href="/profile/edit">
              <Edit className="h-3 w-3 mr-1" />
              查看并编辑个人资料
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">我的宠物</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pets/add">
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Link>
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {pets.map((pet) => (
            <Link key={pet.id} href={`/pets/${pet.id}`}>
              <Card className="min-w-[140px] overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-24">
                  <Image
                    src={
                      pet.avatar ||
                      (pet.type === "dog"
                        ? "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop"
                        : "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop")
                    }
                    alt={pet.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-2">
                  <h4 className="font-medium text-sm">{pet.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {pet.breed} · {pet.age}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}

          <Button variant="outline" className="min-w-[140px] h-auto flex flex-col gap-2 py-4" asChild>
            <Link href="/pets/add">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm">添加宠物</span>
            </Link>
          </Button>
        </div>

        <div className="space-y-1 pt-2">
          <Link
            href="/profile/favorites"
            className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <span>我的收藏</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <Link
            href="/profile/appointments"
            className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <span>预约记录</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <Link href="/profile/orders" className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-green-500" />
              </div>
              <span>订单记录</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <Link href="/profile/settings" className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Settings className="h-4 w-4 text-gray-500" />
              </div>
              <span>设置</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <form action={signOut}>
            <Button type="submit" variant="ghost" className="w-full justify-start p-3 hover:bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-orange-500" />
                </div>
                <span>退出登录</span>
              </div>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
