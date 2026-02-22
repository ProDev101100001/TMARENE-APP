
"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Activity, Loader2 } from "lucide-react"
import Link from "next/link"
import { useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase"
import { doc } from "firebase/firestore"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const [today, setToday] = useState<string | null>(null)

  useEffect(() => {
    // تحديد التاريخ على العميل فقط لتجنب تعارض الـ Hydration
    setToday(new Date().toISOString().split('T')[0])
  }, [])
  
  // جلب بيانات اليوم من Firestore
  const dailyLogRef = useMemoFirebase(() => {
    if (!user || !db || !today) return null;
    return doc(db, 'users', user.uid, 'dailyLogs', today);
  }, [user, db, today]);

  const { data: dailyLog, isLoading: isLogLoading } = useDoc(dailyLogRef);

  // جلب الملف الشخصي
  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid, 'profile_data', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  if (isUserLoading || !today) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  // قيم افتراضية
  const steps = dailyLog?.stepsCount || 0;
  const stepGoal = profile?.dailyStepGoal || 10000;
  const progress = stepGoal > 0 ? Math.min((steps / stepGoal) * 100, 100) : 0;
  const calories = dailyLog?.caloriesConsumedTotal || 0;
  const distance = dailyLog?.distanceKm || 0;
  const streak = profile?.streak || 0;

  return (
    <div className="min-h-screen bg-background pb-20 rtl page-transition-fade">
      <header className="p-6 pt-10 sticky top-0 z-10 bg-background/80 backdrop-blur-md flex justify-between items-start">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="font-medium-title text-white">مرحباً، {user?.displayName || 'بطل تماريني'}! 👋</h1>
          <p className="text-[12px] text-muted-foreground">
            {new Intl.DateTimeFormat('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
          <span className="text-accent font-bold">🔥 {streak}</span>
        </div>
      </header>

      <main className="px-6 space-y-8">
        {/* Step Progress Hero */}
        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative w-64 h-64 flex items-center justify-center">
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
                <span className="font-hero text-white">{steps.toLocaleString()}</span>
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
                <p className="text-xl font-bold text-white">{distance} km</p>
                <p className="text-[12px] text-muted-foreground">المسافة</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-none shadow-sm rounded-2xl">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Flame className="h-7 w-7 text-accent" />
              <div className="text-center">
                <p className="text-xl font-bold text-white">{calories}</p>
                <p className="text-[12px] text-muted-foreground">سعرات</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Workout CTA */}
        <section className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="font-medium-title text-white">برنامجك اليوم</h2>
            <span className="text-[12px] text-muted-foreground">ابدأ رحلتك اليوم</span>
          </div>
          <Progress value={0} className="h-1.5 bg-muted rounded-full" />
          <Link href="/workout">
            <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-background font-bold text-lg btn-animate mt-2">
              ▶ ابدأ التمرين
            </Button>
          </Link>
        </section>

        {/* Nutrition CTA */}
        <section className="space-y-4 pb-10">
           <div className="flex justify-between items-center px-1">
             <h2 className="font-medium-title text-white">وجباتك اليوم</h2>
             <span className="text-[12px] text-muted-foreground">{calories} سعرة مسجلة</span>
           </div>
           <Link href="/nutrition">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-primary/30 bg-primary/5 text-primary gap-2 btn-animate">
              + أضف وجبة 📷
            </Button>
          </Link>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
