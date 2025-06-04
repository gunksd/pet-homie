import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, MessageCircle, Share, MoreHorizontal, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function CommunityPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const posts = [
    {
      id: "1",
      author: {
        name: "小王",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      content: "我家的小金毛今天学会了新技能！坐下、握手都会了 🐕",
      images: [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
      ],
      likes: 24,
      comments: 8,
      timestamp: "2小时前",
    },
    {
      id: "2",
      author: {
        name: "猫奴小李",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c9b8d4?w=150&h=150&fit=crop&crop=face",
      },
      content: "橘猫的日常：吃饭、睡觉、卖萌。今天又胖了一圈 😸",
      images: ["https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop"],
      likes: 56,
      comments: 12,
      timestamp: "4小时前",
    },
    {
      id: "3",
      author: {
        name: "宠物医生张",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      },
      content: "【科普】夏季宠物护理小贴士：\n1. 保持充足饮水\n2. 避免长时间暴晒\n3. 定期梳理毛发\n4. 注意防虫防蚤",
      images: [],
      likes: 89,
      comments: 23,
      timestamp: "6小时前",
    },
  ]

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">宠物社区</h1>
        </div>
        <Button size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-none border-x-0 border-t-0">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar>
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{post.author.name}</h3>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <p className="mb-3 whitespace-pre-line">{post.content}</p>

              {post.images.length > 0 && (
                <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {post.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image src={image || "/placeholder.svg"} alt="帖子图片" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
