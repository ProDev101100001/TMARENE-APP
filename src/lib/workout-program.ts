
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

// Map Lottie IDs to a accessible JSON URL from a common CDN or the provided IconScout IDs
// For this demo, we'll use a placeholder structure. In production, you'd use direct .json links.
const getLottieUrl = (id: string) => `https://assets9.lottiefiles.com/packages/lf20_${id}.json`;

export const BEGINNER_PROGRAM: DayProgram[] = [
  {
    day: 1,
    titleAr: "تمرين اليوم 1: القوة الأساسية",
    type: 'workout',
    exercises: [
      { nameAr: "سكوات", sets: 3, reps: "10", restSeconds: 60, lottieId: "10469948" },
      { nameAr: "ضغط على الركبتين", sets: 3, reps: "8", restSeconds: 60, lottieId: "10469915" },
      { nameAr: "بلانك", sets: 3, reps: "20ث", restSeconds: 60, lottieId: "plank" }
    ]
  },
  {
    day: 2,
    titleAr: "راحة نشطة — مشي 15 دقيقة",
    type: 'active_rest',
    exercises: []
  },
  {
    day: 3,
    titleAr: "تمرين اليوم 3: توازن وقوة",
    type: 'workout',
    exercises: [
      { nameAr: "لانج متبادل", sets: 3, reps: "10 لكل رجل", restSeconds: 60, lottieId: "lunge" },
      { nameAr: "سوبرمان", sets: 3, reps: "10", restSeconds: 60, lottieId: "10469938" },
      { nameAr: "رفع كعب", sets: 3, reps: "15", restSeconds: 60, lottieId: "calf-raise" }
    ]
  },
  // Add more days as needed based on the table provided
  {
    day: 4,
    titleAr: "تمرين اليوم 4: الجزء العلوي والكور",
    type: 'workout',
    exercises: [
      { nameAr: "ضغط", sets: 3, reps: "8", restSeconds: 60, lottieId: "10469916" },
      { nameAr: "جسر أرداف", sets: 3, reps: "12", restSeconds: 60, lottieId: "glute-bridge" },
      { nameAr: "كرنش", sets: 3, reps: "15", restSeconds: 60, lottieId: "crunch" }
    ]
  }
];

// Fallback logic for days not explicitly defined yet to ensure app doesn't crash
export const getDayProgram = (level: string, day: number): DayProgram => {
  const program = BEGINNER_PROGRAM.find(p => p.day === day);
  if (program) return program;
  
  // Default structure for missing days
  return {
    day: day,
    titleAr: day % 7 === 0 ? "😴 راحة كاملة" : `تمرين اليوم ${day}`,
    type: day % 7 === 0 ? 'full_rest' : 'workout',
    exercises: day % 7 === 0 ? [] : [
       { nameAr: "سكوات", sets: 3, reps: "10", restSeconds: 60, lottieId: "10469948" },
       { nameAr: "بلانك", sets: 3, reps: "30ث", restSeconds: 60, lottieId: "plank" }
    ]
  };
};
