
"use client"

import { useState } from 'react'
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Plus, Loader2, UtensilsCrossed, AlertCircle } from "lucide-react"
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
      setIsEstimating(true)
      try {
        const output = await estimateCalories({ photoDataUri: base64 })
        setResult(output)
      } catch (error) {
        console.error(error)
      } finally {
        setIsEstimating(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-background pb-24 rtl">
      <header className="p-6 bg-white shadow-sm flex justify-between items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Plus className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold font-headline">سجل التغذية</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Daily Macros Card */}
        <Card className="border-none shadow-sm">
          <CardHeader className="p-4 pb-0 text-right">
            <CardTitle className="text-sm font-bold text-muted-foreground">ملخص اليوم</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">1,200</p>
                <p className="text-[10px] text-muted-foreground">مستهلك</p>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-primary">650</p>
                <p className="text-[10px] text-muted-foreground">متبقي</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>85/150g</span>
                  <span className="font-bold">بروتين</span>
                </div>
                <Progress value={56} className="h-1.5 bg-muted" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>140/220g</span>
                  <span className="font-bold">كربوهيدرات</span>
                </div>
                <Progress value={63} className="h-1.5 bg-muted" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>45/70g</span>
                  <span className="font-bold">دهون</span>
                </div>
                <Progress value={64} className="h-1.5 bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Camera Section */}
        <div className="space-y-3">
          <h2 className="text-right font-bold text-sm">أضف وجبة بالذكاء الاصطناعي</h2>
          <label className="block">
            <div className="relative w-full aspect-[16/6] bg-primary/10 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/20 transition-all overflow-hidden">
              {isEstimating ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">جاري تحليل الوجبة...</p>
                </div>
              ) : photo ? (
                 <div className="absolute inset-0">
                    <Image src={photo} alt="Food" fill className="object-cover opacity-50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                       <Camera className="h-8 w-8 text-white mb-2" />
                       <span className="text-white font-bold">تغيير الصورة</span>
                    </div>
                 </div>
              ) : (
                <>
                  <Camera className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-bold text-primary">صور وجبتك الآن</p>
                  <p className="text-[10px] text-muted-foreground">سنقوم بحساب السعرات لك</p>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleCapture} disabled={isEstimating} />
            </div>
          </label>
        </div>

        {/* AI Analysis Result */}
        {result && (
          <Card className="border-none shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-primary/5 border-b p-4 text-right">
              <CardTitle className="text-sm font-bold flex justify-between items-center">
                 <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{result.totalCalories} سعرة</span>
                 نتائج التحليل الذكي
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                {result.foodItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg text-right">
                    <span className="font-bold text-primary">{item.calories} س</span>
                    <div className="flex-1 mr-3">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.estimatedPortionSize}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                <div className="text-center p-2 rounded-lg bg-emerald-50 text-emerald-700">
                   <p className="text-xs font-bold">{result.totalProteinGrams}ج</p>
                   <p className="text-[10px]">بروتين</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-teal-50 text-teal-700">
                   <p className="text-xs font-bold">{result.totalCarbsGrams}ج</p>
                   <p className="text-[10px]">كارب</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-orange-50 text-orange-700">
                   <p className="text-xs font-bold">{result.totalFatsGrams}ج</p>
                   <p className="text-[10px]">دهون</p>
                </div>
              </div>
              <Button className="w-full bg-primary" onClick={() => {setResult(null); setPhoto(null)}}>تأكيد وإضافة للسجل</Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Meals */}
        <div className="space-y-3">
          <h2 className="text-right font-bold text-sm">الوجبات الأخيرة</h2>
          <div className="space-y-2">
            {[
              { name: "شوفان بالحليب والموز", cal: 350, time: "08:30 ص" },
              { name: "أرز ودجاج مشوي مع سلطة", cal: 580, time: "02:15 م" }
            ].map((meal, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <div className="text-left">
                   <p className="font-bold text-primary">{meal.cal} سعرة</p>
                   <p className="text-[10px] text-muted-foreground">{meal.time}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium">{meal.name}</p>
                </div>
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                   <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
