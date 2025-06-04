"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, Share2, Calendar, Weight, Download } from "lucide-react"
import Link from "next/link"
import { getPetById } from "@/lib/pets"
import { getCurrentUser } from "@/lib/auth"
import { addLike, removeLike, isLiked, getLikeCount } from "@/lib/likes"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function PetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const petId = params.id as string

  const [pet, setPet] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [petData, currentUser] = await Promise.all([getPetById(petId), getCurrentUser()])

        if (!petData) {
          router.push("/profile")
          return
        }

        setPet(petData)
        setUser(currentUser)

        if (currentUser) {
          const [userLiked, count] = await Promise.all([isLiked(currentUser.id, petId), getLikeCount(petId)])
          setLiked(userLiked)
          setLikeCount(count)
        }
      } catch (error) {
        console.error("加载宠物详情失败:", error)
        toast.error("加载宠物详情失败")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [petId, router])

  const handleLike = async () => {
    if (!user) {
      toast.error("请先登录")
      return
    }

    setLikeLoading(true)
    try {
      if (liked) {
        await removeLike(user.id, petId)
        setLiked(false)
        setLikeCount((prev) => prev - 1)
        toast.success("取消点赞")
      } else {
        await addLike(user.id, petId, "pet")
        setLiked(true)
        setLikeCount((prev) => prev + 1)
        toast.success("点赞成功")
      }
    } catch (error) {
      console.error("点赞操作失败:", error)
      toast.error("操作失败")
    } finally {
      setLikeLoading(false)
    }
  }

  const handleExportData = () => {
    if (!pet) return

    const exportData = {
      基本信息: {
        姓名: pet.name,
        类型: pet.type === "dog" ? "狗狗" : pet.type === "cat" ? "猫咪" : "其他",
        品种: pet.breed,
        年龄: pet.age,
        体重: pet.weight,
        性别: pet.gender === "male" ? "雄性" : "雌性",
        描述: pet.description || "无",
      },
      健康记录: {
        病史: pet.medicalHistory || [],
        疫苗记录: pet.vaccinations || [],
      },
      创建时间: new Date(pet.createdAt).toLocaleString("zh-CN"),
      更新时间: new Date(pet.updatedAt).toLocaleString("zh-CN"),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${pet.name}_宠物数据.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("数据导出成功")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">宠物不存在</p>
        <Button asChild>
          <Link href="/profile">返回个人中心</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-20">
      {/* 头部导航 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">{pet.name}的详情</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleExportData}>
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 宠物头像和基本信息 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={
                      pet.avatar ||
                      (pet.type === "dog"
                        ? "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop"
                        : "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop")
                    }
                    alt={pet.name}
                  />
                  <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold">{pet.name}</h2>
                  <Badge variant="secondary">
                    {pet.type === "dog" ? "🐕 狗狗" : pet.type === "cat" ? "🐱 猫咪" : "🐾 其他"}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-3">{pet.breed}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{pet.age}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Weight className="h-4 w-4" />
                    <span>{pet.weight}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{pet.gender === "male" ? "♂️ 雄性" : "♀️ 雌性"}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* 点赞和分享 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  disabled={likeLoading}
                  className="flex items-center gap-2"
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  <span>{likeCount}</span>
                </Button>
              </div>

              {user && user.id === pet.userId && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/pets/${pet.id}/edit`}>编辑信息</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 详细描述 */}
        {pet.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">关于{pet.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
            </CardContent>
          </Card>
        )}

        {/* 健康记录 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">健康记录</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 病史记录 */}
            <div>
              <h4 className="font-medium mb-2">病史记录</h4>
              {pet.medicalHistory && pet.medicalHistory.length > 0 ? (
                <div className="space-y-2">
                  {pet.medicalHistory.map((record: string, index: number) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{record}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">暂无病史记录</p>
              )}
            </div>

            <Separator />

            {/* 疫苗记录 */}
            <div>
              <h4 className="font-medium mb-2">疫苗记录</h4>
              {pet.vaccinations && pet.vaccinations.length > 0 ? (
                <div className="space-y-2">
                  {pet.vaccinations.map((vaccination: any, index: number) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{vaccination.name}</p>
                          <p className="text-xs text-muted-foreground">
                            接种日期: {new Date(vaccination.date).toLocaleDateString("zh-CN")}
                          </p>
                          {vaccination.nextDue && (
                            <p className="text-xs text-muted-foreground">
                              下次接种: {new Date(vaccination.nextDue).toLocaleDateString("zh-CN")}
                            </p>
                          )}
                          {vaccination.veterinarian && (
                            <p className="text-xs text-muted-foreground">兽医: {vaccination.veterinarian}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">暂无疫苗记录</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 时间信息 */}
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>创建时间: {new Date(pet.createdAt).toLocaleString("zh-CN")}</p>
              <p>更新时间: {new Date(pet.updatedAt).toLocaleString("zh-CN")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
