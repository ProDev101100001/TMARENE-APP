
"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Dumbbell } from "lucide-react"
import { getDayProgram } from "@/lib/workout-program"
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

function ExerciseView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const day = parseInt(searchParams.get('day') || '1')
  const index = parseInt(searchParams.get('index') || '0')

  const dayData = useMemo(() => getDayProgram('beginner', day), [day])
  const exercises = dayData.exercises
  const ex = exercises[index]

  const [currentSet, setCurrentSet] = useState(1)
  const [activeTimer, setActiveTimer] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setActiveTimer(prev => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDone = () => {
    // الانتقال لشاشة الراحة
    router.push(`/workout/rest?day=${day}&index=${index}&set=${currentSet}`)
  }

  if (!ex) return null

  return (
    <div className="min-h-screen bg-background flex flex-col rtl p-6 page-transition-slide-up">
      <header className="flex justify-between items-center mb-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/workout')} className="text-muted-foreground">
          <X className="h-6 w-6" />
        </Button>
        <div className="text-center flex flex-col">
          <span className="font-medium-title text-white">{ex.nameAr}</span>
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
        <Progress value={((index + 1) / exercises.length) * 100} className="h-1.5 bg-muted rounded-full" />
        <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg bg-primary text-background btn-animate" onClick={handleDone}>
          انتهيت من المجموعة ✓
        </Button>
      </footer>
    </div>
  )
}

export default function ExercisePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Dumbbell className="animate-spin text-primary" /></div>}>
      <ExerciseView />
    </Suspense>
  )
}
