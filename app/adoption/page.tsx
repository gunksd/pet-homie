import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Heart, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function AdoptionPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const pets = [
    {
      id: "1",
      name: "小白",
      type: "狗",
      breed: "金毛",
      age: "2岁",
      gender: "公",
      location: "北京市朝阳区",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
      description: "性格温顺，喜欢和小朋友玩耍",
      vaccinated: true,
      sterilized: true,
    },
    {
      id: "2",
      name: "小花",
      type: "猫",
      breed: "英短",
      age: "1岁",
      gender: "母",
      location: "上海市浦东新区",
      image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop",
      description: "安静乖巧，适合公寓饲养",
      vaccinated: true,
      sterilized: false,
    },
    {
      id: "3",
      name: "豆豆",
      type: "狗",
      breed: "柴犬",
      age: "3岁",
      gender: "公",
      location: "广州市天河区",
      image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop",
      description: "活泼好动，需要经常运动",
      vaccinated: true,
      sterilized: true,
    },
    {
      id: "4",
      name: "咪咪",
      type: "猫",
      breed: "橘猫",
      age: "6个月",
      gender: "母",
      location: "深圳市南山区",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
      description: "年幼可爱，正在寻找温暖的家",
      vaccinated: false,
      sterilized: false,
    },
    {
      id: "5",
      name: "黑豆",
      type: "狗",
      breed: "拉布拉多",
      age: "4岁",
      gender: "公",
      location: "北京市海淀区",
      image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop",
      description: "成年拉布拉多，毛色为纯黑色，体型健壮，性格友善忠诚",
      vaccinated: true,
      sterilized: true,
    },
  ]

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">宠物领养</h1>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">给它们一个温暖的家</h2>
          <p className="text-muted-foreground text-sm">每一个小生命都值得被爱护</p>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索宠物品种、地区..." className="pl-9 rounded-full" />
        </div>

        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="dog">狗狗</TabsTrigger>
            <TabsTrigger value="cat">猫咪</TabsTrigger>
            <TabsTrigger value="other">其他</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 gap-4">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden">
              <div className="flex">
                <div className="relative w-32 h-32">
                  <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7 bg-white/80 rounded-full"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="flex-1 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{pet.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed} · {pet.gender} · {pet.age}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{pet.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{pet.location}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {pet.vaccinated && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">已疫苗</span>
                    )}
                    {pet.sterilized && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">已绝育</span>
                    )}
                  </div>
                  <Button size="sm" className="w-full">
                    了解详情
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
