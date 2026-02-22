
"use client"

import { useState, useMemo } from "react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Dumbbell, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getDayProgram } from "@/lib/workout-program"
import { useUser } from "@/firebase"

export default function WorkoutList() {
  const { user } = useUser()
  const currentDay = 1 // افتراضي لليوم الأول
  const dayData = useMemo(() => getDayProgram('beginner', currentDay), [currentDay])
  const exercises = dayData.exercises

  return (
    <div className="min-h-screen bg-background pb-20 rtl page-transition-slide-right">
      <header className="p-6 pt-10 flex flex-col gap-6 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="font-medium-title text-white">اليوم {currentDay} من 30</h1>
          <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
            <span className="text-accent font-bold text-sm">🔥 7</span>
          </div>
        </div>
        <Progress value={(currentDay / 30) * 100} className="h-1.5 bg-muted rounded-full" />
      </header>

      <main className="px-6 space-y-8 mt-4">
        <div className="text-right">
           <h2 className="text-3xl font-bold text-white">{dayData.titleAr}</h2>
           <p className="text-[14px] text-muted-foreground mt-1">
             {exercises.length} تمارين · ~25 دقيقة
           </p>
        </div>

        <div className="space-y-4">
          {exercises.map((ex, i) => (
            <Link key={i} href={`/workout/exercise?day=${currentDay}&index=${i}`}>
              <Card className="bg-card border-none shadow-sm rounded-2xl overflow-hidden active:scale-95 transition-transform cursor-pointer group mb-4">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                     <Dumbbell className="h-7 w-7" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold text-white group-hover:text-primary transition-colors">{ex.nameAr}</p>
                    <p className="text-[12px] text-muted-foreground">{ex.sets} مجموعات × {ex.reps}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-[-4px] transition-transform" />
                </CardContent>
              </Card>
            </Link>
          ))}
          
          <Link href={`/workout/exercise?day=${currentDay}&index=0`}>
            <Button className="w-full h-16 mt-8 bg-primary text-background text-xl font-bold rounded-2xl btn-animate shadow-lg">
               ▶ ابدأ التمرين الآن
            </Button>
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
