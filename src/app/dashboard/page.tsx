
"use client"

import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Target, ChevronRight, Activity, TrendingDown, Zap } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/firebase"

export default function Dashboard() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-background pb-20 rtl">
      <header className="p-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
               <Zap className="h-4 w-4 text-primary fill-primary" />
             </div>
             <span className="text-sm font-bold">🔥 3</span>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold font-headline">صباح الخير، {user?.displayName || 'أحمد'}</h1>
            <p className="text-[10px] text-muted-foreground">الاثنين، 15 أكتوبر</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Steps Ring Card */}
        <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardContent className="p-6 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-primary-foreground/80 text-sm">خطوات اليوم</p>
              <h2 className="text-4xl font-bold">5,420</h2>
              <p className="text-xs opacity-80">الهدف: 8,000 خطوة</p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="stroke-white/20 fill-none"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-white fill-none"
                  strokeWidth="3"
                  strokeDasharray="67, 100"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                67%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex flex-col items-end gap-2 text-right">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">سعرات مستهلكة</p>
                <p className="text-lg font-bold">1,200</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex flex-col items-end gap-2 text-right">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">المتبقي</p>
                <p className="text-lg font-bold">650</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Workout Status */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <Link href="/workouts">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                مشاهدة الكل <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="text-sm font-bold">برنامج 30 يوم</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl">
              <div className="flex-1 text-right">
                <p className="font-bold text-sm">اليوم الرابع: كارديو مكثف</p>
                <p className="text-[10px] text-muted-foreground">30 دقيقة • 12 تمرين</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <Link href="/workouts">
              <Button className="w-full mt-4 bg-primary">ابدأ تمرين اليوم</Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Tip */}
        <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-2xl flex gap-3 items-start">
          <div className="flex-1 text-right">
            <p className="text-[10px] font-bold text-secondary mb-1">نصيحة المساعد الذكي</p>
            <p className="text-xs">"أنت تبلي حسناً في الحفاظ على الـ Streak! تمرين اليوم سيرفع لياقتك القلبية بشكل ملحوظ."</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-[10px] font-bold">AI</div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
