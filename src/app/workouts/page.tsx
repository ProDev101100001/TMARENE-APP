
"use client"

import { useState, useEffect, useMemo } from "react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Play, Timer, Zap, X, Trophy, Plus, Minus, Dumbbell, ArrowLeft } from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { getDayProgram } from "@/lib/workout-program"
import { useUser } from "@/firebase"

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
      <div className="min-h-screen bg-background flex flex-col rtl p-6 text-pt-sans">
        <header className="flex justify-between items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => setView('list')} className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <p className="text-sm font-bold">اليوم {currentDay} من 30</p>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-black text-primary font-mono">{activeTimer}</h1>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{ex.nameAr} — المجموعة {currentSet}/{ex.sets}</h2>
            <p className="text-muted-foreground">الهدف: {ex.reps} تكرار</p>
          </div>

          <div className="w-full aspect-square max-w-[350px] bg-card rounded-[2rem] flex items-center justify-center p-8 shadow-inner overflow-hidden border border-white/5">
             <Dumbbell className="h-32 w-32 text-primary/20 animate-pulse" />
          </div>

          <div className="flex gap-2 mt-4">
             {[...Array(ex.sets)].map((_, i) => (
               <div key={i} className={`w-3 h-3 rounded-full ${i < currentSet ? 'bg-primary' : 'bg-muted'}`} />
             ))}
          </div>
        </main>

        <footer className="mt-8 space-y-4">
          <Progress value={(currentExIndex / exercises.length) * 100} className="h-2 bg-muted" />
          <Button className="w-full h-16 text-xl font-bold rounded-2xl shadow-lg bg-primary text-background btn-animate" onClick={handleDone}>
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
      <div className="min-h-screen bg-card flex flex-col items-center justify-center p-8 rtl text-center text-pt-sans">
        <p className="text-2xl font-bold mb-8">خذ راحتك! 💪</p>
        
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
           <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
             <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary transition-all duration-1000" strokeDasharray={502} strokeDashoffset={502 - (restTimer / 30) * 502} />
           </svg>
           <h2 className="text-6xl font-black font-mono">00:{restTimer.toString().padStart(2, '0')}</h2>
        </div>
        
        <div className="flex gap-8 mb-12">
          <Button variant="outline" className="rounded-2xl w-20 h-14 border-primary/20 bg-primary/5 text-primary btn-animate" onClick={() => setRestTimer(prev => Math.max(5, prev - 5))}>
            -5ث
          </Button>
          <Button variant="outline" className="rounded-2xl w-20 h-14 border-primary/20 bg-primary/5 text-primary btn-animate" onClick={() => setRestTimer(prev => prev + 5)}>
            +5ث
          </Button>
        </div>

        {nextEx && (
          <Card className="bg-surface/50 border-none p-4 w-full max-w-sm space-y-2">
            <p className="text-xs text-muted-foreground">التالي: {nextEx.nameAr}</p>
            <div className="w-12 h-12 bg-muted rounded-full mx-auto flex items-center justify-center">
               <Dumbbell className="h-6 w-6 text-primary" />
            </div>
          </Card>
        )}

        <Button variant="ghost" className="mt-8 text-muted-foreground underline" onClick={handleRestComplete}>
          تخطى الراحة ←
        </Button>
      </div>
    )
  }

  if (view === 'summary') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 rtl text-center text-pt-sans">
        <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
           <Trophy className="h-20 w-20 text-accent animate-bounce" />
           <div className="absolute inset-0 border-4 border-primary border-dashed rounded-full animate-spin-slow opacity-20" />
        </div>
        <h1 className="text-4xl font-black text-primary mb-4">أحسنت! 🏆</h1>
        <p className="text-lg text-muted-foreground mb-12">لقد أكملت تمرين اليوم بنجاح. فخورون بك!</p>
        
        <Link href="/dashboard" className="w-full max-w-sm">
          <Button className="w-full h-16 rounded-2xl text-xl font-bold bg-primary text-background btn-success-animate">
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 rtl text-pt-sans">
      <header className="p-6 flex flex-col gap-6 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
             <Zap className="h-5 w-5 text-accent fill-accent" />
             <span className="text-sm font-bold text-accent">🔥 7</span>
          </div>
          <h1 className="text-lg font-bold">اليوم {currentDay} من 30</h1>
        </div>
        <div className="space-y-2">
          <Progress value={(currentDay / 30) * 100} className="h-2 bg-muted" />
        </div>
      </header>

      <main className="p-4 space-y-6">
        <div className="text-right">
           <h2 className="text-3xl font-bold">{dayData.titleAr}</h2>
           <p className="text-sm text-muted-foreground">برنامج مكثف لزيادة اللياقة والقوة البدنية</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-right font-bold text-xs text-muted-foreground uppercase tracking-wider">قائمة التمارين</h3>
          <div className="space-y-3">
            {exercises.map((ex, i) => (
              <Card 
                key={i} 
                className="bg-card border-none shadow-md hover:bg-card/80 transition-all cursor-pointer group"
                onClick={() => startWorkout(i)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                     {i+1}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold group-hover:text-primary transition-colors">{ex.nameAr}</p>
                    <p className="text-xs text-muted-foreground">{ex.sets} مجموعات × {ex.reps}</p>
                  </div>
                  <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center">
                     <Dumbbell className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="w-full h-16 mt-6 bg-primary text-background text-xl font-bold rounded-2xl btn-animate" onClick={() => startWorkout(0)}>
             ابدأ التحدي اليوم ←
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
