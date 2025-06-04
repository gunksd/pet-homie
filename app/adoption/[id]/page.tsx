"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Heart, Share2, MapPin, Phone, MessageCircle, Mail } from "lucide-react"
import Link from "next/link"
import { getAdoptionPetById, submitAdoptionApplication } from "@/lib/adoption"
import { getCurrentUser } from "@/lib/auth"
import { addLike, removeLike, isLiked } from "@/lib/likes"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdoptionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const petId = params.id as string

  const [pet, setPet] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [applicationLoading, setApplicationLoading] = useState(false)
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)

  // 申请表单数据
  const [applicationForm, setApplicationForm] = useState({
    reason: "",
    experience: "",
    livingCondition: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [petData, currentUser] = await Promise.all([getAdoptionPetById(petId), getCurrentUser()])

        if (!petData) {
          router.push("/adoption")
          return
        }

        if (!currentUser) {
          router.push("/auth/login")
          return
        }

        setPet(petData)
        setUser(currentUser)

        const userLiked = await isLiked(currentUser.id, petId)
        setLiked(userLiked)

        // 预填用户信息
        setApplicationForm((prev) => ({
          ...prev,
          phone: currentUser.phone || "",
          email: currentUser.email || "",
        }))
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

    try {
      if (liked) {
        await removeLike(user.id, petId)
        setLiked(false)
        toast.success("取消收藏")
      } else {
        await addLike(user.id, petId, "adoption")
        setLiked(true)
        toast.success("收藏成功")
      }
    } catch (error) {
      console.error("收藏操作失败:", error)
      toast.error("操作失败")
    }
  }

  const handleSubmitApplication = async () => {
    if (!user || !pet) return

    if (!applicationForm.reason.trim() || !applicationForm.phone.trim()) {
      toast.error("请填写必要信息")
      return
    }

    setApplicationLoading(true)
    try {
      await submitAdoptionApplication({
        petId: pet.id,
        applicantId: user.id,
        applicantName: user.name,
        applicantPhone: applicationForm.phone,
        applicantEmail: applicationForm.email,
        reason: applicationForm.reason,
        experience: applicationForm.experience,
        livingCondition: applicationForm.livingCondition,
      })

      toast.success("申请提交成功！我们会尽快联系您")
      setShowApplicationDialog(false)
    } catch (error) {
      console.error("提交申请失败:", error)
      toast.error("提交申请失败")
    } finally {
      setApplicationLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `领养${pet.name}`,
          text: `${pet.name}正在寻找温暖的家，${pet.description}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("分享取消")
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      toast.success("链接已复制到剪贴板")
    }
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
          <Link href="/adoption">返回领养页面</Link>
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
          <h1 className="text-lg font-medium">{pet.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleLike}>
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 宠物基本信息 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={pet.image || "/placeholder.svg"} alt={pet.name} />
                  <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{pet.name}</h2>
                  <Badge variant="secondary">
                    {pet.type === "dog" ? "🐕 狗狗" : pet.type === "cat" ? "🐱 猫咪" : "🐾 其他"}
                  </Badge>
                </div>

                <p className="text-lg text-muted-foreground mb-3">{pet.breed}</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">年龄：</span>
                    <span>{pet.age}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">性别：</span>
                    <span>{pet.gender === "male" ? "雄性" : "雌性"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{pet.location}</span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* 健康状态 */}
            <div className="flex gap-2 mb-4">
              {pet.vaccinated && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">已疫苗</Badge>}
              {pet.sterilized && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">已绝育</Badge>}
              {pet.adoptionFee === 0 && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">免费领养</Badge>
              )}
            </div>

            {/* 领养费用 */}
            {pet.adoptionFee !== undefined && pet.adoptionFee > 0 && (
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">领养费用：</span>
                <span className="text-lg font-bold text-orange-600">¥{pet.adoptionFee}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 详细描述 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">关于{pet.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
          </CardContent>
        </Card>

        {/* 领养要求 */}
        {pet.requirements && pet.requirements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">领养要求</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pet.requirements.map((requirement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* 联系信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">联系方式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{pet.contactInfo.phone}</span>
              </div>
              {pet.contactInfo.wechat && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{pet.contactInfo.wechat}</span>
                </div>
              )}
              {pet.contactInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{pet.contactInfo.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 发布者信息 */}
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>发布者: {pet.publisherName}</p>
              <p>发布时间: {new Date(pet.createdAt).toLocaleString("zh-CN")}</p>
            </div>
          </CardContent>
        </Card>

        {/* 申请领养按钮 */}
        <div className="fixed bottom-20 left-4 right-4 z-10">
          <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full">
                申请领养{pet.name}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>申请领养{pet.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">联系电话 *</Label>
                  <Input
                    id="phone"
                    value={applicationForm.phone}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="请输入您的联系电话"
                  />
                </div>
                <div>
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationForm.email}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="请输入您的邮箱地址"
                  />
                </div>
                <div>
                  <Label htmlFor="reason">领养原因 *</Label>
                  <Textarea
                    id="reason"
                    value={applicationForm.reason}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="请说明您想要领养这只宠物的原因"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">养宠经验</Label>
                  <Textarea
                    id="experience"
                    value={applicationForm.experience}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, experience: e.target.value }))}
                    placeholder="请描述您的养宠经验"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="livingCondition">居住环境</Label>
                  <Textarea
                    id="livingCondition"
                    value={applicationForm.livingCondition}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, livingCondition: e.target.value }))}
                    placeholder="请描述您的居住环境"
                    rows={2}
                  />
                </div>
                <Button onClick={handleSubmitApplication} disabled={applicationLoading} className="w-full">
                  {applicationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      提交中...
                    </>
                  ) : (
                    "提交申请"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
