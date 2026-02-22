"use client"

import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Footprints, Flame, ChevronRight, Zap, Activity } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/firebase"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const { user } = useUser()
  const steps = 4200
  const stepGoal = 10000
  const progress = (steps / stepGoal) * 100

  return (
    <div className="min-h-screen bg-background pb-20 rtl page-transition-fade">
      <header className="p-6 pt-10 sticky top-0 z-10 bg-background/80 backdrop-blur-md flex justify-between items-start">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-medium-title">صباح الخير، {user?.displayName || 'أحمد'}! 👋</h1>
          <p className="text-[12px] text-muted-foreground">الأحد، 22 فبراير</p>
        </div>
        <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
          <span className="text-accent font-bold">🔥 7</span>
        </div>
      </header>

      <main className="px-6 space-y-8">
        {/* Step Progress Hero */}
        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative w-64 h-64 flex items-center justify-center">
             {/* Progress Ring Background */}
             <svg className="absolute inset-0 w-full h-full -rotate-90">
               <circle 
                 cx="128" cy="128" r="110" 
                 stroke="#2D374880" strokeWidth="12" fill="transparent" 
               />
               <circle 
                 cx="128" cy="128" r="110" 
                 stroke="#2ECC71" strokeWidth="12" fill="transparent" 
                 className="progress-ring-ease"
                 strokeDasharray={691} 
                 strokeDashoffset={691 - (progress / 100) * 691}
                 strokeLinecap="round"
               />
             </svg>
             <div className="text-center z-10 flex flex-col items-center">
                <span className="font-hero">{steps.toLocaleString()}</span>
                <span className="text-muted-foreground font-regular-body">خطوة</span>
                <span className="text-primary text-[12px] font-bold mt-1">{progress.toFixed(0)}%</span>
             </div>
          </div>
          <p className="text-[12px] text-muted-foreground mt-4">من {stepGoal.toLocaleString()} هدف</p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-none shadow-sm rounded-2xl">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Activity className="h-7 w-7 text-primary" />
              <div className="text-center">
                <p className="text-xl font-bold">2.8 km</p>
                <p className="text-[12px] text-muted-foreground">المسافة</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-none shadow-sm rounded-2xl">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Flame className="h-7 w-7 text-accent" />
              <div className="text-center">
                <p className="text-xl font-bold">1,450</p>
                <p className="text-[12px] text-muted-foreground">سعرات</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Workout CTA */}
        <section className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="font-medium-title">برنامجك اليوم</h2>
            <span className="text-[12px] text-muted-foreground">اليوم 8 من 30</span>
          </div>
          <Progress value={26} className="h-1.5 bg-muted rounded-full" />
          <Link href="/workouts">
            <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-background font-bold text-lg btn-animate mt-2">
              ▶ ابدأ التمرين
            </Button>
          </Link>
        </section>

        {/* Nutrition CTA */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-1">
             <h2 className="font-medium-title">وجباتك اليوم</h2>
             <span className="text-[12px] text-muted-foreground">1,450 / 2,000 سعرة</span>
           </div>
           <Link href="/nutrition">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-primary/30 bg-primary/5 text-primary gap-2 btn-animate">
              + أضف وجبة 📷
            </Button>
          </Link>
        </section>

        {/* Weekly Activity Chart (Simplified UI Representation) */}
        <section className="space-y-4 pb-10">
           <h2 className="font-medium-title">نشاط الأسبوع</h2>
           <div className="flex justify-between items-end h-32 px-2">
              {[60, 40, 80, 50, 90, 30, 70].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-3 rounded-full ${i === 4 ? 'bg-primary' : 'bg-muted/50'}`} 
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {['س', 'أ', 'ث', 'أ', 'خ', 'ج', 'س'][i]}
                  </span>
                </div>
              ))}
           </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
