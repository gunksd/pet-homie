"use client"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // 简化的markdown渲染器
  const renderMarkdown = (text: string) => {
    // 确保 text 不为空
    if (!text || typeof text !== "string") {
      return '<p class="mb-3 leading-relaxed text-gray-600">暂无内容</p>'
    }

    try {
      const processed = text
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-primary mb-4 pb-2 border-b">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">$1</h3>')
        .replace(/^\* (.*$)/gm, '<li class="text-gray-600 dark:text-gray-400 mb-1">$1</li>')
        .replace(/^- (.*$)/gm, '<li class="text-gray-600 dark:text-gray-400 mb-1">$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800 dark:text-gray-200">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>')
        .replace(/^---$/gm, '<hr class="my-6 border-gray-200 dark:border-gray-700" />')
        .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed text-gray-600 dark:text-gray-400">')
        .replace(/\n/g, "<br>")

      // 包装段落
      return `<p class="mb-3 leading-relaxed text-gray-600 dark:text-gray-400">${processed}</p>`
    } catch (error) {
      console.error("Markdown rendering error:", error)
      return '<p class="mb-3 leading-relaxed text-gray-600 dark:text-gray-400">内容渲染出错</p>'
    }
  }

  // 确保 content 存在且为字符串
  const safeContent = content || ""

  return (
    <div
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(safeContent) }}
    />
  )
}
