import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function OrdersPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const orders = [
    {
      id: "20250530001",
      items: [
        {
          name: "宠物智能饮水器",
          image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop",
          quantity: 1,
          price: 199,
        },
        {
          name: "宠物零食大礼包",
          image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&h=100&fit=crop",
          quantity: 2,
          price: 89,
        },
      ],
      total: 377,
      status: "已送达",
      date: "2025-05-30",
    },
    {
      id: "20250602002",
      items: [
        {
          name: "猫咪玩具套装",
          image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop",
          quantity: 1,
          price: 129,
        },
      ],
      total: 129,
      status: "配送中",
      date: "2025-06-02",
    },
    {
      id: "20250604003",
      items: [
        {
          name: "宠物营养膏",
          image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&h=100&fit=crop",
          quantity: 3,
          price: 45,
        },
      ],
      total: 135,
      status: "待发货",
      date: "2025-06-04",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已送达":
        return "bg-green-100 text-green-700"
      case "配送中":
        return "bg-blue-100 text-blue-700"
      case "待发货":
        return "bg-yellow-100 text-yellow-700"
      case "已取消":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/profile" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">订单记录</h1>
      </div>

      <div className="p-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无订单记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">订单号：{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            ¥{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-medium">总计：¥{order.total}</span>
                    <div className="flex gap-2">
                      {order.status === "配送中" && (
                        <Button variant="outline" size="sm">
                          查看物流
                        </Button>
                      )}
                      {order.status === "已送达" && (
                        <Button variant="outline" size="sm">
                          再次购买
                        </Button>
                      )}
                      {order.status === "待发货" && (
                        <Button variant="outline" size="sm">
                          取消订单
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
