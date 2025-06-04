import { getCurrentUser } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share, MapPin, Phone, MessageCircle, Stethoscope } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PetDetailPageProps {
  params: {
    id: string
  }
}

// 宠物详细数据
const petsData = {
  "1": {
    id: "1",
    name: "小白",
    type: "狗",
    breed: "金毛",
    age: "2岁",
    gender: "公",
    location: "北京市朝阳区",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
    description:
      "小白是一只非常温顺的金毛犬，特别喜欢和小朋友玩耍。它已经完成了基础训练，会坐下、握手等基本指令。由于主人工作调动无法继续饲养，希望为它找到一个有爱心的新家庭。",
    vaccinated: true,
    sterilized: true,
    weight: "25kg",
    personality: ["温顺", "活泼", "亲人"],
    healthStatus: "健康",
    adoptionFee: 0,
    contactPerson: "张女士",
    contactPhone: "138****1234",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
    ],
    medicalHistory: "已完成所有疫苗接种，定期驱虫，身体健康",
    requirements: "希望领养家庭有足够的时间陪伴，有院子或经常遛狗",
    story:
      "小白原本生活在一个幸福的家庭，但由于主人工作调动需要搬到不允许养宠物的地方，不得不为它寻找新家。它非常聪明，学会了很多技能，是个完美的家庭伴侣。",
  },
  "2": {
    id: "2",
    name: "小花",
    type: "猫",
    breed: "英短",
    age: "1岁",
    gender: "母",
    location: "上海市浦东新区",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=400&fit=crop",
    description: "小花是一只安静乖巧的英短猫咪，非常适合公寓饲养。她性格独立但也很亲人，喜欢安静地陪伴在主人身边。",
    vaccinated: true,
    sterilized: false,
    weight: "4kg",
    personality: ["安静", "乖巧", "独立"],
    healthStatus: "健康",
    adoptionFee: 200,
    contactPerson: "李先生",
    contactPhone: "139****5678",
    images: [
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
    ],
    medicalHistory: "已完成基础疫苗，健康状况良好",
    requirements: "希望领养家庭能够提供安静的环境，定期体检",
    story: "小花是一只被救助的流浪猫，经过悉心照料已经完全康复，现在需要一个永久的家。",
  },
  "3": {
    id: "3",
    name: "豆豆",
    type: "狗",
    breed: "柴犬",
    age: "3岁",
    gender: "公",
    location: "广州市天河区",
    image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=400&fit=crop",
    description: "豆豆是一只活泼好动的柴犬，非常聪明，喜欢户外活动。它需要一个能够经常带它运动的家庭。",
    vaccinated: true,
    sterilized: true,
    weight: "12kg",
    personality: ["活泼", "聪明", "忠诚"],
    healthStatus: "健康",
    adoptionFee: 500,
    contactPerson: "王女士",
    contactPhone: "137****9012",
    images: [
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
    ],
    medicalHistory: "已完成所有疫苗接种，定期驱虫，身体健康",
    requirements: "希望领养家庭有足够的时间陪伴，能够经常带它运动",
    story: "豆豆是一只被救助的流浪狗，经过训练已经有了良好的生活习惯，现在需要一个永久的家。",
  },
  "4": {
    id: "4",
    name: "咪咪",
    type: "猫",
    breed: "橘猫",
    age: "6个月",
    gender: "母",
    location: "深圳市南山区",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
    description: "咪咪是一只年幼可爱的橘猫，正在寻找温暖的家。她活泼好动，喜欢玩耍，是个完美的家庭伴侣。",
    vaccinated: false,
    sterilized: false,
    weight: "2.5kg",
    personality: ["可爱", "好奇", "粘人"],
    healthStatus: "健康",
    adoptionFee: 100,
    contactPerson: "陈女士",
    contactPhone: "135****3456",
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=400&fit=crop",
    ],
    medicalHistory: "已完成基础疫苗，健康状况良好",
    requirements: "希望领养家庭能够提供安静的环境，定期体检",
    story: "咪咪是一只被救助的流浪猫，经过悉心照料已经完全康复，现在需要一个永久的家。",
  },
  "5": {
    id: "5",
    name: "黑豆",
    type: "狗",
    breed: "拉布拉多",
    age: "4岁",
    gender: "公",
    location: "北京市海淀区",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop",
    description:
      "黑豆是一只成年拉布拉多，毛色为纯黑色，体型健壮，性格友善忠诚。它已经完成了基础训练，是个完美的家庭伴侣。",
    vaccinated: true,
    sterilized: true,
    weight: "30kg",
    personality: ["友善", "忠诚", "温和"],
    healthStatus: "健康",
    adoptionFee: 300,
    contactPerson: "赵先生",
    contactPhone: "136****7890",
    images: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
    ],
    medicalHistory: "已完成所有疫苗接种，定期驱虫，身体健康",
    requirements: "希望领养家庭有足够的时间陪伴，有院子或经常遛狗",
    story: "黑豆原本生活在一个幸福的家庭，但由于主人工作调动无法继续饲养，希望为它找到一个有爱心的新家庭。",
  },
  "6": {
    id: "6",
    name: "雪球",
    type: "其他",
    breed: "荷兰猪",
    age: "1岁",
    gender: "母",
    location: "上海市徐汇区",
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=400&fit=crop",
    description: "雪球是一只可爱的小荷兰猪，很适合小朋友饲养。它性格温顺，不怕人，喜欢被抚摸。",
    vaccinated: false,
    sterilized: false,
    weight: "0.8kg",
    personality: ["温顺", "可爱", "安静"],
    healthStatus: "健康",
    adoptionFee: 50,
    contactPerson: "孙女士",
    contactPhone: "134****2468",
    images: [
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&h=400&fit=crop",
    ],
    medicalHistory: "健康状况良好",
    requirements: "希望领养家庭能够提供安静的环境，定期体检",
    story: "雪球是一只被救助的小荷兰猪，经过悉心照料已经完全康复，现在需要一个永久的家。",
  },
}

