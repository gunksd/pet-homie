"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addToCart, getCartItems } from "@/lib/cart"
import { toggleLike, getLikes } from "@/lib/likes"
import { toast } from "sonner"
import Link from "next/link"

const products = [
  {
    id: "1",
    name: "高级狗粮",
    price: 128,
    originalPrice: 158,
    image: "/placeholder.svg?height=200&width=200",
    category: "食品",
    brand: "皇家",
    rating: 4.8,
    sales: 1234,
    description: "营养均衡，适合成犬",
  },
  {
    id: "2",
    name: "猫咪玩具套装",
    price: 68,
    originalPrice: 88,
    image: "/placeholder.svg?height=200&width=200",
    category: "玩具",
    brand: "宠趣",
    rating: 4.6,
    sales: 856,
    description: "多种玩具，让猫咪更快乐",
  },
  {
    id: "3",
    name: "宠物洗护套装",
    price: 89,
    originalPrice: 120,
    image: "/placeholder.svg?height=200&width=200",
    category: "洗护",
    brand: "洁宠",
    rating: 4.7,
    sales: 642,
    description: "温和配方，呵护宠物肌肤",
  },
  {
    id: "4",
    name: "智能饮水器",
    price: 199,
    originalPrice: 259,
    image: "/placeholder.svg?height=200&width=200",
    category: "用品",
    brand: "智宠",
    rating: 4.9,
    sales: 423,
    description: "循环过滤，保持水质新鲜",
  },
]

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [sortBy, setSortBy] = useState("推荐")
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    loadLikes()
    loadCartCount()
  }, [])

  const loadLikes = async () => {
    try {
      const likes = await getLikes("user123") // 实际应用中从认证系统获取用户ID
      const productLikes = likes.filter((like) => like.type === "product")
      setLikedItems(new Set(productLikes.map((like) => like.targetId)))
    } catch (error) {
      console.error("加载点赞数据失败:", error)
    }
  }

  const loadCartCount = async () => {
    try {
      const cartItems = await getCartItems("user123")
      const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalCount)
    } catch (error) {
      console.error("加载购物车数据失败:", error)
    }
  }

  const handleAddToCart = async (product: (typeof products)[0]) => {
    try {
      await addToCart("user123", {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
      await loadCartCount()
      toast.success("已添加到购物车")
    } catch (error) {
      toast.error("添加失败，请重试")
    }
  }

  const handleToggleLike = async (productId: string) => {
    try {
      await toggleLike("user123", productId, "product")
      await loadLikes()
      const isLiked = likedItems.has(productId)
      toast.success(isLiked ? "已取消点赞" : "已点赞")
    } catch (error) {
      toast.error("操作失败，请重试")
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "价格从低到高":
        return a.price - b.price
      case "价格从高到低":
        return b.price - a.price
      case "销量":
        return b.sales - a.sales
      case "评分":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* 头部搜索栏 */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索商品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        {/* 筛选栏 */}
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              <SelectItem value="食品">食品</SelectItem>
              <SelectItem value="玩具">玩具</SelectItem>
              <SelectItem value="洗护">洗护</SelectItem>
              <SelectItem value="用品">用品</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="推荐">推荐</SelectItem>
              <SelectItem value="价格从低到高">价格从低到高</SelectItem>
              <SelectItem value="价格从高到低">价格从高到低</SelectItem>
              <SelectItem value="销量">销量</SelectItem>
              <SelectItem value="评分">评分</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                  onClick={() => handleToggleLike(product.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${likedItems.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                  />
                </Button>
                {product.originalPrice > product.price && (
                  <Badge className="absolute top-2 left-2 bg-red-500">特价</Badge>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-lg font-bold text-red-500">¥{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-muted-foreground line-through">¥{product.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>⭐ {product.rating}</span>
                  <span>已售 {product.sales}</span>
                </div>
                <Button size="sm" className="w-full" onClick={() => handleAddToCart(product)}>
                  加入购物车
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && <div className="text-center py-8 text-muted-foreground">没有找到相关商品</div>}
      </div>
    </div>
  )
}
