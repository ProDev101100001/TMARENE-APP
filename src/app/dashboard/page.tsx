
"use client"

import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Footprints, Flame, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/firebase"

export default function Dashboard() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-background pb-20 rtl text-pt-sans">
      <header className="p-6 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="text-2xl font-bold">صباح الخير، {user?.displayName || 'أحمد'}! 👋</h1>
          <div className="flex items-center justify-end gap-2 text-accent">
            <span className="text-sm font-bold">🔥 Streak: 7 أيام</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Step & Calorie Mini Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-none shadow-lg">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Footprints className="h-6 w-6 text-primary" />
              <div className="text-center">
                <p className="text-2xl font-bold">4,200</p>
                <p className="text-[10px] text-muted-foreground">خطوات</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-none shadow-lg">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Flame className="h-6 w-6 text-accent" />
              <div className="text-center">
                <p className="text-2xl font-bold">1,450</p>
                <p className="text-[10px] text-muted-foreground">سعرات</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Workout Status */}
        <Card className="bg-surface border-none shadow-xl overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="text-right space-y-1">
              <h2 className="text-lg font-bold">برنامجك اليوم</h2>
              <p className="text-sm text-muted-foreground">اليوم 8 من 30</p>
            </div>
            <Link href="/workouts">
              <Button className="w-full bg-primary hover:bg-primary/90 text-background font-bold h-14 rounded-2xl btn-animate">
                ابدأ التمرين <ChevronRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Nutrition Section */}
        <div className="space-y-3">
          <h3 className="text-right font-bold text-sm">وجباتك اليوم</h3>
          <Link href="/nutrition">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-primary/30 bg-primary/5 text-primary gap-2 btn-animate">
              <Zap className="h-5 w-5" /> أضف وجبة 📷
            </Button>
          </Link>
        </div>

        {/* AI Tip */}
        <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl flex gap-3 items-start">
          <div className="flex-1 text-right">
            <p className="text-[10px] font-bold text-accent mb-1">نصيحة اليوم 💡</p>
            <p className="text-xs text-white">"شرب الماء قبل الوجبة بـ 30 دقيقة يساعد في تحسين الهضم والشعور بالشبع."</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold">AI</div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
