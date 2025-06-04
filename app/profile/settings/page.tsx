import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ChevronRight, Bell, Shield, Palette, Globe, HelpCircle } from "lucide-react"
import Link from "next/link"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/profile" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">设置</h1>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">推送通知</p>
                <p className="text-sm text-muted-foreground">接收重要消息和更新</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">消息通知</p>
                <p className="text-sm text-muted-foreground">新消息提醒</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">活动推荐</p>
                <p className="text-sm text-muted-foreground">宠物活动和优惠信息</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5" />
              隐私与安全
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/profile/settings/privacy"
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <span>隐私设置</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/profile/settings/password"
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <span>修改密码</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/profile/settings/security"
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <span>账户安全</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-5 w-5" />
              外观设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">深色模式</p>
                <p className="text-sm text-muted-foreground">切换应用主题</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-5 w-5" />
              通用设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/profile/settings/language"
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <span>语言设置</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">简体中文</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
            <Link
              href="/profile/settings/storage"
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <span>存储管理</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              帮助与支持
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/profile/settings/help"
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <span>帮助中心</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/profile/settings/feedback"
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <span>意见反馈</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/profile/settings/about"
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
            >
              <span>关于我们</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
