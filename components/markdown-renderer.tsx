"use client"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // 简化的markdown渲染器
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-primary mb-4 pb-2 border-b">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">$1</h3>')
      .replace(/^\* (.*$)/gm, '<li class="text-gray-600 mb-1">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="text-gray-600 mb-1">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(/^---$/gm, '<hr class="my-6 border-gray-200" />')
      .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed text-gray-600">')
      .replace(/\n/g, "<br>")

    // 包装段落
    return `<p class="mb-3 leading-relaxed text-gray-600">${text}</p>`
  }

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}
