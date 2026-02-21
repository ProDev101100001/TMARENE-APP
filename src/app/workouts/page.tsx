
"use client"

import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Play, ChevronLeft, Dumbbell, Timer, Zap } from "lucide-react"

const days = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  title: i % 7 === 6 ? "يوم راحة" : `تمرين اليوم ${i + 1}`,
  completed: i < 3,
  current: i === 3
}))

export default function Workouts() {
  return (
    <div className="min-h-screen bg-background pb-20 rtl">
      <header className="p-6 bg-white shadow-sm flex flex-col gap-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold font-headline">برنامج 30 يوماً</h1>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-primary">10% مكتمل</span>
            <span>3 من 30 يوماً</span>
          </div>
          <Progress value={10} className="h-2 bg-muted" />
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Current Workout Spotlight */}
        <Card className="border-none shadow-lg bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl"></div>
          <CardHeader className="p-6 pb-2 text-right">
             <div className="flex justify-between items-center mb-2">
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">مستوى مبتدئ</span>
                <span className="text-xs opacity-80">اليوم الرابع</span>
             </div>
             <CardTitle className="text-2xl font-headline">كارديو مكثف</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
             <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 p-2 rounded-xl text-center">
                   <Timer className="h-4 w-4 mx-auto mb-1 opacity-80" />
                   <p className="text-[10px]">30 دقيقة</p>
                </div>
                <div className="bg-white/10 p-2 rounded-xl text-center">
                   <Zap className="h-4 w-4 mx-auto mb-1 opacity-80" />
                   <p className="text-[10px]">350 سعرة</p>
                </div>
                <div className="bg-white/10 p-2 rounded-xl text-center">
                   <Dumbbell className="h-4 w-4 mx-auto mb-1 opacity-80" />
                   <p className="text-[10px]">12 تمرين</p>
                </div>
             </div>
             <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold">
                <Play className="h-4 w-4 mr-2 fill-primary" /> ابدأ الآن
             </Button>
          </CardContent>
        </Card>

        {/* Exercises List */}
        <div className="space-y-3">
          <h2 className="text-right font-bold text-sm">تمارين اليوم</h2>
          <div className="space-y-2">
            {[
              { name: "سكوات", reps: "15 تكرار", sets: "3 مجموعات" },
              { name: "ضغط", reps: "10 تكرار", sets: "3 مجموعات" },
              { name: "بلانك", reps: "45 ثانية", sets: "3 مجموعات" }
            ].map((ex, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                   {i+1}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold">{ex.name}</p>
                  <p className="text-[10px] text-muted-foreground">{ex.sets} × {ex.reps}</p>
                </div>
                <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden relative">
                   <Image 
                     src={`https://picsum.photos/seed/ex${i}/100/100`} 
                     alt={ex.name} 
                     fill 
                     className="object-cover" 
                   />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar View */}
        <div className="space-y-3">
          <h2 className="text-right font-bold text-sm">جدول الـ 30 يوماً</h2>
          <div className="grid grid-cols-5 gap-2">
            {days.map((d) => (
              <div 
                key={d.day}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all border ${
                  d.completed ? 'bg-primary/10 border-primary text-primary' : 
                  d.current ? 'bg-primary text-white border-primary shadow-md scale-110 z-10' : 
                  'bg-white border-muted text-muted-foreground hover:border-primary/50'
                }`}
              >
                <span className="text-xs font-bold">{d.day}</span>
                {d.completed && <CheckCircle2 className="h-3 w-3 absolute -top-1 -right-1 bg-white rounded-full text-primary" />}
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
