
"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dumbbell } from "lucide-react"
import { getDayProgram } from "@/lib/workout-program"

function RestView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const day = parseInt(searchParams.get('day') || '1')
  const index = parseInt(searchParams.get('index') || '0')
  const set = parseInt(searchParams.get('set') || '1')

  const dayData = useMemo(() => getDayProgram('beginner', day), [day])
  const exercises = dayData.exercises
  const ex = exercises[index]

  const [restTimer, setRestTimer] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleRestComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [restTimer])

  const handleRestComplete = () => {
    const isNextSet = set < ex.sets
    if (isNextSet) {
      router.push(`/workout/exercise?day=${day}&index=${index}&set=${set + 1}`)
    } else if (index < exercises.length - 1) {
      router.push(`/workout/exercise?day=${day}&index=${index + 1}`)
    } else {
      router.push('/dashboard') // تم إكمال التمرين
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 rtl text-center page-transition-fade">
      <span className="font-medium-title text-white mb-10">خذ راحتك! 💪</span>
      
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

      <Button variant="ghost" className="mt-10 text-muted-foreground font-medium" onClick={handleRestComplete}>
        تخطى الراحة ←
      </Button>
    </div>
  )
}

export default function RestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RestView />
    </Suspense>
  )
}
