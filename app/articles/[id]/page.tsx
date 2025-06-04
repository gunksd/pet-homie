import { getCurrentUser } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Heart, Share, Bookmark } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ArticlePageProps {
  params: {
    id: string
  }
}

// 模拟文章数据
const articles = {
  "1": {
    id: "1",
    title: "如何护理狗狗毛发",
    content: `
      <h2>狗狗毛发护理的重要性</h2>
      <p>狗狗的毛发不仅影响外观，更是健康的重要指标。定期的毛发护理可以：</p>
      <ul>
        <li>预防皮肤疾病</li>
        <li>减少掉毛问题</li>
        <li>增进与宠物的感情</li>
        <li>及早发现皮肤异常</li>
      </ul>
      
      <h2>日常护理步骤</h2>
      <h3>1. 每日梳理</h3>
      <p>使用合适的梳子，从头部开始，顺着毛发生长方向轻柔梳理。长毛犬需要更频繁的梳理，建议每天至少一次。</p>
      
      <h3>2. 定期洗澡</h3>
      <p>根据狗狗的活动量和毛发类型，一般1-2周洗一次澡。使用专用的宠物洗发水，避免使用人用产品。</p>
      
      <h3>3. 营养补充</h3>
      <p>毛发健康与营养密切相关。确保狗狗摄入足够的蛋白质、维生素和矿物质。</p>
      
      <h2>常见问题解答</h2>
      <h3>Q: 狗狗掉毛严重怎么办？</h3>
      <p>A: 适度掉毛是正常现象，但如果掉毛过多，可能是营养不良、压力或皮肤疾病导致。建议咨询兽医。</p>
      
      <h3>Q: 多久洗一次澡合适？</h3>
      <p>A: 一般情况下1-2周一次，但要根据狗狗的具体情况调整。过度洗澡可能破坏皮肤的天然保护层。</p>
    `,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
    author: "宠物专家李医生",
    readTime: "5分钟",
    publishedAt: "2025-06-02",
    likes: 156,
    views: 2341,
  },
  "2": {
    id: "2",
    title: "小橘猫的日常护理",
    content: `
      <h2>橘猫的特点</h2>
      <p>橘猫因其温顺的性格和可爱的外表深受喜爱。它们通常比较亲人，但也容易发胖，需要特别注意饮食管理。</p>
      
      <h2>日常护理要点</h2>
      <h3>1. 饮食管理</h3>
      <p>橘猫容易发胖，要控制食量，选择高质量的猫粮，避免过多零食。</p>
      
      <h3>2. 毛发护理</h3>
      <p>定期梳理毛发，特别是换毛季节，可以减少毛球症的发生。</p>
      
      <h3>3. 运动锻炼</h3>
      <p>提供足够的玩具和活动空间，鼓励猫咪多运动，保持健康体重。</p>
    `,
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
    author: "猫咪专家王医生",
    readTime: "3分钟",
    publishedAt: "2025-06-01",
    likes: 89,
    views: 1234,
  },
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const article = articles[params.id as keyof typeof articles]
  if (!article) {
    notFound()
  }

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">文章详情</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative h-48">
        <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
      </div>

      <div className="p-4">
        <h1 className="text-xl font-bold mb-3">{article.title}</h1>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
          <span>{article.publishedAt}</span>
        </div>

        <div className="prose prose-sm max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{article.likes}</span>
            </Button>
            <span className="text-sm text-muted-foreground">{article.views} 次阅读</span>
          </div>
          <Button size="sm">关注作者</Button>
        </div>
      </div>
    </div>
  )
}
