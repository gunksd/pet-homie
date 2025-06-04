"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Heart, MapPin, Filter, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAdoptionPets, searchAdoptionPets, type AdoptionPet } from "@/lib/adoption"
import { addLike, removeLike, isLiked } from "@/lib/likes"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdoptionPage() {
  const [user, setUser] = useState<any>(null)
  const [pets, setPets] = useState<AdoptionPet[]>([])
  const [filteredPets, setFilteredPets] = useState<AdoptionPet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [likedPets, setLikedPets] = useState<Set<string>>(new Set())

  // 搜索和筛选状态
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [vaccinatedOnly, setVaccinatedOnly] = useState(false)
  const [sterilizedOnly, setSterilizedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [currentUser, adoptionPets] = await Promise.all([getCurrentUser(), getAdoptionPets()])

        if (!currentUser) {
          redirect("/auth/login")
          return
        }

        setUser(currentUser)
        setPets(adoptionPets)
        setFilteredPets(adoptionPets)

        // 加载用户的点赞状态
        const likedSet = new Set<string>()
        for (const pet of adoptionPets) {
          const liked = await isLiked(currentUser.id, pet.id)
          if (liked) {
            likedSet.add(pet.id)
          }
        }
        setLikedPets(likedSet)
      } catch (error) {
        console.error("加载领养数据失败:", error)
        toast.error("加载数据失败")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 搜索和筛选
  useEffect(() => {
    async function performSearch() {
      if (!pets.length) return

      setSearchLoading(true)
      try {
        const results = await searchAdoptionPets({
          query: searchQuery,
          type: selectedType === "all" ? undefined : selectedType,
          location: selectedLocation,
          vaccinated: vaccinatedOnly ? true : undefined,
          sterilized: sterilizedOnly ? true : undefined,
        })
        setFilteredPets(results)
      } catch (error) {
        console.error("搜索失败:", error)
        toast.error("搜索失败")
      } finally {
        setSearchLoading(false)
      }
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, selectedType, selectedLocation, vaccinatedOnly, sterilizedOnly, pets])

  const handleLike = async (petId: string) => {
    if (!user) {
      toast.error("请先登录")
      return
    }

    try {
      const isCurrentlyLiked = likedPets.has(petId)

      if (isCurrentlyLiked) {
        await removeLike(user.id, petId)
        setLikedPets((prev) => {
          const newSet = new Set(prev)
          newSet.delete(petId)
          return newSet
        })
        toast.success("取消收藏")
      } else {
        await addLike(user.id, petId, "adoption")
        setLikedPets((prev) => new Set(prev).add(petId))
        toast.success("收藏成功")
      }
    } catch (error) {
      console.error("收藏操作失败:", error)
      toast.error("操作失败")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedLocation("")
    setVaccinatedOnly(false)
    setSterilizedOnly(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

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

        {/* 搜索栏 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索宠物品种、地区..."
            className="pl-9 pr-12 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* 类型标签 */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-4">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="dog">狗狗</TabsTrigger>
            <TabsTrigger value="cat">猫咪</TabsTrigger>
            <TabsTrigger value="other">其他</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 高级筛选 */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">筛选条件</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  清除
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="location">地区</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择地区" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部地区</SelectItem>
                      <SelectItem value="北京">北京</SelectItem>
                      <SelectItem value="上海">上海</SelectItem>
                      <SelectItem value="广州">广州</SelectItem>
                      <SelectItem value="深圳">深圳</SelectItem>
                      <SelectItem value="杭州">杭州</SelectItem>
                      <SelectItem value="成都">成都</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="vaccinated">仅显示已疫苗</Label>
                  <Switch id="vaccinated" checked={vaccinatedOnly} onCheckedChange={setVaccinatedOnly} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sterilized">仅显示已绝育</Label>
                  <Switch id="sterilized" checked={sterilizedOnly} onCheckedChange={setSterilizedOnly} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 搜索结果统计 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {searchLoading ? "搜索中..." : `找到 ${filteredPets.length} 只宠物`}
          </p>
        </div>

        {/* 宠物列表 */}
        <div className="grid grid-cols-1 gap-4">
          {searchLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">没有找到符合条件的宠物</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={clearFilters}>
                清除筛选条件
              </Button>
            </div>
          ) : (
            filteredPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden">
                <div className="flex">
                  <div className="relative w-32 h-32">
                    <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7 bg-white/80 rounded-full"
                      onClick={() => handleLike(pet.id)}
                    >
                      <Heart className={`h-4 w-4 ${likedPets.has(pet.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                  <CardContent className="flex-1 p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pet.breed} · {pet.gender === "male" ? "雄性" : "雌性"} · {pet.age}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-2 line-clamp-2">{pet.description}</p>
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
                      {pet.adoptionFee === 0 && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">免费领养</span>
                      )}
                    </div>
                    <Button size="sm" className="w-full" asChild>
                      <Link href={`/adoption/${pet.id}`}>了解详情</Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
