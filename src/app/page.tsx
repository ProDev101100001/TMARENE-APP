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
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background rtl page-transition-fade">
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto w-full gap-10">
        {/* Brand Section */}
        <div className="animate-in fade-in zoom-in duration-700 space-y-4">
          <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-background font-bold text-5xl mx-auto shadow-2xl">ت</div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">تماريني 💪</h1>
            <p className="text-muted-foreground font-regular-body">رفيقك نحو حياة أفضل</p>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="grid gap-3 w-full animate-in slide-in-from-bottom-10 duration-700">
          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={handleQuickSignIn}
          >
            <Apple className="h-5 w-5" />
            <span>تسجيل بـ Apple</span>
            <div className="w-5" />
          </Button>

          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={handleQuickSignIn}
          >
             <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] text-white font-bold">G</div>
            <span>تسجيل بـ Google</span>
            <div className="w-5" />
          </Button>

          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={handleQuickSignIn}
          >
            <Facebook className="h-5 w-5 text-blue-500 fill-blue-500" />
            <span>تسجيل بـ Facebook</span>
            <div className="w-5" />
          </Button>

          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={handleQuickSignIn}
          >
            <Smartphone className="h-5 w-5 text-primary" />
            <span>رقم الجوال</span>
            <div className="w-5" />
          </Button>

          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={handleQuickSignIn}
          >
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>البريد الإلكتروني</span>
            <div className="w-5" />
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground px-8 leading-relaxed opacity-60">
          بالتسجيل توافق على <span className="underline">الشروط</span> و <span className="underline">سياسة الخصوصية</span>
        </p>
      </main>
    </div>
  );
}
