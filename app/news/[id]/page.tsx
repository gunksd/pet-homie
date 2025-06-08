import { getCurrentUser } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Eye, Heart, Share, Bookmark } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface NewsPageProps {
  params: {
    id: string
  }
}

// 模拟资讯数据
const newsData = {
  "1": {
    id: "1",
    title: "小橘猫的日常护理",
    content: `
      <h2>橘猫的特点</h2>
      <p>橘猫因其可爱的外表和温顺的性格深受喜爱。它们通常比较亲人，但也容易发胖，需要特别注意饮食管理。</p>
      
      <h2>日常护理要点</h2>
      <h3>1. 饮食管理</h3>
      <p>橘猫容易发胖，要控制食量，选择高质量的猫粮，避免过多零食。建议：</p>
      <ul>
        <li>定时定量喂食</li>
        <li>选择低脂肪、高蛋白的猫粮</li>
        <li>控制零食摄入量</li>
        <li>提供充足的饮水</li>
      </ul>
      
      <h3>2. 毛发护理</h3>
      <p>定期梳理毛发，特别是换毛季节，可以减少毛球症的发生。</p>
      <ul>
        <li>每天梳理1-2次</li>
        <li>使用专用的猫咪梳子</li>
        <li>定期洗澡（1-2个月一次）</li>
      </ul>
      
      <h3>3. 运动锻炼</h3>
      <p>提供足够的玩具和活动空间，鼓励猫咪多运动，保持健康体重。</p>
      
      <h2>健康监测</h2>
      <p>定期观察猫咪的精神状态、食欲、排便情况，发现异常及时就医。</p>
    `,
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
    category: "护理",
    views: 1234,
    publishedAt: "2小时前",
    author: "宠物专家王医生",
    readTime: "3分钟",
  },
  "2": {
    id: "2",
    title: "多猫家庭的和谐相处",
    content: `
      <h2>多猫家庭的挑战</h2>
      <p>在多猫家庭中，让每只猫咪都能和谐相处是一个需要耐心和技巧的过程。</p>
      
      <h2>建立和谐关系的方法</h2>
      <h3>1. 逐步介绍</h3>
      <p>新猫咪到家时，不要立即让它们见面，而是要循序渐进：</p>
      <ul>
        <li>先让新猫在单独房间适应</li>
        <li>通过门缝让猫咪闻到彼此的气味</li>
        <li>交换使用过的毛巾或玩具</li>
        <li>在有监督的情况下短时间见面</li>
      </ul>
      
      <h3>2. 资源分配</h3>
      <p>确保每只猫都有足够的资源：</p>
      <ul>
        <li>每只猫一个食盆和水盆</li>
        <li>猫砂盆数量 = 猫咪数量 + 1</li>
        <li>足够的休息和躲藏空间</li>
        <li>多个猫抓板和玩具</li>
      </ul>
      
      <h3>3. 建立日常规律</h3>
      <p>固定的喂食时间和游戏时间有助于减少竞争和冲突。</p>
      
      <h2>处理冲突</h2>
      <p>如果猫咪之间发生冲突，不要强行干预，而是要：</p>
      <ul>
        <li>分散注意力</li>
        <li>给予足够的个人空间</li>
        <li>必要时寻求专业帮助</li>
      </ul>
    `,
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=400&fit=crop",
    category: "行为",
    views: 856,
    publishedAt: "4小时前",
    author: "动物行为专家李老师",
    readTime: "5分钟",
  },
  "3": {
    id: "3",
    title: "狗狗训练的黄金时期",
    content: `
      <h2>幼犬训练的重要性</h2>
      <p>3-6个月是狗狗训练的黄金时期，这个阶段的狗狗学习能力最强，也最容易建立良好的行为习惯。</p>
      
      <h2>基础训练项目</h2>
      <h3>1. 如厕训练</h3>
      <p>教会狗狗在指定地点排便是最基础的训练：</p>
      <ul>
        <li>固定如厕地点</li>
        <li>观察狗狗的排便信号</li>
        <li>及时奖励正确行为</li>
        <li>清理意外时不要责骂</li>
      </ul>
      
      <h3>2. 基本指令</h3>
      <p>教会狗狗基本指令有助于日常管理：</p>
      <ul>
        <li>坐下（Sit）</li>
        <li>趴下（Down）</li>
        <li>过来（Come）</li>
        <li>等待（Stay）</li>
      </ul>
      
      <h3>3. 社交训练</h3>
      <p>让狗狗适应各种环境和人群：</p>
      <ul>
        <li>接触不同的人和动物</li>
        <li>适应各种声音和环境</li>
        <li>学会与其他狗狗友好相处</li>
      </ul>
      
      <h2>训练技巧</h2>
      <p>成功训练的关键在于：</p>
      <ul>
        <li>保持耐心和一致性</li>
        <li>使用正向强化</li>
        <li>训练时间要短而频繁</li>
        <li>及时奖励正确行为</li>
      </ul>
    `,
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
    category: "训练",
    views: 2341,
    publishedAt: "6小时前",
    author: "犬类训练师张教练",
    readTime: "6分钟",
  },
  "4": {
    id: "4",
    title: "宠物夏季防暑指南",
    content: `
      <h2>夏季宠物面临的风险</h2>
      <p>炎炎夏日，宠物比人类更容易中暑，因为它们主要通过舌头散热，散热效率较低。</p>
      
      <h2>防暑措施</h2>
      <h3>1. 环境控制</h3>
      <ul>
        <li>保持室内通风凉爽</li>
        <li>使用空调或风扇</li>
        <li>提供阴凉的休息场所</li>
        <li>避免阳光直射</li>
      </ul>
      
      <h3>2. 饮水管理</h3>
      <ul>
        <li>提供充足的清洁饮水</li>
        <li>经常更换水源</li>
        <li>可以添加冰块降温</li>
        <li>外出时携带水壶</li>
      </ul>
      
      <h3>3. 活动安排</h3>
      <ul>
        <li>避免在最热的时段外出</li>
        <li>选择清晨或傍晚散步</li>
        <li>减少剧烈运动</li>
        <li>注意地面温度</li>
      </ul>
      
      <h2>中暑症状识别</h2>
      <p>如果宠物出现以下症状，可能是中暑了：</p>
      <ul>
        <li>过度喘气</li>
        <li>流口水增多</li>
        <li>体温升高</li>
        <li>精神萎靡</li>
        <li>呕吐或腹泻</li>
      </ul>
      
      <h2>紧急处理</h2>
      <p>发现宠物中暑时的应急措施：</p>
      <ul>
        <li>立即转移到阴凉处</li>
        <li>用湿毛巾敷在身体上</li>
        <li>提供少量饮水</li>
        <li>及时送医治疗</li>
      </ul>
    `,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
    category: "健康",
    views: 1876,
    publishedAt: "1天前",
    author: "宠物医生陈医生",
    readTime: "4分钟",
  },
  "5": {
    id: "5",
    title: "春季宠物护理指南",
    content: `
      <h2>春季宠物护理的重要性</h2>
      <p>春天是万物复苏的季节，也是宠物护理的关键时期。随着气温回升，宠物的生理状态和行为习惯都会发生变化，需要主人给予特别的关注和护理。</p>
      
      <h2>春季护理要点</h2>
      
      <h3>1. 换毛期护理</h3>
      <p>春季是宠物换毛的高峰期，需要特别注意：</p>
      <ul>
        <li><strong>增加梳理频率：</strong>每天至少梳理1-2次，帮助去除死毛</li>
        <li><strong>选择合适工具：</strong>使用专业的宠物梳子和脱毛刷</li>
        <li><strong>营养补充：</strong>适当补充维生素和不饱和脂肪酸</li>
        <li><strong>环境清洁：</strong>及时清理家中的宠物毛发，保持环境卫生</li>
      </ul>
      
      <h3>2. 皮肤健康管理</h3>
      <p>春季湿度增加，容易引发皮肤问题：</p>
      <ul>
        <li><strong>定期检查：</strong>每周检查宠物皮肤状况，注意红肿、瘙痒等症状</li>
        <li><strong>保持干燥：</strong>洗澡后要彻底吹干，避免潮湿环境</li>
        <li><strong>预防寄生虫：</strong>使用驱虫产品，预防跳蚤、蜱虫等</li>
        <li><strong>饮食调理：</strong>避免过敏性食物，增加omega-3脂肪酸摄入</li>
      </ul>
      
      <h3>3. 运动与活动</h3>
      <p>春季气候宜人，是增加户外活动的好时机：</p>
      <ul>
        <li><strong>逐步增加运动量：</strong>从短距离散步开始，逐渐延长时间</li>
        <li><strong>选择合适时间：</strong>避开花粉浓度高的时段</li>
        <li><strong>注意安全：</strong>使用牵引绳，避免宠物走失</li>
        <li><strong>观察反应：</strong>注意宠物的体力状况，适时休息</li>
      </ul>
      
      <h3>4. 疫苗与健康检查</h3>
      <p>春季是进行年度健康检查的理想时期：</p>
      <ul>
        <li><strong>疫苗接种：</strong>确保疫苗接种计划的完整性</li>
        <li><strong>体检项目：</strong>包括血液检查、心脏检查、牙齿检查等</li>
        <li><strong>驱虫计划：</strong>制定内外驱虫的时间表</li>
        <li><strong>体重管理：</strong>评估宠物体重，调整饮食计划</li>
      </ul>
      
      <h2>春季常见问题及解决方案</h2>
      
      <h3>过敏反应</h3>
      <p>春季花粉增多，部分宠物可能出现过敏症状：</p>
      <ul>
        <li>症状：打喷嚏、流眼泪、皮肤瘙痒</li>
        <li>预防：减少外出时间，回家后清洁爪子和毛发</li>
        <li>治疗：及时就医，使用抗过敏药物</li>
      </ul>
      
      <h3>食欲变化</h3>
      <p>气温变化可能影响宠物食欲：</p>
      <ul>
        <li>调整饮食：选择易消化、营养丰富的食物</li>
        <li>少食多餐：避免一次性喂食过多</li>
        <li>保持新鲜：及时更换食物和饮水</li>
      </ul>
      
      <h2>专家建议</h2>
      <p>春季宠物护理需要主人的细心观察和耐心照料。建议建立护理日程表，记录宠物的健康状况变化。如发现异常症状，应及时咨询专业兽医。</p>
      
      <h2>总结</h2>
      <p>春季是宠物护理的关键时期，通过科学的护理方法和细心的观察，可以帮助宠物健康度过这个季节。记住，预防胜于治疗，定期的健康检查和日常护理是保证宠物健康的最佳方式。</p>
    `,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
    category: "护理",
    views: 3456,
    publishedAt: "2小时前",
    author: "宠物专家李医生",
    readTime: "8分钟",
  },
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const news = newsData[params.id as keyof typeof newsData]
  if (!news) {
    notFound()
  }

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Link href="/news">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">资讯详情</h1>
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
        <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{news.category}</span>
          <span className="text-xs text-muted-foreground">{news.publishedAt}</span>
        </div>

        <h1 className="text-xl font-bold mb-3">{news.title}</h1>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span>作者：{news.author}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{news.readTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{news.views}</span>
          </div>
        </div>

        <div className="prose prose-sm max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>点赞</span>
          </Button>
          <Button size="sm">关注作者</Button>
        </div>
      </div>
    </div>
  )
}
