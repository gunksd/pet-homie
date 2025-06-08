"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, MapPin, Calendar, Heart, Star, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PetReportDialog } from "@/components/pet-report-dialog"

export default function HomePage() {
  const [showReportDialog, setShowReportDialog] = useState(false)

  return (
    <div className="flex flex-col pb-20 bg-background">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-white">
              <AvatarImage src="/favicon.png" alt="管理员头像" />
              <AvatarFallback className="bg-white text-blue-600">管</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold">你好管理员</h1>
              <p className="text-sm opacity-90">今天是个照顾宠物的好日子</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-4 gap-3">
          <Link href="/ai-assistant" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/20">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-xs">AI助手</span>
          </Link>
          <Link href="/adoption" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/20">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-xs">领养</span>
          </Link>
          <Link href="/shop" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/20">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5" />
            </div>
            <span className="text-xs">商城</span>
          </Link>
          <button
            onClick={() => setShowReportDialog(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/20"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <span className="text-xs">AI报告</span>
          </button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4 space-y-6">
        {/* 我的宠物 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">我的宠物</h2>
            <Link href="/profile" className="text-sm text-primary">
              查看全部
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Card className="min-w-[140px] overflow-hidden bg-card border-border">
              <div className="relative h-24">
                <Image
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop"
                  alt="金毛"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-2">
                <h4 className="font-medium text-sm text-foreground">豆豆</h4>
                <p className="text-xs text-muted-foreground">金毛 · 2岁</p>
              </CardContent>
            </Card>
            <Card className="min-w-[140px] overflow-hidden bg-card border-border">
              <div className="relative h-24">
                <Image
                  src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop"
                  alt="橘猫"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-2">
                <h4 className="font-medium text-sm text-foreground">小橘</h4>
                <p className="text-xs text-muted-foreground">橘猫 · 1岁</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 今日提醒 */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">今日提醒</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">豆豆疫苗接种</h3>
                  <p className="text-sm text-muted-foreground">今天下午 2:00 · 爱宠医院</p>
                </div>
                <Badge variant="secondary">待完成</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 附近服务 */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">附近服务</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">爱宠医院</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">距离 500m · 营业中</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-muted-foreground">4.8分</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">宠物美容店</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">距离 800m · 营业中</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-muted-foreground">4.6分</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 推荐文章 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">推荐阅读</h2>
            <Link href="/news" className="text-sm text-primary">
              更多文章
            </Link>
          </div>
          <Link href="/news/5">
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop"
                      alt="春季宠物护理"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-foreground mb-1">春季宠物护理指南</h3>
                    <p className="text-xs text-muted-foreground mb-2">春天来了，如何为你的宠物做好季节性护理...</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>宠物专家</span>
                      <span>·</span>
                      <span>2小时前</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      </div>

      <PetReportDialog open={showReportDialog} onOpenChange={setShowReportDialog} />
    </div>
  )
}
