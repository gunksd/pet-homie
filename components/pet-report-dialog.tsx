"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Share, Printer, X, ChevronRight, Calendar, FileText } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 模拟历史报告数据
const historyReports = [
  {
    id: "1",
    petName: "豆豆",
    petType: "狗",
    reportType: "健康评估",
    date: "2025-06-05",
    summary: "整体健康状况良好，建议增加运动量",
    report:
      "# 🐾 豆豆的健康评估报告\n\n## 📋 基本信息\n- **姓名：** 豆豆\n- **种类：** 狗（金毛）\n- **年龄：** 2岁\n- **体重：** 25公斤\n- **上次体检：** 3个月前\n- **评估日期：** 2025-06-05\n\n## 🔍 当前状况分析\n根据观察，豆豆目前食欲有所下降，偶尔咳嗽，但精神状态良好。这种情况可能与季节变化有关，但仍需密切关注。\n\n## ⚠️ 可能的健康问题\n- 轻微呼吸道感染\n- 季节性过敏\n- 饮食习惯变化\n\n## 🧪 建议检查项目\n- 常规血液检查\n- 呼吸系统检查\n- 过敏原测试\n\n## 💊 护理建议\n- 保持环境清洁，减少过敏原\n- 增加运动量，每天至少30分钟散步\n- 观察饮食情况，确保营养均衡\n\n## 🚨 紧急程度评估\n当前症状为轻微，无需紧急就医，但建议一周内进行常规检查。\n\n## 📝 日常护理要点\n- 定期梳理毛发，保持皮肤健康\n- 保证充足饮水\n- 定期驱虫\n\n## 📞 后续建议\n建议两周后复查，如症状加重请立即就医。",
  },
  {
    id: "2",
    petName: "小橘",
    petType: "猫",
    reportType: "护理建议",
    date: "2025-06-03",
    summary: "毛发状况需要改善，建议调整饮食",
    report:
      "# 💝 小橘的专属护理方案\n\n## 🏠 日常护理\n\n### 🧼 清洁护理\n- 每周洗澡1次，使用猫咪专用洗发水\n- 每天梳理毛发，减少毛球形成\n\n### 🦷 口腔护理\n- 每周刷牙2-3次，使用宠物专用牙刷和牙膏\n- 提供磨牙棒，帮助清洁牙齿\n\n### 💅 指甲护理\n- 每两周修剪一次指甲，注意不要剪到血管\n\n## 🍎 营养管理\n\n### 🥘 饮食搭配\n- 选择优质猫粮，确保蛋白质含量充足\n- 添加适量湿粮，增加水分摄入\n- 每天少量多餐，避免暴饮暴食\n\n### 💧 水分管理\n- 提供清洁的饮水，每天更换\n- 考虑使用流动饮水器，刺激饮水欲望\n\n## 🎾 运动锻炼\n\n### 🏃 运动需求\n- 每天安排15-20分钟的互动游戏\n- 提供攀爬架和猫抓板\n\n### 🎮 智力游戏\n- 使用益智玩具，刺激猫咪思考\n- 藏食游戏，增加进食乐趣\n\n## 🏥 预防保健\n\n### 💉 疫苗计划\n- 按时接种三联疫苗和狂犬疫苗\n- 每年进行一次全面体检\n\n### 🐛 驱虫防护\n- 每3个月进行一次体内驱虫\n- 每月使用体外驱虫产品",
  },
  {
    id: "3",
    petName: "豆豆",
    petType: "狗",
    reportType: "完整健康报告",
    date: "2025-05-20",
    summary: "体检结果正常，需要注意牙齿清洁",
    report:
      "# 🐾 豆豆的健康评估报告\n\n## 📋 基本信息\n- **姓名：** 豆豆\n- **种类：** 狗（金毛）\n- **年龄：** 2岁\n- **体重：** 24.5公斤\n- **上次体检：** 6个月前\n- **评估日期：** 2025-05-20\n\n## 🔍 体检结果分析\n豆豆的整体健康状况良好，各项指标在正常范围内。体重适中，被毛有光泽，精神状态活跃。\n\n## ⚠️ 需要关注的问题\n- 轻度牙结石\n- 右耳有少量耳垢堆积\n\n## 🧪 检查项目及结果\n- 血常规：正常\n- 生化指标：正常\n- 心肺功能：良好\n- 消化系统：正常\n- 运动系统：关节灵活，无异常\n\n## 💊 医生建议\n- 加强牙齿清洁，每周刷牙2-3次\n- 定期清理耳道，预防耳道感染\n- 保持均衡饮食，控制零食摄入\n\n## 🚨 预防保健计划\n- 三个月后进行驱虫\n- 六个月后进行年度疫苗接种\n- 一年后进行全面体检\n\n## 📝 日常观察要点\n- 观察排便情况，保持规律\n- 注意饮水量变化\n- 监测活动量和精神状态\n\n## 📞 复诊安排\n建议三个月后复查牙齿情况，评估清洁效果。",
  },
]

