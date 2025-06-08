"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Share, Printer, X } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { useToast } from "@/components/ui/use-toast"

interface PetReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: string
  petName: string
}

export function PetReportDialog({ open, onOpenChange, report, petName }: PetReportDialogProps) {
  const { toast } = useToast()

  const handleDownload = () => {
    const blob = new Blob([report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${petName}_健康报告_${new Date().toLocaleDateString("zh-CN")}.md`
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${petName}的健康报告`,
          text: report,
        })
      } catch (error) {
        console.log("分享取消")
      }
    } else {
      try {
        await navigator.clipboard.writeText(report)
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
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${petName}的健康报告</title>
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
            <div id="content">${report
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col" hideCloseButton>
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">🐾 {petName}的健康报告</DialogTitle>
            <div className="flex items-center gap-2">
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
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-6 py-4">
              <MarkdownRenderer content={report} />
            </div>
          </ScrollArea>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>生成时间：{new Date().toLocaleString("zh-CN")}</span>
            <span>宠物妙妙屋 - AI健康助手</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
