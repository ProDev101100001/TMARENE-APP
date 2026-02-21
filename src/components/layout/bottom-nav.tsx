
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Footprints, Dumbbell, Utensils, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: Home, label: "الرئيسية" },
  { href: "/steps", icon: Footprints, label: "خطوات" },
  { href: "/workouts", icon: Dumbbell, label: "تمارين" },
  { href: "/nutrition", icon: Utensils, label: "أكل" },
  { href: "/profile", icon: User, label: "أنا" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 flex justify-around items-center z-50 md:hidden h-16 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-all duration-150 relative",
              isActive ? "text-primary scale-110" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
