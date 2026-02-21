
"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Play, ChevronRight, Dumbbell, Timer, Zap, X, Trophy, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const initialExercises = [
  { id: 1, name: "سكوات (Squats)", reps: "15", sets: 3, image: "https://picsum.photos/seed/ex1/600/400" },
  { id: 2, name: "ضغط (Push-ups)", reps: "10", sets: 3, image: "https://picsum.photos/seed/ex2/600/400" },
  { id: 3, name: "بلانك (Plank)", reps: "45 ثانية", sets: 3, image: "https://picsum.photos/seed/ex3/600/400" }
]

const days = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  title: i % 7 === 6 ? "يوم راحة" : `تمرين اليوم ${i + 1}`,
  completed: i < 3,
  current: i === 3
}))

type ViewState = 'list' | 'active' | 'rest' | 'summary'

export default function Workouts() {
  const [view, setView] = useState<ViewState>('list')
  const [currentExIndex, setCurrentExIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [restTimer, setRestTimer] = useState(30)
  const [activeTimer, setActiveTimer] = useState(0)

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
    const currentEx = initialExercises[currentExIndex]
    if (currentSet < currentEx.sets) {
      setRestTimer(30)
      setView('rest')
    } else {
      if (currentExIndex < initialExercises.length - 1) {
        setRestTimer(30)
        setView('rest')
      } else {
        setView('summary')
      }
    }
  }

  const handleRestComplete = () => {
    const currentEx = initialExercises[currentExIndex]
    if (currentSet < currentEx.sets) {
      setCurrentSet(prev => prev + 1)
      setView('active')
    } else {
      setCurrentExIndex(prev => prev + 1)
      setCurrentSet(1)
      setView('active')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (view === 'active') {
    const ex = initialExercises[currentExIndex]
    return (
      <div className="min-h-screen bg-background flex flex-col rtl p-6">
        <header className="flex justify-between items-center mb-8">
          <Button variant="ghost" size="icon" onClick={() => setView('list')}>
            <X className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">التمرين الحالي</p>
            <p className="font-bold">{currentExIndex + 1} من {initialExercises.length}</p>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col items-center gap-8 text-center">
          {/* 1. Counter */}
          <div className="space-y-1">
             <h2 className="text-6xl font-black text-primary font-mono">{formatTime(activeTimer)}</h2>
             <p className="text-muted-foreground text-sm">الوقت المستغرق</p>
          </div>

          {/* 2. Exercise Info */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-headline">{ex.name}</h1>
            <p className="text-primary font-bold text-lg">المجموعة {currentSet} من {ex.sets}</p>
            <p className="text-muted-foreground italic">الهدف: {ex.reps} تكرار</p>
          </div>

          {/* 3. Illustration */}
          <div className="relative w-full flex-1 max-h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image 
              src={ex.image} 
              alt={ex.name} 
              fill 
              className="object-cover"
              data-ai-hint="fitness exercise animation"
            />
          </div>
        </main>

        <footer className="mt-8">
          <Button className="w-full h-16 text-xl font-bold rounded-2xl shadow-lg" onClick={handleDone}>
            انتهيت ✓
          </Button>
        </footer>
      </div>
    )
  }

  if (view === 'rest') {
    const nextEx = currentSet < initialExercises[currentExIndex].sets 
      ? initialExercises[currentExIndex] 
      : initialExercises[currentExIndex + 1]

    return (
      <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-center p-8 rtl text-center">
        <p className="text-xl opacity-80 mb-4">وقت الراحة</p>
        <h2 className="text-8xl font-black mb-12 font-mono">{restTimer}</h2>
        
        <div className="flex gap-4 mb-16">
          <Button 
            variant="outline" 
            className="rounded-full w-16 h-16 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white"
            onClick={() => setRestTimer(prev => Math.max(5, prev - 5))}
          >
            <Minus className="h-6 w-6" />
            <span className="sr-only">-5 ثواني</span>
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full w-16 h-16 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white"
            onClick={() => setRestTimer(prev => prev + 5)}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">+5 ثواني</span>
          </Button>
        </div>

        {nextEx && (
          <div className="space-y-2 animate-pulse">
            <p className="text-sm opacity-70">استعد للتمرين القادم:</p>
            <p className="text-2xl font-bold">{nextEx.name}</p>
            <p className="text-sm opacity-90">المجموعة {currentSet < initialExercises[currentExIndex].sets ? currentSet + 1 : 1} من {nextEx.sets}</p>
          </div>
        )}

        <Button 
          variant="ghost" 
          className="mt-auto text-white underline"
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
        <h1 className="text-4xl font-black text-primary font-headline mb-4">أحسنت! 🏆</h1>
        <p className="text-xl mb-8 leading-relaxed">لقد أكملت تمرين اليوم بنجاح. أنت الآن أقرب لخطوة من هدفك!</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-xs text-muted-foreground">الوقت الإجمالي</p>
            <p className="text-xl font-bold">12:40</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-xs text-muted-foreground">سعرات محروقة</p>
            <p className="text-xl font-bold">350</p>
          </div>
        </div>

        <Button className="w-full max-w-sm h-14 rounded-xl text-lg font-bold" onClick={() => setView('list')}>
          العودة للرئيسية
        </Button>
      </div>
    )
  }

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
        {/* Screen 1: Workout Spotlight */}
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
             <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold" onClick={() => startWorkout()}>
                <Play className="h-4 w-4 mr-2 fill-primary" /> ابدأ تمرن
             </Button>
          </CardContent>
        </Card>

        {/* Exercises List Selection */}
        <div className="space-y-3">
          <h2 className="text-right font-bold text-sm">قائمة تمارين اليوم</h2>
          <div className="space-y-2">
            {initialExercises.map((ex, i) => (
              <div 
                key={ex.id} 
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
                onClick={() => startWorkout(i)}
              >
                <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                   {i+1}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold">{ex.name}</p>
                  <p className="text-[10px] text-muted-foreground">{ex.sets} مجموعات × {ex.reps} تكرار</p>
                </div>
                <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden relative">
                   <Image 
                     src={ex.image} 
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
