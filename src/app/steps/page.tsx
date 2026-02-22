
"use client"

import { useState, useEffect } from 'react'
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Footprints, MapPin, Flame, TrendingUp, History, Play, Square } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { useUser } from "@/firebase"

const data = [
  { time: '8ص', steps: 400 },
  { time: '10ص', steps: 800 },
  { time: '12م', steps: 1200 },
  { time: '2م', steps: 600 },
  { time: '4م', steps: 900 },
  { time: '6م', steps: 1500 },
  { time: '8م', steps: 300 },
]

export default function StepsPage() {
  const { user } = useUser()
  const [isTracking, setIsTracking] = useState(false)
  const [steps, setSteps] = useState(4200)
  const [goal, setGoal] = useState(10000)

  // حساب المسافة والسعرات التقريبية
  const distance = (steps * 0.00076).toFixed(2) // كم لكل خطوة تقريباً
  const calories = (steps * 0.04).toFixed(0) // سعرة لكل خطوة تقريباً

  const progress = (steps / goal) * 100

  return (
    <div className="min-h-screen bg-background pb-24 rtl text-pt-sans">
      <header className="p-6 bg-background/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="rounded-full text-white">
          <History className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">نشاط الخطوات</h1>
        <div className="w-10" />
      </header>

      <main className="p-4 space-y-6">
        {/* Main Step Counter */}
        <div className="flex flex-col items-center justify-center py-8 relative">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="128" cy="128" r="110" 
                stroke="currentColor" strokeWidth="12" fill="transparent" 
                className="text-muted/20" 
              />
              <circle 
                cx="128" cy="128" r="110" 
                stroke="currentColor" strokeWidth="12" fill="transparent" 
                className="text-primary transition-all duration-1000" 
                strokeDasharray={691} 
                strokeDashoffset={691 - (progress / 100) * 691}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <Footprints className="h-10 w-10 text-primary mx-auto mb-2 animate-bounce" />
              <h2 className="text-5xl font-black text-white">{steps.toLocaleString()}</h2>
              <p className="text-sm text-muted-foreground mt-1">من هدف {goal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-none shadow-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold">{calories}</p>
                <p className="text-[10px] text-muted-foreground uppercase">سعرة محروقة</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-none shadow-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold">{distance}</p>
                <p className="text-[10px] text-muted-foreground uppercase">كيلومتر</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Tracking Button */}
        <Button 
          className={cn(
            "w-full h-16 rounded-2xl font-bold text-lg shadow-lg btn-animate gap-2",
            isTracking ? "bg-destructive hover:bg-destructive/90 text-white" : "bg-primary hover:bg-primary/90 text-background"
          )}
          onClick={() => setIsTracking(!isTracking)}
        >
          {isTracking ? (
            <> <Square className="h-5 w-5 fill-current" /> إيقاف التتبع </>
          ) : (
            <> <Play className="h-5 w-5 fill-current" /> ابدأ تتبع المشي الآن </>
          )}
        </Button>

        {/* Activity Chart */}
        <Card className="bg-card border-none shadow-xl overflow-hidden">
          <CardHeader className="p-4 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> توزيع النشاط اليومي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar dataKey="steps" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#2ECC71' : '#16213E'} />
                    ))}
                  </Bar>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A0A0B0', fontSize: 10 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1A1A2E', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Encouragement */}
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex gap-3 items-start">
          <div className="flex-1 text-right">
            <p className="text-[10px] font-bold text-primary mb-1">تحفيز اليوم 🚀</p>
            <p className="text-xs text-white">"أنت الآن في منتصف الطريق لهدفك! 20 دقيقة مشي إضافية ستجعلك تصل للقمة."</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background text-[10px] font-bold">AI</div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

import { cn } from "@/lib/utils"
