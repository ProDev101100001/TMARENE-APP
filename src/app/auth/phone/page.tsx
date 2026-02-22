
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Smartphone, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PhoneAuth() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    // منطق إرسال OTP
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    // منطق التحقق من OTP
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
        <h1 className="text-xl font-bold flex-1 text-center">رقم الجوال</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col gap-8 max-w-md mx-auto w-full">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <Smartphone className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">
            {step === 'phone' ? 'أدخل رقم جوالك' : 'أدخل رمز التحقق'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {step === 'phone' 
              ? 'سنرسل لك رمزاً للتحقق من هويتك' 
              : 'أرسلنا الرمز المكون من 6 أرقام لهاتفك'}
          </p>
        </div>

        <div className="space-y-4">
          {step === 'phone' ? (
            <div className="flex gap-2" dir="ltr">
              <Input className="w-20 text-center bg-card border-none h-14" value="+966" disabled />
              <Input className="flex-1 bg-card border-none h-14 text-center" placeholder="50 000 0000" type="tel" />
            </div>
          ) : (
            <Input className="bg-card border-none h-14 text-center text-2xl tracking-[1em]" placeholder="000000" maxLength={6} />
          )}

          <Button 
            className="w-full h-14 rounded-2xl bg-primary text-background font-bold text-lg btn-animate"
            onClick={step === 'phone' ? handleSendOtp : handleVerifyOtp}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (step === 'phone' ? 'إرسال الرمز' : 'تحقق')}
          </Button>
        </div>
      </main>
    </div>
  );
}