interface PetReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report?: string
  petName?: string
}

export function PetReportDialog({ open, onOpenChange, report, petName }: PetReportDialogProps) {
  const { toast } = useToast()
  const [selectedReport, setSelectedReport] = useState<{ id: string; report: string; petName: string } | null>(null)

  // 如果传入了report和petName，则直接显示报告内容
  const showReportContent = report || selectedReport

  const handleDownload = () => {
    const reportText = report || selectedReport?.report || ""
    const reportName = petName || selectedReport?.petName || "宠物"

    const blob = new Blob([reportText], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportName}_健康报告_${new Date().toLocaleDateString("zh-CN")}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "下载成功",
      description: "报告已保存到您的设备",
    })
  }

  const handleShare = async () => {
    const reportText = report || selectedReport?.report || ""

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${petName || selectedReport?.petName || "宠物"}的健康报告`,
          text: reportText,
        })
      } catch (error) {
        console.log("分享取消")
      }
    } else {
      try {
        await navigator.clipboard.writeText(reportText)
        toast({
          title: "已复制到剪贴板",
          description: "您可以粘贴到其他应用中分享",
        })
      } catch (error) {
        toast({
          title: "复制失败",
          description: "请手动复制报告内容",
          variant: "destructive",
        })
      }
    }
  }

  const handlePrint = () => {
    const reportText = report || selectedReport?.report || ""
    const reportName = petName || selectedReport?.petName || "宠物"

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${reportName}的健康报告</title>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              h1 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
              h2 { color: #1f2937; margin-top: 30px; }
              h3 { color: #374151; }
              ul, ol { padding-left: 20px; }
              li { margin-bottom: 5px; }
              strong { font-weight: 600; }
              em { font-style: italic; }
              hr { margin: 20px 0; border: none; border-top: 1px solid #e5e7eb; }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div id="content">${reportText
              .replace(/^# (.*$)/gm, "<h1>$1</h1>")
              .replace(/^## (.*$)/gm, "<h2>$1</h2>")
              .replace(/^### (.*$)/gm, "<h3>$1</h3>")
              .replace(/^\* (.*$)/gm, "<li>$1</li>")
              .replace(/^- (.*$)/gm, "<li>$1</li>")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/^---$/gm, "<hr>")
              .replace(/\n/g, "<br>")}</div>
            <div class="footer">
              <p>生成时间：${new Date().toLocaleString("zh-CN")}</p>
              <p>宠物妙妙屋 - AI健康助手</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleSelectReport = (id: string) => {
    const report = historyReports.find((r) => r.id === id)
    if (report) {
      setSelectedReport({
        id: report.id,
        report: report.report,
        petName: report.petName,
      })
    }
  }

  const handleBackToList = () => {
    setSelectedReport(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen)
        if (!newOpen) {
          setSelectedReport(null)
        }
      }}
    >
      <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col" hideCloseButton>
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {showReportContent ? (
                <>🐾 {petName || selectedReport?.petName || "宠物"}的健康报告</>
              ) : (
                <>📋 历史报告记录</>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {showReportContent && (
                <>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    下载
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-1" />
                    分享
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-1" />
                    打印
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {showReportContent ? (
              <div className="px-6 py-4">
                {selectedReport && !report && (
                  <Button variant="ghost" size="sm" onClick={handleBackToList} className="mb-4 hover:bg-blue-50">
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    返回列表
                  </Button>
                )}
                <MarkdownRenderer content={report || selectedReport?.report || ""} />
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {historyReports.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleSelectReport(item.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              item.petType === "狗"
                                ? "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop&crop=face"
                                : "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop&crop=face"
                            }
                            alt={item.petName}
                          />
                          <AvatarFallback>{item.petName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {item.petName} - {item.reportType}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{item.date}</span>
                              </div>
                            </div>
                            <FileText className="h-5 w-5 text-blue-500" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{item.summary}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>共 {historyReports.length} 份报告</span>
            <span>宠物妙妙屋 - AI健康助手</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
