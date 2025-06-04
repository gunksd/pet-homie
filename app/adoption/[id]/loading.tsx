import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Loading() {
  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center p-4 border-b">
        <Link href="/adoption" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium">宠物详情</h1>
      </div>

      {/* 主图片骨架 */}
      <Skeleton className="h-64 w-full" />

      <div className="p-4">
        {/* 基本信息骨架 */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* 性格标签骨架 */}
        <div className="mb-6">
          <Skeleton className="h-6 w-24 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* 健康状况骨架 */}
        <Skeleton className="h-40 w-full mb-6" />

        {/* 领养要求骨架 */}
        <Skeleton className="h-24 w-full mb-6" />

        {/* 宠物故事骨架 */}
        <Skeleton className="h-32 w-full mb-6" />

        {/* 操作按钮骨架 */}
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
