
export type ExerciseDetail = {
  nameAr: string;
  sets: number;
  reps: string;
  restSeconds: number;
  lottieId: string;
};

export type DayProgram = {
  day: number;
  titleAr: string;
  type: 'workout' | 'active_rest' | 'full_rest';
  exercises: ExerciseDetail[];
};

/**
 * دالة للحصول على رابط Lottie بناءً على المعرف
 * نستخدم روابط مباشرة من CDN أو روابط تجريبية
 */
export const getLottieUrl = (id: string) => {
  if (id === 'plank') return 'https://assets8.lottiefiles.com/packages/lf20_m6mshzwp.json';
  if (id === 'lunge') return 'https://assets3.lottiefiles.com/packages/lf20_968msc.json';
  if (id === 'crunch') return 'https://assets5.lottiefiles.com/packages/lf20_6p0k4z.json';
  if (id === 'bicycle') return 'https://assets10.lottiefiles.com/packages/lf20_vnikly.json';
  if (id === 'mountain') return 'https://assets1.lottiefiles.com/packages/lf20_3rwqz7.json';
  
  // لروابط IconScout المذكورة في الـ SOP
  return `https://assets9.lottiefiles.com/packages/lf20_${id}.json`;
};

export const BEGINNER_PROGRAM: DayProgram[] = [
  {
    day: 1,
    titleAr: "اليوم 1: القوة الأساسية",
    type: 'workout',
    exercises: [
      { nameAr: "سكوات", sets: 3, reps: "10", restSeconds: 60, lottieId: "10469948" },
      { nameAr: "ضغط على الركبتين", sets: 3, reps: "8", restSeconds: 60, lottieId: "10469915" },
      { nameAr: "بلانك", sets: 3, reps: "20ث", restSeconds: 60, lottieId: "plank" }
    ]
  },
  {
    day: 2,
    titleAr: "🚶 راحة نشطة — مشي 15 دقيقة",
    type: 'active_rest',
    exercises: []
  },
  {
    day: 3,
    titleAr: "اليوم 3: توازن وقوة",
    type: 'workout',
    exercises: [
      { nameAr: "لانج متبادل", sets: 3, reps: "10 لكل رجل", restSeconds: 60, lottieId: "lunge" },
      { nameAr: "سوبرمان", sets: 3, reps: "10", restSeconds: 60, lottieId: "10469938" },
      { nameAr: "رفع كعب", sets: 3, reps: "15", restSeconds: 60, lottieId: "calf-raise" }
    ]
  },
  {
    day: 4,
    titleAr: "اليوم 4: الجزء العلوي والكور",
    type: 'workout',
    exercises: [
      { nameAr: "ضغط", sets: 3, reps: "8", restSeconds: 60, lottieId: "10469916" },
      { nameAr: "جسر أرداف", sets: 3, reps: "12", restSeconds: 60, lottieId: "glute-bridge" },
      { nameAr: "كرنش", sets: 3, reps: "15", restSeconds: 60, lottieId: "crunch" }
    ]
  },
  {
    day: 5,
    titleAr: "اليوم 5: سكوات وأرجل",
    type: 'workout',
    exercises: [
      { nameAr: "سكوات", sets: 3, reps: "12", restSeconds: 60, lottieId: "10469948" },
      { nameAr: "بلانك جانبي", sets: 3, reps: "20ث", restSeconds: 60, lottieId: "side-plank" },
      { nameAr: "رفع أرجل", sets: 3, reps: "10", restSeconds: 60, lottieId: "10469934" }
    ]
  },
  {
    day: 7,
    titleAr: "😴 راحة كاملة",
    type: 'full_rest',
    exercises: []
  }
];

export const INTERMEDIATE_PROGRAM: DayProgram[] = [
  {
    day: 1,
    titleAr: "اليوم 1: قوة متوسطة",
    type: 'workout',
    exercises: [
      { nameAr: "ضغط بطيء 3ث", sets: 4, reps: "10", restSeconds: 45, lottieId: "10469916" },
      { nameAr: "بولغيريان سكوات", sets: 4, reps: "10 لكل رجل", restSeconds: 45, lottieId: "10469913" },
      { nameAr: "بلانك", sets: 4, reps: "35ث", restSeconds: 45, lottieId: "plank" }
    ]
  }
];

export const ADVANCED_PROGRAM: DayProgram[] = [
  {
    day: 1,
    titleAr: "اليوم 1: تحدي المتقدمين",
    type: 'workout',
    exercises: [
      { nameAr: "ضغط تصفيق", sets: 4, reps: "8", restSeconds: 30, lottieId: "clap-push" },
      { nameAr: "بيستول سكوات", sets: 4, reps: "6 لكل رجل", restSeconds: 30, lottieId: "10469912" },
      { nameAr: "L-Sit", sets: 4, reps: "20ث", restSeconds: 30, lottieId: "L-sit" }
    ]
  }
];

export const getDayProgram = (level: string, day: number): DayProgram => {
  let programSource = BEGINNER_PROGRAM;
  if (level === 'intermediate') programSource = INTERMEDIATE_PROGRAM;
  if (level === 'advanced') programSource = ADVANCED_PROGRAM;

  const program = programSource.find(p => p.day === day);
  if (program) return program;
  
  // منطق تكرار أو توليد أيام افتراضية إذا لم تكن موجودة في المصفوفة
  const isRest = day % 7 === 0;
  const isActiveRest = day % 7 === 2;

  if (isRest) {
    return { day, titleAr: "😴 راحة كاملة", type: 'full_rest', exercises: [] };
  }
  if (isActiveRest) {
    return { day, titleAr: "🚶 راحة نشطة — مشي 20 دقيقة", type: 'active_rest', exercises: [] };
  }

  // افتراضي لليوم غير المعرف
  return {
    day,
    titleAr: `تمرين اليوم ${day}`,
    type: 'workout',
    exercises: [
       { nameAr: "سكوات", sets: 3, reps: "12", restSeconds: 60, lottieId: "10469948" },
       { nameAr: "ضغط", sets: 3, reps: "10", restSeconds: 60, lottieId: "10469916" },
       { nameAr: "بلانك", sets: 3, reps: "30ث", restSeconds: 60, lottieId: "plank" }
    ]
  };
};
