import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function NewsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const news = [
    {
      id: "1",
      title: "小橘猫的日常护理",
      summary: "橘猫因其可爱的外表和温顺的性格深受喜爱",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
      category: "护理",
      views: 1234,
      publishedAt: "2小时前",
    },
    {
      id: "2",
      title: "多猫家庭的和谐相处",
      summary: "如何让多只猫咪在同一个家庭中和谐共处",
      image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=300&fit=crop",
      category: "行为",
      views: 856,
      publishedAt: "4小时前",
    },
    {
      id: "3",
      title: "狗狗训练的黄金时期",
      summary: "把握最佳训练时机，让您的爱犬更听话",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
      category: "训练",
      views: 2341,
      publishedAt: "6小时前",
    },
    {
      id: "4",
      title: "宠物夏季防暑指南",
      summary: "炎炎夏日，如何保护宠物免受高温伤害",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
      category: "健康",
      views: 1876,
      publishedAt: "1天前",
    },
  ]

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">最新资讯</h1>
      </div>

      <div className="p-4">
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="grid grid-cols-5 h-9">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="health">健康</TabsTrigger>
            <TabsTrigger value="care">护理</TabsTrigger>
            <TabsTrigger value="training">训练</TabsTrigger>
            <TabsTrigger value="behavior">行为</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative w-32 h-24">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-sm leading-tight">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.summary}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{item.category}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
