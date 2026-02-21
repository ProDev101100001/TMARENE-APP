
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { useUser, useFirestore } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates'

export default function Onboarding() {
  const router = useRouter()
  const { user } = useUser()
  const db = useFirestore()
  
  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    goal: 'weight-loss',
    level: 'beginner',
    frequency: '3'
  })

  const totalSteps = 3

  const nextStep = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      if (!user) return
      
      setIsSaving(true)
      const weight = parseFloat(formData.weight)
      const height = parseFloat(formData.height)
      const age = parseInt(formData.age)
      
      // Basic BMI & TDEE calculation
      const bmi = weight / ((height / 100) ** 2)
      const tdee = weight * 22 * (formData.level === 'beginner' ? 1.2 : 1.5)

      const profileData = {
        id: user.uid,
        age: age,
        weightKg: weight,
        heightCm: height,
        gender: formData.gender === 'male' ? 'ذكر' : 'أنثى',
        goal: formData.goal,
        activityLevel: formData.level,
        weeklyWorkoutFrequency: parseInt(formData.frequency),
        preferredSports: ['مشي'],
        healthRestrictions: 'لا يوجد',
        bmi: parseFloat(bmi.toFixed(1)),
        tdee: Math.round(tdee),
        userWorkoutProgressId: 'current'
      }

      try {
        const userRef = doc(db, 'users', user.uid, 'profile', user.uid);
        setDocumentNonBlocking(userRef, profileData, { merge: true });
        router.push('/dashboard')
      } catch (error) {
        console.error("Error saving profile:", error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col rtl">
      <div className="mb-8">
        <Progress value={(step / totalSteps) * 100} className="h-2 bg-muted" />
        <p className="text-xs text-muted-foreground mt-2 text-center font-medium">الخطوة {step} من {totalSteps}</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {step === 1 && (
          <Card className="w-full max-w-md shadow-lg border-none animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="text-right">
              <CardTitle className="text-2xl font-headline text-primary">المعلومات الجسدية</CardTitle>
              <CardDescription>أخبرنا قليلاً عن نفسك لنقوم بتخصيص خطتك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-right">
                  <Label htmlFor="weight">الوزن (كجم)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    placeholder="75" 
                    className="text-right"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
                <div className="space-y-2 text-right">
                  <Label htmlFor="height">الطول (سم)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    placeholder="175" 
                    className="text-right"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <Label htmlFor="age">العمر</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="25" 
                  className="text-right"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>الجنس</Label>
                <RadioGroup 
                  defaultValue={formData.gender} 
                  onValueChange={(v) => setFormData({...formData, gender: v})}
                  className="flex flex-row-reverse gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">ذكر</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">أنثى</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="w-full max-w-md shadow-lg border-none animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="text-right">
              <CardTitle className="text-2xl font-headline text-primary">الأهداف والنشاط</CardTitle>
              <CardDescription>ما الذي تطمح لتحقيقه؟</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              <div className="space-y-3">
                <Label>ما هو هدفك الرئيسي؟</Label>
                <RadioGroup 
                  defaultValue={formData.goal} 
                  onValueChange={(v) => setFormData({...formData, goal: v})}
                  className="grid gap-2"
                >
                  <Label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-primary/5 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                    خسارة وزن <RadioGroupItem value="weight-loss" />
                  </Label>
                  <Label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-primary/5 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                    بناء عضلات <RadioGroupItem value="muscle-gain" />
                  </Label>
                  <Label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-primary/5 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                    لياقة عامة <RadioGroupItem value="fitness" />
                  </Label>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <Label>مستوى النشاط الحالي</Label>
                <RadioGroup 
                  defaultValue={formData.level} 
                  onValueChange={(v) => setFormData({...formData, level: v})}
                  className="grid gap-2"
                >
                  <Label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-primary/5 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                    مبتدئ <RadioGroupItem value="beginner" />
                  </Label>
                  <Label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-primary/5 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                    متوسط <RadioGroupItem value="intermediate" />
                  </Label>
                  <Label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-primary/5 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                    متقدم <RadioGroupItem value="advanced" />
                  </Label>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="w-full max-w-md shadow-lg border-none animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="text-right">
              <CardTitle className="text-2xl font-headline text-primary">جاهز للبدء؟</CardTitle>
              <CardDescription>لقد قمنا بتحليل بياناتك وتجهيز خطة مخصصة لك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              <div className="p-4 bg-primary/10 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">
                    {(parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2)).toFixed(1)}
                  </span>
                  <span className="text-sm">BMI المتوقع:</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">
                    {Math.round(parseFloat(formData.weight) * 22 * (formData.level === 'beginner' ? 1.2 : 1.5))}
                  </span>
                  <span className="text-sm">السعرات المثالية:</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground leading-relaxed px-4">
                بناءً على أهدافك، قمنا بتصميم برنامج تمارين لمدة 30 يوماً يركز على {formData.goal === 'weight-loss' ? 'حرق الدهون' : 'تقوية العضلات'}.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-auto flex justify-between gap-4 py-4">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} className="flex-1 rounded-xl h-12" disabled={isSaving}>
            <ChevronLeft className="mr-2 h-4 w-4" /> السابق
          </Button>
        )}
        <Button onClick={nextStep} className="flex-1 bg-primary rounded-xl h-12 shadow-md hover:bg-primary/90 transition-all" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {step === totalSteps ? 'ابدأ الآن' : 'التالي'} <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
