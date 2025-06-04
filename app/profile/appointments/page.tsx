import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default async function AppointmentsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const appointments = [
    {
      id: "1",
      type: "体检",
      doctor: "陈医生",
      pet: "豆豆",
      date: "2025-05-28",
      time: "14:00",
      location: "宠物医院(朝阳店)",
      status: "已完成",
    },
    {
      id: "2",
      type: "疫苗接种",
      doctor: "李医生",
      pet: "小橘",
      date: "2025-06-08",
      time: "10:30",
      location: "宠物医院(海淀店)",
      status: "已预约",
    },
    {
      id: "3",
      type: "美容护理",
      doctor: "美容师小王",
      pet: "豆豆",
      date: "2025-06-12",
      time: "16:00",
      location: "宠物美容店",
      status: "已预约",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-700"
      case "已预约":
        return "bg-blue-100 text-blue-700"
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
        <h1 className="text-lg font-medium">预约记录</h1>
      </div>

      <div className="p-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无预约记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{appointment.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor} · {appointment.pet}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
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
