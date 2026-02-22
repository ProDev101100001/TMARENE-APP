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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-white/5 px-4 py-2 flex justify-around items-center z-50 md:hidden h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1.5 p-2 transition-all duration-150 relative",
              isActive ? "text-primary scale-110" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-6 w-6 transition-all", isActive && "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(46,204,113,0.3)]")} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && (
              <div className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full animate-in zoom-in duration-300" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
