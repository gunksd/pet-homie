"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Sparkles, AlertCircle, FileText, Activity, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { generatePetReport } from "@/lib/ai"
import { generateHealthAssessment, generateCareAdvice } from "@/lib/ai-features"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PetReportDialog } from "@/components/pet-report-dialog"

// 预设的用户宠物数据
const userPets = [
  {
    name: "豆豆",
    type: "狗",
    breed: "金毛",
    age: "2岁",
    symptoms: "最近食欲有所下降，偶尔咳嗽，但精神状态还算良好，喜欢玩耍",
    weight: "25公斤",
    lastCheckup: "3个月前",
  },
  {
    name: "小橘",
    type: "猫",
    breed: "橘猫",
    age: "1岁",
    symptoms: "毛发有些干燥，偶尔打喷嚏，食欲正常，活泼好动",
    weight: "4.5公斤",
    lastCheckup: "6个月前",
  },
]

export default function AIAssistantPage() {
  const [loading, setLoading] = useState(false)
  const [selectedPetIndex, setSelectedPetIndex] = useState(0)
  const [report, setReport] = useState("")
  const [error, setError] = useState("")
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("开始生成健康报告...", { selectedPetIndex })
      const result = await generatePetReport(selectedPetIndex)
      setReport(result)
      setDialogTitle(`${userPets[selectedPetIndex].name}的健康报告`)
      setShowReportDialog(true)
      toast({
        title: "报告生成成功",
        description: "AI健康报告已生成完成",
      })
    } catch (error) {
      console.error("生成报告失败:", error)
      const errorMessage = error instanceof Error ? error.message : "生成报告时发生未知错误"
      setError(errorMessage)
      toast({
        title: "生成报告失败",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleHealthAssessment = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("开始生成健康评估...")
      const selectedPet = userPets[selectedPetIndex]
      const result = await generateHealthAssessment(selectedPet.name, selectedPet.type)
      setReport(result)
      setDialogTitle(`${selectedPet.name}的健康评估`)
      setShowReportDialog(true)
      toast({
        title: "健康评估生成成功",
        description: "专业健康评估指南已生成",
      })
    } catch (error) {
      console.error("生成健康评估失败:", error)
      const errorMessage = error instanceof Error ? error.message : "生成健康评估时发生未知错误"
      setError(errorMessage)
      toast({
        title: "生成失败",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCareAdvice = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("开始生成护理建议...")
      const selectedPet = userPets[selectedPetIndex]
      const result = await generateCareAdvice(selectedPet.name, selectedPet.type)
      setReport(result)
      setDialogTitle(`${selectedPet.name}的护理建议`)
      setShowReportDialog(true)
      toast({
        title: "护理建议生成成功",
        description: "个性化护理方案已生成",
      })
    } catch (error) {
      console.error("生成护理建议失败:", error)
      const errorMessage = error instanceof Error ? error.message : "生成护理建议时发生未知错误"
      setError(errorMessage)
      toast({
        title: "生成失败",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedPet = userPets[selectedPetIndex]

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">AI宠物助手</h1>
      </div>

      <div className="p-4">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              选择您的宠物
            </CardTitle>
            <p className="text-sm text-muted-foreground">为您的宠物生成专业的AI分析</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="grid gap-3">
                  {userPets.map((pet, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all ${
                        selectedPetIndex === index ? "ring-2 ring-primary bg-blue-50" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedPetIndex(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src={
                                pet.type === "狗"
                                  ? "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop&crop=face"
                                  : "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop&crop=face"
                              }
                              alt={pet.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{pet.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {pet.breed} · {pet.age} · {pet.weight}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">上次体检：{pet.lastCheckup}</p>
                          </div>
                          {selectedPetIndex === index && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">当前状况</h4>
                <p className="text-sm text-muted-foreground">{selectedPet.symptoms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>错误详情：</strong>
              <br />
              {error}
              <br />
              <br />
              <strong>可能的解决方案：</strong>
              <br />
              1. 检查网络连接是否正常
              <br />
              2. 确认API密钥是否有效
              <br />
              3. 稍后再试或联系技术支持
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">AI助手功能</h2>
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">完整健康报告</h3>
                    <p className="text-sm text-muted-foreground">基于症状生成专业的健康评估报告</p>
                  </div>
                  <Button onClick={handleGenerateReport} disabled={loading} className="min-w-20">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "生成"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">健康评估</h3>
                    <p className="text-sm text-muted-foreground">日常健康检查指南和异常信号识别</p>
                  </div>
                  <Button onClick={handleHealthAssessment} disabled={loading} variant="outline" className="min-w-20">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "评估"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">护理建议</h3>
                    <p className="text-sm text-muted-foreground">个性化的日常护理和营养管理方案</p>
                  </div>
                  <Button onClick={handleCareAdvice} disabled={loading} variant="outline" className="min-w-20">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "建议"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">常见问题</h2>
          <div className="space-y-3">
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardContent className="p-3">
                <p className="text-sm">我的狗狗不爱吃东西怎么办？</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardContent className="p-3">
                <p className="text-sm">猫咪掉毛严重是什么原因？</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardContent className="p-3">
                <p className="text-sm">宠物疫苗接种时间表</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 报告弹窗 */}
      <PetReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        report={report}
        petName={dialogTitle}
      />
    </div>
  )
}
