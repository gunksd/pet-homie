"use client"

import { Home, MessageCircle, ShoppingBag, User, PawPrint } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "首页",
    href: "/",
    icon: Home,
  },
  {
    label: "消息",
    href: "/messages",
    icon: MessageCircle,
  },
  {
    label: "AI助手",
    href: "/ai-assistant",
    icon: PawPrint,
  },
  {
    label: "商城",
    href: "/shop",
    icon: ShoppingBag,
  },
  {
    label: "我的",
    href: "/profile",
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t max-w-md mx-auto">
      <nav className="flex justify-between items-center px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 min-w-[4rem]",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