export default async function PetDetailPage({ params }: PetDetailPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const pet = petsData[params.id as keyof typeof petsData]
  if (!pet) {
    notFound()
  }

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Link href="/adoption">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">宠物详情</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 主图片 */}
      <div className="relative h-64">
        <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
      </div>

      <div className="p-4">
        {/* 基本信息 */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold">{pet.name}</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {pet.adoptionFee === 0 ? "免费领养" : `领养费 ¥${pet.adoptionFee}`}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground mb-2">
            {pet.breed} · {pet.gender} · {pet.age}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{pet.location}</span>
          </div>
          <p className="text-sm leading-relaxed">{pet.description}</p>
        </div>

        {/* 性格标签 */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">性格特点</h3>
          <div className="flex flex-wrap gap-2">
            {pet.personality.map((trait, index) => (
              <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        {/* 健康状况 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              健康状况
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">体重</span>
              <span className="text-sm font-medium">{pet.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">健康状态</span>
              <Badge className="bg-green-100 text-green-700">{pet.healthStatus}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">疫苗接种</span>
              <Badge className={pet.vaccinated ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                {pet.vaccinated ? "已完成" : "未完成"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">绝育状态</span>
              <Badge className={pet.sterilized ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                {pet.sterilized ? "已绝育" : "未绝育"}
              </Badge>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">{pet.medicalHistory}</p>
            </div>
          </CardContent>
        </Card>

        {/* 领养要求 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">领养要求</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{pet.requirements}</p>
          </CardContent>
        </Card>

        {/* 宠物故事 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">它的故事</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{pet.story}</p>
          </CardContent>
        </Card>

        {/* 更多照片 */}
        {pet.images && pet.images.length > 1 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">更多照片</h3>
            <div className="grid grid-cols-2 gap-2">
              {pet.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${pet.name} 照片 ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 联系信息 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">联系方式</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">联系人</span>
              <span className="text-sm font-medium">{pet.contactPerson}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">电话</span>
              <span className="text-sm font-medium">{pet.contactPhone}</span>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            电话咨询
          </Button>
          <Button className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            立即领养
          </Button>
        </div>
      </div>
    </div>
  )
}
