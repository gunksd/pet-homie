import { getCurrentUser } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MapPin, Calendar, Phone, Share, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getPetById } from "@/lib/pets"

interface PetDetailPageProps {
  params: {
    petId: string
  }
}

export default async function PetDetailPage({ params }: PetDetailPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const pet = await getPetById(params.petId)
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

      <div className="relative h-64">
        <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{pet.name}</h2>
            <p className="text-muted-foreground">
              {pet.breed} · {pet.gender} · {pet.age}
            </p>
          </div>
          <div className="flex gap-1">
            {pet.vaccinated && <Badge className="bg-green-100 text-green-700 hover:bg-green-200">已疫苗</Badge>}
            {pet.sterilized && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">已绝育</Badge>}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{pet.location}</span>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">关于{pet.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{pet.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">品种</span>
                <span className="font-medium">{pet.breed}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">年龄</span>
                <span className="font-medium">{pet.age}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">性别</span>
                <span className="font-medium">{pet.gender}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">体重</span>
                <span className="font-medium">{pet.weight || "未知"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">性格特点</h3>
            <div className="flex flex-wrap gap-2">
              {pet.traits?.map((trait, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">领养须知</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• 需要提供稳定的居住环境</li>
              <li>• 有足够的时间陪伴宠物</li>
              <li>• 能够承担宠物的医疗和日常开销</li>
              <li>• 签署领养协议，定期回访</li>
              <li>• 不得遗弃、虐待或转送他人</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">联系方式</h3>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">领养中心开放时间：周一至周日 10:00-18:00</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{pet.shelterAddress || pet.location}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="flex-1" size="lg">
            <Phone className="h-4 w-4 mr-2" />
            联系领养中心
          </Button>
          <Button variant="outline" size="lg">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
