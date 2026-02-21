
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Apple, Mail, Smartphone, Facebook } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'fitness-hero');

  return (
    <div className="flex flex-col min-h-screen bg-background rtl">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-lg mb-4">ت</div>
          <h1 className="text-3xl font-bold text-primary font-headline">تماريني</h1>
          <p className="text-muted-foreground mt-2">ابدأ رحلتك نحو حياة صحية أفضل اليوم</p>
        </div>

        {/* Auth Buttons Section */}
        <div className="grid gap-3 w-full">
          <Button variant="outline" className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50">
            <Apple className="h-5 w-5" />
            <span>تسجيل الدخول بـ Apple</span>
            <div className="w-5" />
          </Button>

          <Button variant="outline" className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50">
             <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">G</div>
            <span>تسجيل الدخول بـ Google</span>
            <div className="w-5" />
          </Button>

          <Button variant="outline" className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50">
            <Facebook className="h-5 w-5 text-blue-600 fill-blue-600" />
            <span>تسجيل الدخول بـ Facebook</span>
            <div className="w-5" />
          </Button>

          <Button variant="outline" className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <span>تسجيل الدخول برقم الجوال</span>
            <div className="w-5" />
          </Button>

          <Link href="/onboarding" className="w-full">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-muted-foreground/20 text-base font-medium flex items-center justify-between px-6 hover:bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>تسجيل الدخول بالإيميل</span>
              <div className="w-5" />
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-[10px] text-muted-foreground px-8 leading-relaxed">
          بتسجيلك توافق على <span className="underline">الشروط</span> و <span className="underline">سياسة الخصوصية</span>
        </p>

        {/* Quick Link to Dashboard for existing users */}
        <Link href="/dashboard" className="mt-6 text-sm text-primary font-bold">
          لديك حساب بالفعل؟ سجل دخولك
        </Link>
      </main>
    </div>
  );
}
