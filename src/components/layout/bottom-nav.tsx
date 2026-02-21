
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Dumbbell, Utensils, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: Home, label: "الرئيسية" },
  { href: "/workouts", icon: Dumbbell, label: "التمارين" },
  { href: "/nutrition", icon: Utensils, label: "التغذية" },
  { href: "/chat", icon: MessageSquare, label: "المساعد" },
  { href: "/profile", icon: User, label: "حسابي" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-2 flex justify-around items-center z-50 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
