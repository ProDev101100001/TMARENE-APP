
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Mail, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function EmailAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    // منطق تسجيل الدخول بالإيميل
    setTimeout(() => {
      router.push('/onboarding');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col rtl">
      <header className="flex items-center mb-10">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold flex-1 text-center">البريد الإلكتروني</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col gap-8 max-w-md mx-auto w-full">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">مرحباً بك مجدداً</h2>
          <p className="text-muted-foreground text-sm">أدخل بياناتك للمتابعة</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="bg-card border-none h-14 pl-12 text-right" placeholder="example@mail.com" type="email" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground mr-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="bg-card border-none h-14 pl-12 text-right" placeholder="••••••••" type="password" />
            </div>
          </div>

          <Button 
            className="w-full h-14 rounded-2xl bg-primary text-background font-bold text-lg btn-animate"
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'تسجيل الدخول'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ليس لديك حساب؟ <span className="text-primary cursor-pointer font-bold">سجل الآن</span>
          </p>
        </div>
      </main>
    </div>
  );
}
