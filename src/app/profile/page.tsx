
"use client"

import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, ChevronLeft, Scale, Target, Ruler, User, Bell, Moon, Share2 } from "lucide-react"
import { useUser, useDoc, useMemoFirebase, useAuth, useFirestore } from "@/firebase"
import { doc } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function Profile() {
  const { user } = useUser()
  const auth = useAuth()
  const db = useFirestore()
  const router = useRouter()

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid, 'profile_data', user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(profileRef);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 rtl page-transition-fade">
      <header className="p-8 pt-12 flex flex-col items-center gap-6 bg-card rounded-b-[3rem] shadow-lg border-b border-white/5">
        <h1 className="font-medium-title text-white">ملفي</h1>
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center overflow-hidden shadow-xl">
             <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-white">{user?.displayName || 'بطل تماريني'}</h2>
          <p className="text-[12px] text-muted-foreground">{user?.email || ''}</p>
        </div>

        <div className="grid grid-cols-3 gap-8 w-full px-4 text-white">
           <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile?.daysActive || 0}</span>
              <span className="text-[10px] text-muted-foreground">يوم</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-accent">{profile?.streak || 0}🔥</span>
              <span className="text-[10px] text-muted-foreground">streak</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile?.totalStepsAllTime || 0}</span>
              <span className="text-[10px] text-muted-foreground">خطوات</span>
           </div>
        </div>
      </header>

      <main className="px-6 mt-8 space-y-6">
        {/* Physical Data Cards */}
        <section className="space-y-3">
           <Card className="bg-card border-none rounded-2xl active:scale-98 transition-transform cursor-pointer">
              <CardContent className="p-4 flex justify-between items-center">
                 <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                 <div className="flex items-center gap-3">
                    <div className="text-right">
                       <p className="font-bold text-white">{profile?.weightKg || 0} kg</p>
                       <p className="text-[10px] text-muted-foreground">وزني</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                       <Scale className="h-5 w-5" />
                    </div>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-card border-none rounded-2xl active:scale-98 transition-transform cursor-pointer">
              <CardContent className="p-4 flex justify-between items-center">
                 <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                 <div className="flex items-center gap-3">
                    <div className="text-right">
                       <p className="font-bold text-white">{profile?.heightCm || 0} cm</p>
                       <p className="text-[10px] text-muted-foreground">طولي</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                       <Ruler className="h-5 w-5" />
                    </div>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-card border-none rounded-2xl active:scale-98 transition-transform cursor-pointer">
              <CardContent className="p-4 flex justify-between items-center">
                 <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                 <div className="flex items-center gap-3">
                    <div className="text-right">
                       <p className="font-bold text-white">{profile?.goal || 'تحديد الهدف'}</p>
                       <p className="text-[10px] text-muted-foreground">هدفي</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                       <Target className="h-5 w-5" />
                    </div>
                 </div>
              </CardContent>
           </Card>
        </section>

        {/* Action Menu */}
        <section className="space-y-2 pt-4">
           {[
             { label: "الإشعارات", icon: Bell },
             { label: "الوضع الليلي", icon: Moon },
             { label: "مشاركة التطبيق", icon: Share2 },
             { label: "تسجيل الخروج", icon: LogOut, danger: true, onClick: handleSignOut }
           ].map((item, i) => (
             <Button 
               key={i} 
               variant="ghost" 
               onClick={item.onClick}
               className={cn(
                 "w-full h-14 justify-between bg-card px-4 rounded-2xl border border-white/5 active:scale-95 transition-transform",
                 item.danger ? "text-destructive hover:bg-destructive/10" : "text-white hover:bg-white/5"
               )}
             >
                <ChevronLeft className="h-5 w-5 opacity-40" />
                <div className="flex items-center gap-4">
                   <span className="text-sm font-medium">{item.label}</span>
                   <item.icon className={cn("h-5 w-5", item.danger ? "text-destructive" : "text-primary")} />
                </div>
             </Button>
           ))}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
