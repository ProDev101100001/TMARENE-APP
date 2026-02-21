
"use client"

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Apple, Mail, Smartphone, Facebook, Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleQuickSignIn = async () => {
    try {
      await signInAnonymously(auth);
      // Auth state change will trigger the useEffect above
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background rtl">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
        {/* Logo Section */}
        <div className="mb-8 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-lg mb-4">ت</div>
          <h1 className="text-3xl font-bold text-primary font-headline">تماريني</h1>
          <p className="text-muted-foreground mt-2">ابدأ رحلتك نحو حياة صحية أفضل اليوم</p>
        </div>

        {/* Auth Buttons Section */}
        <div className="grid gap-3 w-full animate-in slide-in-from-bottom-10 duration-700">
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50 transition-all active:scale-95"
            onClick={handleQuickSignIn}
          >
            <Apple className="h-5 w-5" />
            <span>تسجيل الدخول بـ Apple</span>
            <div className="w-5" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50 transition-all active:scale-95"
            onClick={handleQuickSignIn}
          >
             <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">G</div>
            <span>تسجيل الدخول بـ Google</span>
            <div className="w-5" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50 transition-all active:scale-95"
            onClick={handleQuickSignIn}
          >
            <Facebook className="h-5 w-5 text-blue-600 fill-blue-600" />
            <span>تسجيل الدخول بـ Facebook</span>
            <div className="w-5" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50 transition-all active:scale-95"
            onClick={handleQuickSignIn}
          >
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <span>تسجيل الدخول برقم الجوال</span>
            <div className="w-5" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50 transition-all active:scale-95"
            onClick={handleQuickSignIn}
          >
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>تسجيل الدخول بالإيميل</span>
            <div className="w-5" />
          </Button>
        </div>

        <p className="mt-8 text-[10px] text-muted-foreground px-8 leading-relaxed opacity-60">
          بتسجيلك توافق على <span className="underline">الشروط</span> و <span className="underline">سياسة الخصوصية</span>
        </p>
      </main>
    </div>
  );
}
