
"use client"

import { useState } from 'react'
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Plus, Loader2, UtensilsCrossed, AlertTriangle, Edit3, Save, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { estimateCalories, type EstimateCaloriesOutput } from '@/ai/flows/ai-calorie-estimation-flow'
import Image from 'next/image'

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
    <div className="min-h-screen bg-background pb-24 rtl text-pt-sans">
      <header className="p-6 bg-background/80 backdrop-blur-md shadow-sm flex justify-between items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" className="rounded-full text-white">
          <Plus className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">سجل التغذية</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Daily Macros Summary */}
        <Card className="bg-card border-none shadow-lg overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-3xl font-bold">1,450</p>
                <p className="text-[10px] text-muted-foreground uppercase">مستهلك</p>
              </div>
              <div className="w-px h-10 bg-border/50"></div>
              <div className="text-center flex-1">
                <p className="text-3xl font-bold text-primary">550</p>
                <p className="text-[10px] text-muted-foreground uppercase">متبقي</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Progress value={60} className="h-1 bg-muted" />
                <div className="flex flex-col text-[10px] text-center">
                  <span className="font-bold text-primary">85/150g</span>
                  <span className="text-muted-foreground">بروتين</span>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={45} className="h-1 bg-muted" />
                <div className="flex flex-col text-[10px] text-center">
                  <span className="font-bold text-accent">140/220g</span>
                  <span className="text-muted-foreground">كارب</span>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={75} className="h-1 bg-muted" />
                <div className="flex flex-col text-[10px] text-center">
                  <span className="font-bold text-destructive">45/70g</span>
                  <span className="text-muted-foreground">دهون</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Capture Section */}
        {!result && (
          <div className="space-y-4">
            <h2 className="text-right font-bold text-sm text-muted-foreground uppercase">إضافة وجبة ذكية</h2>
            <div className="relative w-full aspect-[16/9] bg-card border-2 border-dashed border-primary/20 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden group">
              {photo ? (
                <>
                  <Image src={photo} alt="الوجبة" fill className="object-cover" />
                  <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center p-6 gap-4 animate-in fade-in">
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
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Camera className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-bold">صوّر وجبتك الآن</p>
                  <p className="text-[10px] text-muted-foreground">سنقوم بحساب السعرات لك بالذكاء الاصطناعي</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleCapture} />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Gemini Result Screen */}
        {result && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl">
               <Image src={photo!} alt="الوجبة" fill className="object-cover" />
               <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                  <div className="text-left">
                     <p className="text-xs text-muted-foreground uppercase">الإجمالي</p>
                     <h3 className="text-2xl font-bold text-primary">{result.totalCalories} 🔥</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full text-primary">
                     <CheckCircle className="h-4 w-4" />
                     <span className="text-xs font-bold">تم التحليل</span>
                  </div>
               </div>
            </div>

            <Card className="bg-card border-none shadow-xl">
               <CardHeader className="p-4 border-b border-white/5 flex flex-row justify-between items-center">
                  <CardTitle className="text-sm font-bold">🤖 تحليل الوجبة</CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    {result.foodItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-background/50 rounded-xl border border-white/5 text-right">
                        <div className="text-left">
                           <p className="text-sm font-bold text-primary">{item.calories} س</p>
                           <p className="text-[10px] text-muted-foreground">{item.estimatedPortion}</p>
                        </div>
                        <p className="text-sm font-medium">✅ {item.nameAr}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                    <div className="text-center p-3 rounded-2xl bg-primary/10">
                       <p className="text-sm font-bold text-primary">{result.totalProteinGrams}g</p>
                       <p className="text-[10px] text-muted-foreground">بروتين</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-accent/10">
                       <p className="text-sm font-bold text-accent">{result.totalCarbsGrams}g</p>
                       <p className="text-[10px] text-muted-foreground">كارب</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-destructive/10">
                       <p className="text-sm font-bold text-destructive">{result.totalFatsGrams}g</p>
                       <p className="text-[10px] text-muted-foreground">دهون</p>
                    </div>
                  </div>

                  {result.healthNote && (
                    <div className={cn(
                      "p-4 rounded-2xl text-right text-xs flex gap-3",
                      result.warningLevel === 'high' ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-accent/10 text-accent border border-accent/20"
                    )}>
                      <p className="flex-1">{result.healthNote}</p>
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <Button variant="ghost" className="h-12 rounded-xl text-muted-foreground border border-white/5 btn-animate">
                        <Edit3 className="h-4 w-4 ml-2" /> تعديل يدوي
                     </Button>
                     <Button 
                      className="h-12 rounded-xl bg-primary text-background font-bold btn-animate"
                      onClick={() => {setResult(null); setPhoto(null)}}
                    >
                        <Save className="h-4 w-4 ml-2" /> حفظ الوجبة
                     </Button>
                  </div>
               </CardContent>
            </Card>
          </div>
        )}

        {/* Recent History */}
        {!result && (
          <div className="space-y-3">
            <h2 className="text-right font-bold text-sm text-muted-foreground uppercase tracking-widest">الوجبات الأخيرة</h2>
            <div className="space-y-3">
              {[
                { name: "شوفان بالحليب والموز", cal: 350, time: "08:30 ص" },
                { name: "أرز ودجاج مشوي مع سلطة", cal: 580, time: "02:15 م" }
              ].map((meal, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-[1.5rem] shadow-sm group hover:bg-card/80 transition-all border border-transparent hover:border-white/5">
                  <div className="text-left">
                     <p className="text-sm font-bold text-primary">{meal.cal} سعرة</p>
                     <p className="text-[10px] text-muted-foreground">{meal.time}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium">{meal.name}</p>
                  </div>
                  <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center">
                     <UtensilsCrossed className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
