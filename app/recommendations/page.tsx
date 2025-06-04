import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function RecommendationsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const articles = [
    {
      id: "1",
      title: "如何护理狗狗毛发",
      summary: "专业指南帮助您保持爱犬毛发健康亮丽",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
      author: "宠物专家李医生",
      readTime: "5分钟",
      publishedAt: "2025-06-02",
    },
    {
      id: "2",
      title: "猫咪营养搭配指南",
      summary: "科学喂养，让您的猫咪健康成长",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
      author: "营养师王老师",
      readTime: "8分钟",
      publishedAt: "2025-06-01",
    },
    {
      id: "3",
      title: "宠物疫苗接种时间表",
      summary: "详细的疫苗接种计划，保护宠物健康",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop",
      author: "兽医陈医生",
      readTime: "6分钟",
      publishedAt: "2025-05-30",
    },
    {
      id: "4",
      title: "宠物行为训练技巧",
      summary: "简单有效的训练方法，让宠物更听话",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
      author: "训练师张老师",
      readTime: "10分钟",
      publishedAt: "2025-05-28",
    },
  ]

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">推荐内容</h1>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <span>{article.publishedAt}</span>
                </div>
                <Button className="w-full mt-3">阅读全文</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
