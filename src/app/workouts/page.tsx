
"use client"

import { useState, useEffect, useMemo } from "react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Play, Timer, Zap, X, Trophy, Plus, Minus, Dumbbell } from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { getDayProgram, type DayProgram, type ExerciseDetail } from "@/lib/workout-program"
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type ViewState = 'list' | 'active' | 'rest' | 'summary'

export default function Workouts() {
  const { user } = useUser()
  const db = useFirestore()
  
  // Mocking progress for now, in a real app this comes from Firestore
  const [currentDay, setCurrentDay] = useState(1)
  const [streak, setStreak] = useState(3)
  const [view, setView] = useState<ViewState>('list')
  const [currentExIndex, setCurrentExIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [restTimer, setRestTimer] = useState(30)
  const [activeTimer, setActiveTimer] = useState(0)

  const dayData = useMemo(() => getDayProgram('beginner', currentDay), [currentDay])
  const exercises = dayData.exercises

  // Active workout timer
  useEffect(() => {
    let interval: any
    if (view === 'active') {
      interval = setInterval(() => setActiveTimer(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [view])

  // Rest timer logic
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
    } else {
      if (currentExIndex < exercises.length - 1) {
        setRestTimer(30)
        setView('rest')
      } else {
        completeWorkout()
      }
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

  const completeWorkout = () => {
    setView('summary')
    // Logic to update Streak and Progress would go here
    // e.g., if today's workout isn't finished yet, streak++
    setStreak(prev => prev + 1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (view === 'active') {
    const ex = exercises[currentExIndex]
    return (
      <div className="min-h-screen bg-background flex flex-col rtl p-6">
        <header className="flex justify-between items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => setView('list')}>
            <X className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">التمرين الحالي</p>
            <p className="font-bold text-sm">{currentExIndex + 1} من {exercises.length}</p>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col items-center gap-6 text-center">
          {/* 1. Counter */}
          <div className="space-y-1">
             <h2 className="text-5xl font-black text-primary font-mono">{formatTime(activeTimer)}</h2>
             <p className="text-muted-foreground text-[10px]">الوقت المستغرق</p>
          </div>

          {/* 2. Exercise Info */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-headline">{ex.nameAr}</h1>
            <p className="text-primary font-bold text-base">المجموعة {currentSet} من {ex.sets}</p>
            <p className="text-muted-foreground italic text-sm">الهدف: {ex.reps} تكرار</p>
          </div>

          {/* 3. Animation Area */}
          <div className="relative w-full aspect-square max-w-[300px] bg-white rounded-3xl overflow-hidden shadow-inner border flex items-center justify-center p-4">
            {/* Placeholder for Lottie - Using ID to simulate loading */}
            <div className="flex flex-col items-center gap-2">
               <Dumbbell className="h-16 w-16 text-primary/20 animate-bounce" />
               <p className="text-[10px] text-muted-foreground">تمثيل حركي لـ {ex.nameAr}</p>
               <p className="text-[8px] opacity-30">ID: {ex.lottieId}</p>
            </div>
          </div>
        </main>

        <footer className="mt-8">
          <Button className="w-full h-16 text-xl font-bold rounded-2xl shadow-lg bg-primary" onClick={handleDone}>
            انتهيت ✓
          </Button>
        </footer>
      </div>
    )
  }

  if (view === 'rest') {
    const isNextSet = currentSet < exercises[currentExIndex].sets
    const nextEx = isNextSet ? exercises[currentExIndex] : exercises[currentExIndex + 1]

    return (
      <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-center p-8 rtl text-center">
        <p className="text-xl opacity-80 mb-4">وقت الراحة</p>
        <h2 className="text-8xl font-black mb-12 font-mono">{restTimer}</h2>
        
        <div className="flex gap-6 mb-16">
          <Button 
            variant="outline" 
            className="rounded-full w-16 h-16 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white"
            onClick={() => setRestTimer(prev => Math.max(5, prev - 5))}
          >
            <Minus className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full w-16 h-16 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white"
            onClick={() => setRestTimer(prev => prev + 5)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {nextEx && (
          <div className="space-y-2">
            <p className="text-sm opacity-70">استعد للتمرين القادم:</p>
            <p className="text-2xl font-bold">{nextEx.nameAr}</p>
            <p className="text-sm opacity-90">المجموعة {isNextSet ? currentSet + 1 : 1} من {nextEx.sets}</p>
          </div>
        )}

        <Button 
          variant="ghost" 
          className="mt-12 text-white underline opacity-70"
          onClick={handleRestComplete}
        >
          تخطي الراحة
        </Button>
      </div>
    )
  }

  if (view === 'summary') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 rtl text-center">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8">
           <Trophy className="h-16 w-16 text-primary animate-bounce" />
        </div>
        <h1 className="text-3xl font-black text-primary font-headline mb-4">أحسنت! 🏆</h1>
        <p className="text-lg mb-8 leading-relaxed">لقد أكملت تمرين اليوم بنجاح. أنت الآن أقرب بخطوة من هدفك!</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] text-muted-foreground">الوقت الإجمالي</p>
            <p className="text-xl font-bold">{formatTime(activeTimer)}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] text-muted-foreground">🔥 Streak</p>
            <p className="text-xl font-bold">{streak}</p>
          </div>
        </div>

        <Link href="/dashboard" className="w-full max-w-sm">
          <Button className="w-full h-14 rounded-xl text-lg font-bold">
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 rtl">
      <header className="p-6 bg-white shadow-sm flex flex-col gap-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
               <Zap className="h-4 w-4 text-primary fill-primary" />
             </div>
             <span className="text-sm font-bold">🔥 {streak}</span>
          </div>
          <h1 className="text-lg font-bold font-headline">اليوم {currentDay} من 30</h1>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-primary">{Math.round((currentDay / 30) * 100)}% مكتمل</span>
            <span>{currentDay} من 30 يوماً</span>
          </div>
          <Progress value={(currentDay / 30) * 100} className="h-2 bg-muted" />
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Day Header */}
        <div className="text-right">
           <h2 className="text-2xl font-bold font-headline">{dayData.titleAr}</h2>
           {dayData.type === 'workout' && (
             <p className="text-sm text-muted-foreground">برنامج مكثف لزيادة اللياقة</p>
           )}
        </div>

        {dayData.type === 'workout' ? (
          <div className="space-y-3">
            <h3 className="text-right font-bold text-xs">قائمة التمارين</h3>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-transparent hover:border-primary/20 cursor-pointer"
                  onClick={() => startWorkout(i)}
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary text-xs font-bold">
                     {i+1}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-bold">{ex.nameAr}</p>
                    <p className="text-[10px] text-muted-foreground">{ex.sets} مجموعات × {ex.reps}</p>
                  </div>
                  <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                     <Dumbbell className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full h-14 mt-4 bg-primary text-lg font-bold" onClick={() => startWorkout(0)}>
               ابدأ التحدي اليوم
            </Button>
          </div>
        ) : (
          <Card className="border-none shadow-sm bg-primary/5 p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
               {dayData.type === 'active_rest' ? <Zap className="h-8 w-8 text-primary" /> : <Timer className="h-8 w-8 text-primary" />}
            </div>
            <h3 className="text-xl font-bold">{dayData.type === 'active_rest' ? 'وقت الراحة النشطة' : 'يوم للراحة والاسترخاء'}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dayData.type === 'active_rest' 
                ? 'المشي السريع لمدة 15 دقيقة يساعد على تنشيط الدورة الدموية وسرعة الاستشفاء العضلي.' 
                : 'الراحة الكاملة جزء لا يتجزأ من التطور. امنح عضلاتك الفرصة للبناء والنمو اليوم.'}
            </p>
            <Button variant="outline" className="w-full mt-4" onClick={() => setCurrentDay(prev => prev + 1)}>انتقل لليوم التالي</Button>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
