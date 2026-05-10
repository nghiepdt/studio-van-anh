"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Lightbulb, FileText, Image, Calendar, Send, BarChart3, LogOut } from "lucide-react"

const navItems = [
  { href: "/idea-bank", label: "Kho Ý Tưởng", icon: Lightbulb },
  { href: "/draft-editor", label: "Viết Bài", icon: FileText },
  { href: "/design-lab", label: "Thiết Kế", icon: Image },
  { href: "/calendar", label: "Lịch Đăng", icon: Calendar },
  { href: "/publish-queue", label: "Xuất Bản", icon: Send },
  { href: "/performance-log", label: "Hiệu Quả", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-bold">Studio Vân Anh</h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
