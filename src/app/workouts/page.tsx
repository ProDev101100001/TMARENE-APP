
"use client"

import { useState, useEffect, useMemo } from "react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Play, Trophy, ArrowLeft, X, Dumbbell } from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { getDayProgram } from "@/lib/workout-program"
import { useUser } from "@/firebase"
import { cn } from "@/lib/utils"

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type ViewState = 'list' | 'active' | 'rest' | 'summary'

export default function Workouts() {
  const { user } = useUser()
  const [currentDay, setCurrentDay] = useState(1)
  const [view, setView] = useState<ViewState>('list')
  const [currentExIndex, setCurrentExIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [restTimer, setRestTimer] = useState(30)
  const [activeTimer, setActiveTimer] = useState(0)

  const dayData = useMemo(() => getDayProgram('beginner', currentDay), [currentDay])
  const exercises = dayData.exercises

  useEffect(() => {
    let interval: any
    if (view === 'active') {
      interval = setInterval(() => setActiveTimer(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [view])

  useEffect(() => {
    let interval: any
    if (view === 'rest') {
      if (restTimer > 0) {
        interval = setInterval(() => setRestTimer(prev => prev - 1), 1000)
      } else {
        handleRestComplete()
      }
    }
    return () => clearInterval(interval)
  }, [view, restTimer])

  const startWorkout = (index: number = 0) => {
    setCurrentExIndex(index)
    setCurrentSet(1)
    setActiveTimer(0)
    setView('active')
  }

  const handleDone = () => {
    const currentEx = exercises[currentExIndex]
    if (currentSet < currentEx.sets) {
      setRestTimer(30)
      setView('rest')
    } else if (currentExIndex < exercises.length - 1) {
      setRestTimer(30)
      setView('rest')
    } else {
      setView('summary')
    }
  }

  const handleRestComplete = () => {
    const currentEx = exercises[currentExIndex]
    if (currentSet < currentEx.sets) {
      setCurrentSet(prev => prev + 1)
      setView('active')
    } else {
      setCurrentExIndex(prev => prev + 1)
      setCurrentSet(1)
      setView('active')
    }
  }

  if (view === 'active') {
    const ex = exercises[currentExIndex]
    return (
      <div className="min-h-screen bg-background flex flex-col rtl p-6 page-transition-slide-up">
        <header className="flex justify-between items-center mb-10">
          <Button variant="ghost" size="icon" onClick={() => setView('list')} className="text-muted-foreground">
            <X className="h-6 w-6" />
          </Button>
          <div className="text-center flex flex-col">
            <span className="font-medium-title">{ex.nameAr}</span>
            <span className="text-[12px] text-muted-foreground">المجموعة {currentSet} من {ex.sets}</span>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col items-center text-center">
          <span className="font-hero text-primary">{activeTimer}</span>
          
          <div className="w-full aspect-square max-w-[350px] bg-card rounded-[2rem] flex items-center justify-center p-12 shadow-inner border border-white/5 mt-8 overflow-hidden">
             <Dumbbell className="h-32 w-32 text-primary/10 animate-pulse" />
          </div>

          <div className="flex gap-3 mt-10">
             {[...Array(ex.sets)].map((_, i) => (
               <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i < currentSet ? 'bg-primary' : 'bg-muted'}`} />
             ))}
          </div>
          <p className="text-2xl font-bold text-white mt-6">الهدف: {ex.reps} تكرار</p>
        </main>

        <footer className="mt-8 space-y-4 pb-4">
          <Progress value={((currentExIndex + 1) / exercises.length) * 100} className="h-1.5 bg-muted rounded-full" />
          <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg bg-primary text-background btn-animate" onClick={handleDone}>
            انتهيت من المجموعة ✓
          </Button>
        </footer>
      </div>
    )
  }

  if (view === 'rest') {
    const isNextSet = currentSet < exercises[currentExIndex].sets
    const nextEx = isNextSet ? exercises[currentExIndex] : exercises[currentExIndex + 1]

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 rtl text-center page-transition-fade">
        <span className="font-medium-title mb-10">خذ راحتك! 💪</span>
        
        <div className="relative w-56 h-56 flex items-center justify-center mb-10">
           <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle cx="112" cy="112" r="100" stroke="#2D374880" strokeWidth="10" fill="transparent" />
             <circle 
               cx="112" cy="112" r="100" 
               stroke="#2ECC71" strokeWidth="10" fill="transparent" 
               className="progress-ring-ease" 
               strokeDasharray={628} 
               strokeDashoffset={628 - (restTimer / 30) * 628} 
             />
           </svg>
           <span className="font-hero text-primary">00:{restTimer.toString().padStart(2, '0')}</span>
        </div>
        
        <div className="flex gap-6 mb-16">
          <Button variant="outline" className="rounded-2xl w-24 h-14 border-white/10 bg-card text-white btn-animate text-lg" onClick={() => setRestTimer(prev => Math.max(5, prev - 5))}>
            − 5ث
          </Button>
          <Button variant="outline" className="rounded-2xl w-24 h-14 border-white/10 bg-card text-white btn-animate text-lg" onClick={() => setRestTimer(prev => prev + 5)}>
            + 5ث
          </Button>
        </div>

        {nextEx && (
          <div className="w-full max-w-sm space-y-3">
            <p className="text-[12px] text-muted-foreground">التالي:</p>
            <div className="bg-card border border-white/5 p-4 rounded-2xl flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
               </div>
               <span className="font-bold">{nextEx.nameAr}</span>
            </div>
          </div>
        )}

        <Button variant="ghost" className="mt-10 text-muted-foreground font-medium" onClick={handleRestComplete}>
          تخطى الراحة ←
        </Button>
      </div>
    )
  }

  if (view === 'summary') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 rtl text-center page-transition-fade">
        <div className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center mb-10 relative">
           <Trophy className="h-24 w-24 text-accent animate-bounce" />
           <div className="absolute inset-0 border-4 border-primary border-dashed rounded-full animate-spin-slow opacity-20" />
        </div>
        <h1 className="font-hero text-primary mb-2">أحسنت! 🏆</h1>
        <p className="font-medium-title text-muted-foreground mb-16">أكملت اليوم {currentDay} من 30 بنجاح.</p>
        
        <div className="w-full max-w-sm space-y-4">
          <div className="bg-accent/10 p-4 rounded-2xl border border-accent/20">
             <span className="text-accent font-bold text-xl">🔥 Streak: 8 أيام</span>
          </div>
          <Link href="/dashboard" className="block w-full">
            <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-primary text-background btn-success-animate">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 rtl page-transition-slide-right">
      <header className="p-6 pt-10 flex flex-col gap-6 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="font-medium-title">اليوم {currentDay} من 30</h1>
          <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
            <span className="text-accent font-bold">🔥 7</span>
          </div>
        </div>
        <Progress value={(currentDay / 30) * 100} className="h-1.5 bg-muted rounded-full" />
      </header>

      <main className="px-6 space-y-8 mt-4">
        <div className="text-right">
           <h2 className="text-3xl font-bold">{dayData.titleAr}</h2>
           <p className="text-[14px] text-muted-foreground mt-1">4 تمارين · ~25 دقيقة</p>
        </div>

        <div className="space-y-4">
          {exercises.map((ex, i) => (
            <Card 
              key={i} 
              className="bg-card border-none shadow-sm rounded-2xl overflow-hidden active:scale-95 transition-transform cursor-pointer group"
              onClick={() => startWorkout(i)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                   <Dumbbell className="h-7 w-7" />
                </div>
                <div className="flex-1 text-right">
                  <p className="font-bold group-hover:text-primary transition-colors">{ex.nameAr}</p>
                  <p className="text-[12px] text-muted-foreground">{ex.sets} مجموعات × {ex.reps}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-[-4px] transition-transform" />
              </CardContent>
            </Card>
          ))}
          
          <Button className="w-full h-16 mt-8 bg-primary text-background text-xl font-bold rounded-2xl btn-animate shadow-lg" onClick={() => startWorkout(0)}>
             ▶ ابدأ التمرين الآن
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
