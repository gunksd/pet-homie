"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const { toast } = useToast()

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "购物车为空",
        description: "请先添加商品到购物车",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "订单提交成功",
      description: "您的订单已提交，我们会尽快处理",
    })

    clearCart()
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col pb-20">
        <div className="flex items-center p-4 border-b">
          <Link href="/shop" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">购物车</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium mb-2">购物车是空的</h2>
          <p className="text-muted-foreground mb-6">快去挑选您喜欢的商品吧</p>
          <Button asChild>
            <Link href="/shop">去购物</Link>
          </Button>
        </div>
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
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600">
          清空
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">¥{item.price}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="sticky bottom-24">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">总计</span>
              <span className="text-xl font-bold text-primary">¥{getTotalPrice().toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              立即结算
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
