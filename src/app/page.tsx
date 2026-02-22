
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Apple, Mail, Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithGoogle, signInWithApple, signInWithMicrosoft } from '@/lib/auth-providers';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { MicrosoftIcon } from '@/components/icons/MicrosoftIcon';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignIn = async (provider: string, signInFn: () => Promise<any>) => {
    setLoadingProvider(provider);
    try {
      await signInFn();
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      
      if (error.code === 'auth/operation-not-allowed') {
        toast({
          variant: "destructive",
          title: "المزود غير مفعل",
          description: `طريقة تسجيل الدخول عبر ${provider} غير مفعلة في Firebase Console. يرجى تفعيلها من إعدادات Authentication.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "فشل تسجيل الدخول",
          description: error.message || "حدث خطأ غير متوقع، حاول مرة أخرى.",
        });
      }
    } finally {
      setLoadingProvider(null);
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
          <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-background font-bold text-5xl mx-auto shadow-2xl">
            ت
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">تماريني 💪</h1>
            <p className="text-muted-foreground font-regular-body">رفيقك نحو حياة أفضل</p>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="grid gap-3 w-full animate-in slide-in-from-bottom-10 duration-700">
          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={() => handleSignIn('Apple', () => signInWithApple(auth))}
            disabled={loadingProvider !== null}
          >
            {loadingProvider === 'Apple' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Apple className="h-5 w-5" />}
            <span>تسجيل بـ Apple</span>
            <div className="w-5" />
          </Button>

          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={() => handleSignIn('Google', () => signInWithGoogle(auth))}
            disabled={loadingProvider !== null}
          >
             {loadingProvider === 'Google' ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon className="h-5 w-5" />}
            <span>تسجيل بـ Google</span>
            <div className="w-5" />
          </Button>

          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={() => handleSignIn('Microsoft', () => signInWithMicrosoft(auth))}
            disabled={loadingProvider !== null}
          >
             {loadingProvider === 'Microsoft' ? <Loader2 className="h-5 w-5 animate-spin" /> : <MicrosoftIcon className="h-5 w-5" />}
            <span>تسجيل بـ Microsoft</span>
            <div className="w-5" />
          </Button>

          <Button 
            className="w-full h-14 rounded-2xl bg-card border border-white/10 text-base font-medium flex items-center justify-between px-6 btn-animate shadow-sm"
            onClick={() => router.push('/auth/email')}
            disabled={loadingProvider !== null}
          >
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>البريد الإلكتروني</span>
            <div className="w-5" />
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground px-8 leading-relaxed opacity-60">
          بالتسجيل توافق على <span className="underline cursor-pointer">الشروط</span> و <span className="underline cursor-pointer">سياسة الخصوصية</span>
        </p>
      </main>
    </div>
  );
}
