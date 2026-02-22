"use client"

import { useState } from 'react'
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Flame, Play, Square, History } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function StepsPage() {
  const [isTracking, setIsTracking] = useState(false)
  const steps = 4200
  const goal = 10000
  const progress = (steps / goal) * 100
  const distance = (steps * 0.00076).toFixed(1)
  const calories = (steps * 0.04).toFixed(0)

  return (
    <div className="min-h-screen bg-background pb-24 rtl page-transition-slide-right">
      <header className="p-6 pt-10 sticky top-0 z-10 bg-background/80 backdrop-blur-md flex justify-between items-center">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-xl text-white">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="font-medium-title">خطواتي اليوم</h1>
        <Button variant="ghost" size="icon" className="rounded-xl text-white">
          <History className="h-5 w-5" />
        </Button>
      </header>

      <main className="px-6 space-y-8">
        {/* Step Progress Hero */}
        <section className="flex flex-col items-center justify-center py-6">
          <div className="relative w-64 h-64 flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
               <circle cx="128" cy="128" r="110" stroke="#2D374880" strokeWidth="12" fill="transparent" />
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
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-none rounded-2xl">
            <CardContent className="p-5 flex flex-col items-center gap-2">
              <span className="text-2xl font-bold">{distance} km</span>
              <span className="text-[12px] text-muted-foreground">مسافة</span>
            </CardContent>
          </Card>
          <Card className="bg-card border-none rounded-2xl">
            <CardContent className="p-5 flex flex-col items-center gap-2">
              <span className="text-2xl font-bold">{calories} 🔥</span>
              <span className="text-[12px] text-muted-foreground">سعرات</span>
            </CardContent>
          </Card>
        </section>

        {/* Map Placeholder */}
        <section className="space-y-4">
          <div className="w-full aspect-video bg-card rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
             <MapPin className="h-10 w-10 text-primary opacity-20" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
             <p className="absolute bottom-4 text-xs text-muted-foreground font-medium">مسارك اليوم موضح بالأخضر</p>
          </div>
        </section>

        {/* Tracking Action */}
        <Button 
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-lg btn-animate gap-2 shadow-lg",
            isTracking ? "bg-destructive text-white" : "bg-primary text-background"
          )}
          onClick={() => setIsTracking(!isTracking)}
        >
          {isTracking ? (
            <> <Square className="h-5 w-5 fill-current" /> إيقاف التتبع </>
          ) : (
            <> <Play className="h-5 w-5 fill-current" /> ابدأ تتبع المشي الآن </>
          )}
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}
