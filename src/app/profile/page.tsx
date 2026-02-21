
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, ChevronLeft, Scale, Target, Ruler, User } from "lucide-react"

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-20 rtl">
      <header className="p-6 bg-white shadow-sm flex flex-col items-center gap-4">
        <div className="w-full flex justify-between items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-headline">الملف الشخصي</h1>
          <Button variant="ghost" size="icon" className="rounded-full text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center overflow-hidden">
             <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">أحمد محمد</h2>
          <p className="text-sm text-muted-foreground">مشترك منذ أكتوبر 2023</p>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Scale className="h-4 w-4 text-primary" />
              <p className="text-lg font-bold">75.2</p>
              <p className="text-[10px] text-muted-foreground">كجم</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Ruler className="h-4 w-4 text-primary" />
              <p className="text-lg font-bold">178</p>
              <p className="text-[10px] text-muted-foreground">سم</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-lg font-bold">70</p>
              <p className="text-[10px] text-muted-foreground">الهدف</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Menu */}
        <div className="space-y-2">
           {[
             { label: "تعديل البيانات الجسدية", icon: Scale },
             { label: "إعدادات الأهداف", icon: Target },
             { label: "تاريخ التمارين", icon: Dumbbell },
             { label: "السجلات الغذائية", icon: UtensilsCrossed },
             { label: "الإشعارات", icon: Bell }
           ].map((item, i) => (
             <Button 
               key={i} 
               variant="ghost" 
               className="w-full h-14 justify-between bg-white px-4 rounded-xl shadow-sm hover:bg-primary/5 group"
             >
                <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex items-center gap-3">
                   <span className="text-sm font-medium">{item.label}</span>
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="h-4 w-4" />
                   </div>
                </div>
             </Button>
           ))}
        </div>

        {/* Daily Progress Overview */}
        <Card className="border-none shadow-sm bg-emerald-600 text-white">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
               <div className="text-right">
                  <h3 className="font-bold text-lg">أنت تبلي حسناً!</h3>
                  <p className="text-xs opacity-90">لقد أكملت 80% من هدفك الأسبوعي.</p>
               </div>
               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  🏆
               </div>
            </div>
            <Button variant="secondary" className="w-full bg-white text-emerald-700 hover:bg-white/90">تحديث الوزن الأسبوعي</Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}

// Missing icons for the mapping above
import { Dumbbell, UtensilsCrossed, Bell } from "lucide-react"
