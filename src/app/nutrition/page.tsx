"use client"

import { useState } from 'react'
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Plus, Loader2, UtensilsCrossed, AlertTriangle, Edit3, Save, CheckCircle, ChevronLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { estimateCalories, type EstimateCaloriesOutput } from '@/ai/flows/ai-calorie-estimation-flow'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Nutrition() {
  const [isEstimating, setIsEstimating] = useState(false)
  const [result, setResult] = useState<EstimateCaloriesOutput | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      setPhoto(base64)
    }
    reader.readAsDataURL(file)
  }

  const startAnalysis = async () => {
    if (!photo) return
    setIsEstimating(true)
    try {
      const output = await estimateCalories({ photoDataUri: photo })
      setResult(output)
    } catch (error) {
      console.error(error)
    } finally {
      setIsEstimating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 rtl page-transition-fade">
      <header className="p-6 pt-10 bg-background/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-xl text-white">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="font-medium-title">وجباتي اليوم</h1>
        <div className="w-10" />
      </header>

      <main className="px-6 space-y-8">
        {/* Daily Macros Summary Hero */}
        <Card className="bg-card border-none rounded-2xl shadow-sm overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
                <span className="font-hero">1,450</span>
                <p className="text-[14px] text-muted-foreground mt-1">من 2,000 سعرة مستهدفة</p>
                <Progress value={72} className="h-1.5 bg-muted rounded-full mt-4" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                 <p className="text-primary font-bold">85g</p>
                 <p className="text-[10px] text-muted-foreground">بروتين</p>
              </div>
              <div className="text-center">
                 <p className="text-accent font-bold">140g</p>
                 <p className="text-[10px] text-muted-foreground">كارب</p>
              </div>
              <div className="text-center">
                 <p className="text-destructive font-bold">45g</p>
                 <p className="text-[10px] text-muted-foreground">دهون</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Capture Trigger */}
        {!result && (
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-card border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
              {photo ? (
                <>
                  <Image src={photo} alt="الوجبة" fill className="object-cover" />
                  <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center p-6 gap-4">
                    <Button 
                      className="bg-primary text-background font-bold px-8 h-12 rounded-xl btn-animate" 
                      onClick={startAnalysis}
                      disabled={isEstimating}
                    >
                      {isEstimating ? <Loader2 className="h-5 w-5 animate-spin" /> : "تحليل السعرات 🔍"}
                    </Button>
                    <Button variant="ghost" className="text-white underline" onClick={() => setPhoto(null)}>صوّر من جديد</Button>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer p-10 w-full h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Camera className="h-8 w-8" />
                  </div>
                  <p className="font-bold">صوّر وجبتك الآن</p>
                  <p className="text-[12px] text-muted-foreground text-center">سنقوم بحساب السعرات لك بالذكاء الاصطناعي</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleCapture} />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Gemini Result Screen */}
        {result && (
          <div className="space-y-6 page-transition-slide-up pb-10">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-white/5">
               <Image src={photo!} alt="الوجبة" fill className="object-cover" />
               <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                     <p className="text-[10px] text-muted-foreground uppercase">الإجمالي</p>
                     <h3 className="text-2xl font-bold text-primary">{result.totalCalories} سعرة 🔥</h3>
                  </div>
                  <CheckCircle className="h-6 w-6 text-primary" />
               </div>
            </div>

            <Card className="bg-card border-none rounded-2xl overflow-hidden">
               <CardHeader className="p-4 border-b border-white/5">
                  <CardTitle className="font-medium-title text-sm">🤖 نتيجة التحليل</CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-6">
                  <div className="space-y-3">
                    {result.foodItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-background/40 rounded-xl border border-white/5">
                        <div className="text-left">
                           <p className="font-bold text-primary">{item.calories} ك</p>
                           <p className="text-[10px] text-muted-foreground">{item.estimatedPortion}</p>
                        </div>
                        <p className="font-medium">✅ {item.nameAr}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-6">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-primary">{result.totalCalories} سعرة 🔥</span>
                        <span className="font-bold">الإجمالي:</span>
                     </div>
                     <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-xl bg-primary/5 border border-primary/10">
                           <p className="font-bold text-primary">{result.totalProteinGrams}g</p>
                           <p className="text-[10px] text-muted-foreground">بروتين</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-accent/5 border border-accent/10">
                           <p className="font-bold text-accent">{result.totalCarbsGrams}g</p>
                           <p className="text-[10px] text-muted-foreground">كارب</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-destructive/5 border border-destructive/10">
                           <p className="font-bold text-destructive">{result.totalFatsGrams}g</p>
                           <p className="text-[10px] text-muted-foreground">دهون</p>
                        </div>
                     </div>
                  </div>

                  {result.healthNote && (
                    <div className={cn(
                      "p-4 rounded-xl text-xs flex gap-3 items-start",
                      result.warningLevel === 'high' ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-accent/10 text-accent border border-accent/20"
                    )}>
                      <p className="flex-1 text-right">{result.healthNote}</p>
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 pt-4">
                     <Button className="w-full h-14 rounded-2xl bg-primary text-background font-bold btn-animate" onClick={() => {setResult(null); setPhoto(null)}}>
                        حفظ الوجبة ✓
                     </Button>
                     <Button variant="ghost" className="w-full h-12 rounded-2xl text-muted-foreground btn-animate">
                        <Edit3 className="h-4 w-4 ml-2" /> تعديل يدوي
                     </Button>
                  </div>
               </CardContent>
            </Card>
          </div>
        )}

        {/* Recent History */}
        {!result && (
          <section className="space-y-4">
            <h2 className="font-medium-title px-1">الوجبات الأخيرة</h2>
            <div className="space-y-3">
              {[
                { name: "أرز بدجاج", cal: 650, time: "02:15 م", type: "غداء" },
                { name: "فول بالزيت", cal: 450, time: "08:30 ص", type: "فطور" }
              ].map((meal, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-white/5 shadow-sm active:scale-98 transition-transform">
                  <div className="text-left">
                     <p className="font-bold text-primary">{meal.cal} سعرة</p>
                     <p className="text-[10px] text-muted-foreground">{meal.time}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold">{meal.name}</p>
                    <p className="text-[10px] text-muted-foreground">{meal.type}</p>
                  </div>
                  <div className="w-12 h-12 bg-background/50 rounded-xl flex items-center justify-center border border-white/5">
                     <UtensilsCrossed className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-3 items-start mt-8">
               <div className="flex-1 text-right">
                  <p className="text-[10px] font-bold text-primary mb-1">نصيحة اليوم 🤖</p>
                  <p className="text-[12px] text-white">"سعراتك ممتازة اليوم! حاول إضافة سلطة خضراء في وجبة العشاء لزيادة الألياف."</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background text-[10px] font-bold">AI</div>
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
