import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function FavoritesPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const favorites = [
    {
      id: "1",
      type: "product",
      name: "宠物智能饮水器",
      price: "¥199",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
    },
    {
      id: "2",
      type: "pet",
      name: "小白 - 金毛",
      location: "北京市朝阳区",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
    },
    {
      id: "3",
      type: "article",
      name: "如何护理狗狗毛发",
      author: "宠物专家",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
    },
  ]

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/profile" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">我的收藏</h1>
      </div>

      <div className="p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">还没有收藏任何内容</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.type === "product" && item.price}
                        {item.type === "pet" && item.location}
                        {item.type === "article" && `作者：${item.author}`}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
