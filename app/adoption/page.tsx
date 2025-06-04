import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Heart, MapPin, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAllPets } from "@/lib/pets"

export default async function AdoptionPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const pets = await getAllPets()

  // 处理搜索和筛选
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const type = typeof searchParams.type === "string" ? searchParams.type : "all"

  // 筛选宠物
  const filteredPets = pets.filter((pet) => {
    // 类型筛选
    if (type !== "all" && pet.type !== (type === "dog" ? "狗" : type === "cat" ? "猫" : type)) {
      return false
    }

    // 搜索筛选
    if (
      query &&
      !pet.name.toLowerCase().includes(query.toLowerCase()) &&
      !pet.breed.toLowerCase().includes(query.toLowerCase()) &&
      !pet.location.toLowerCase().includes(query.toLowerCase())
    ) {
      return false
    }

    return true
  })

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

        <form className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input name="q" placeholder="搜索宠物品种、地区..." className="pl-9 rounded-full" defaultValue={query} />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              搜索
            </Button>
          </div>
        </form>

        <Tabs defaultValue={type} className="mb-4">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="all" asChild>
              <Link href="/adoption?type=all">全部</Link>
            </TabsTrigger>
            <TabsTrigger value="dog" asChild>
              <Link href="/adoption?type=dog">狗狗</Link>
            </TabsTrigger>
            <TabsTrigger value="cat" asChild>
              <Link href="/adoption?type=cat">猫咪</Link>
            </TabsTrigger>
            <TabsTrigger value="other" asChild>
              <Link href="/adoption?type=other">其他</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">找到 {filteredPets.length} 个结果</p>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            筛选
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <Link href={`/adoption/${pet.id}`} key={pet.id}>
                <Card className="overflow-hidden">
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
                      </div>
                      <Button size="sm" className="w-full">
                        了解详情
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">没有找到符合条件的宠物</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/adoption">查看全部宠物</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
