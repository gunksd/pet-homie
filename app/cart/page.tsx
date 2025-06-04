"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser } from "@/lib/auth"
import { getUserCart, updateCartItemQuantity, removeFromCart, clearUserCart } from "@/lib/cart"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function CartPage() {
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }

        setUser(currentUser)
        const cart = await getUserCart(currentUser.id)
        setCartItems(cart)
      } catch (error) {
        console.error("加载购物车失败:", error)
        toast.error("加载购物车失败")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating((prev) => new Set(prev).add(itemId))
    try {
      await updateCartItemQuantity(itemId, newQuantity)
      setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("更新数量失败:", error)
      toast.error("更新失败")
    } finally {
      setUpdating((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
      setCartItems((prev) => prev.filter((item) => item.id !== itemId))
      toast.success("已从购物车移除")
    } catch (error) {
      console.error("移除商品失败:", error)
      toast.error("移除失败")
    }
  }

  const handleClearCart = async () => {
    if (!user) return

    try {
      await clearUserCart(user.id)
      setCartItems([])
      toast.success("购物车已清空")
    } catch (error) {
      console.error("清空购物车失败:", error)
      toast.error("清空失败")
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Link href="/shop">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">购物车</h1>
        </div>
        {cartItems.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearCart}>
            清空
          </Button>
        )}
      </div>

      <div className="p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">购物车是空的</p>
            <Button asChild>
              <Link href="/shop">去购物</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.productImage || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      <p className="text-primary font-bold">¥{item.productPrice}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating.has(item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updating.has(item.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* 总价和结算 */}
            <Card className="sticky bottom-20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">总计:</span>
                  <span className="text-xl font-bold text-primary">¥{totalPrice.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">
                  去结算 ({cartItems.length}件商品)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
