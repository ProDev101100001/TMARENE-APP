
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'fitness-hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-6 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">ت</div>
          <h1 className="text-2xl font-bold text-primary font-headline">تماريني</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-full max-w-lg aspect-video mb-8 rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/fit/800/600"}
            alt="Hero Fitness"
            fill
            className="object-cover"
            data-ai-hint="fitness exercise"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <p className="text-white text-xl font-bold text-right">ابدأ رحلتك نحو حياة صحية أفضل اليوم</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4 font-headline text-foreground">أهلاً بك في تماريني</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          تتبع خطواتك، تمارينك، وسعراتك الحرارية مع مساعدنا الذكي. كل ما تحتاجه للوصول لهدفك في مكان واحد.
        </p>

        <div className="grid gap-4 w-full max-w-sm">
          <Link href="/onboarding">
            <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90">
              إنشاء حساب جديد
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full h-12 text-lg font-medium border-primary text-primary hover:bg-primary/5">
              تسجيل الدخول
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-muted-foreground flex flex-col items-center gap-4">
          <p>أو سجل الدخول بواسطة</p>
          <div className="flex gap-4">
            <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 bg-white border">
               <span className="sr-only">Google</span>
               <div className="w-5 h-5 bg-red-500 rounded-sm"></div>
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 bg-white border">
               <span className="sr-only">Facebook</span>
               <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 bg-white border text-black">
               <span className="sr-only">Apple</span>
               <div className="w-5 h-5 bg-black rounded-sm"></div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
