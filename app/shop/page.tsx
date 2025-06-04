"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowLeft, Heart, Menu, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
}

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const { addItem, getTotalItems } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })

    toast({
      title: "添加成功",
      description: `${product.name} 已添加到购物车`,
    })
  }

  const products: Product[] = [
    {
      id: "1",
      name: "可爱眼镜",
      price: 10,
      category: "dog",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
      description: "时尚宠物眼镜，让您的狗狗更加可爱",
    },
    {
      id: "2",
      name: "宠物背包",
      price: 79,
      category: "cat",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
      description: "便携宠物背包，外出必备",
    },
    {
      id: "3",
      name: "新鲜胡萝卜",
      price: 15,
      category: "food",
      image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop",
      description: "新鲜有机胡萝卜，兔子最爱",
    },
    {
      id: "4",
      name: "宠物零食",
      price: 25,
      category: "food",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop",
      description: "营养丰富的宠物零食",
    },
    {
      id: "5",
      name: "猫咪玩具球",
      price: 18,
      category: "toy",
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300&h=300&fit=crop",
      description: "互动玩具球，让猫咪爱不释手",
    },
    {
      id: "6",
      name: "狗狗咬胶",
      price: 32,
      category: "toy",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
      description: "健康咬胶，保护牙齿健康",
    },
    {
      id: "7",
      name: "猫粮高级装",
      price: 89,
      category: "food",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop",
      description: "高品质猫粮，营养均衡",
    },
    {
      id: "8",
      name: "宠物项圈",
      price: 45,
      category: "dog",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
      description: "时尚宠物项圈，多种颜色可选",
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">宠物商场</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-medium mb-1">发现最好的宠物用具</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索商品..."
            className="pl-9 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
          <TabsList className="grid grid-cols-5 h-9">
            <TabsTrigger value="all">所有</TabsTrigger>
            <TabsTrigger value="dog">狗狗</TabsTrigger>
            <TabsTrigger value="cat">猫咪</TabsTrigger>
            <TabsTrigger value="food">食物</TabsTrigger>
            <TabsTrigger value="toy">玩具</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-40">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 bg-white/80 rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">¥{product.price}</span>
                  <Button size="sm" className="h-7 text-xs" onClick={() => handleAddToCart(product)}>
                    加入购物车
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">没有找到相关商品</p>
          </div>
        )}
      </div>
    </div>
  )
}
