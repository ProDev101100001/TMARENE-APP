'use server';
/**
 * @fileOverview An AI health assistant chat flow.
 *
 * - aiHealthAssistantChat - A function that handles chat interactions with the AI health assistant.
 * - AIHealthAssistantChatInput - The input type for the aiHealthAssistantChat function.
 * - AIHealthAssistantChatOutput - The return type for the aiHealthAssistantChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIHealthAssistantChatInputSchema = z.object({
  message: z.string().describe('The user\'s chat message or question.'),
  userProfile: z.object({
    weight: z.number().optional().describe('User\'s current weight in kg.'),
    height: z.number().optional().describe('User\'s current height in cm.'),
    goal: z.string().optional().describe('User\'s fitness goal (e.g., weight loss, muscle gain).'),
    level: z.string().optional().describe('User\'s activity level (e.g., beginner, intermediate, advanced).'),
  }).optional().describe('Optional: User profile details for personalized advice.'),
  dailySummary: z.object({
    consumedCalories: z.number().optional().describe('Total calories consumed today.'),
    remainingCalories: z.number().optional().describe('Remaining calories for the daily target.'),
    recentMeals: z.array(z.object({
      name: z.string().describe('Name of the meal/food item.'),
      calories: z.number().describe('Calories in the meal/food item.'),
    })).optional().describe('A list of recent meals with their calorie counts.'),
  }).optional().describe('Optional: Daily summary of calorie intake and recent meals for context.'),
});
export type AIHealthAssistantChatInput = z.infer<typeof AIHealthAssistantChatInputSchema>;

const AIHealthAssistantChatOutputSchema = z.object({
  response: z.string().describe('The AI health assistant\'s response.'),
});
export type AIHealthAssistantChatOutput = z.infer<typeof AIHealthAssistantChatOutputSchema>;

export async function aiHealthAssistantChat(input: AIHealthAssistantChatInput): Promise<AIHealthAssistantChatOutput> {
  return aiHealthAssistantChatFlow(input);
}

const aiHealthAssistantChatPrompt = ai.definePrompt({
  name: 'aiHealthAssistantChatPrompt',
  input: { schema: AIHealthAssistantChatInputSchema },
  output: { schema: AIHealthAssistantChatOutputSchema },
  prompt: `أنت مدرب صحي ودود يتحدث بالعربية بأسلوب واضح ومباشر.
مهمتك هي تقديم نصائح صحية مخصصة، تحليل عادات الأكل، تحذير من الأطعمة الضارة أو المفرطة بالسعرات، اقتراح بدائل صحية، والإجابة على أسئلة التغذية والتمارين.
يجب أن تربط نصائحك ببيانات المستخدم المتاحة.

بيانات المستخدم (إذا توفرت):
{{#if userProfile}}
  {{#if userProfile.weight}}الوزن: {{userProfile.weight}} كجم
  {{/if}}
  {{#if userProfile.height}}الطول: {{userProfile.height}} سم
  {{/if}}
  {{#if userProfile.goal}}الهدف: {{userProfile.goal}}
  {{/if}}
  {{#if userProfile.level}}مستوى النشاط: {{userProfile.level}}
  {{/if}}
{{/if}}

ملخص اليوم (إذا توفر):
{{#if dailySummary}}
  {{#if dailySummary.consumedCalories}}السعرات المستهلكة اليوم: {{dailySummary.consumedCalories}} سعرة
  {{/if}}
  {{#if dailySummary.remainingCalories}}السعرات المتبقية لهدفك اليومي: {{dailySummary.remainingCalories}} سعرة
  {{/if}}
  {{#if dailySummary.recentMeals}}
    الوجبات الأخيرة:
    {{#each dailySummary.recentMeals}}
      - {{this.name}} ({{this.calories}} سعرة)
    {{/each}}
  {{/if}}
{{/if}}

سؤال المستخدم: {{{message}}}`,
});

const aiHealthAssistantChatFlow = ai.defineFlow(
  {
    name: 'aiHealthAssistantChatFlow',
    inputSchema: AIHealthAssistantChatInputSchema,
    outputSchema: AIHealthAssistantChatOutputSchema,
  },
  async (input) => {
    const { output } = await aiHealthAssistantChatPrompt(input);
    return output!;
  }
);
