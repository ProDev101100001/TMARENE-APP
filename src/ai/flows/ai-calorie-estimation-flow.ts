
'use server';
/**
 * @fileOverview An AI agent for estimating calories and macronutrients from a food image.
 *
 * - estimateCalories - A function that handles the calorie estimation process.
 * - EstimateCaloriesInput - The input type for the estimateCalories function.
 * - EstimateCaloriesOutput - The return type for the estimateCalories function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const EstimateCaloriesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EstimateCaloriesInput = z.infer<typeof EstimateCaloriesInputSchema>;

const FoodItemSchema = z.object({
  nameAr: z.string().describe('The Arabic name of the identified food item.'),
  estimatedPortion: z
    .string()
    .describe('The estimated portion size of the food item (e.g., "1 cup", "100g").'),
  calories: z.number().describe('The estimated calories for this food item.'),
  proteinGrams: z
    .number()
    .describe('The estimated protein in grams for this food item.'),
  carbsGrams: z
    .number()
    .describe('The estimated carbohydrates in grams for this food item.'),
  fatsGrams: z
    .number()
    .describe('The estimated fats in grams for this food item.'),
});

const EstimateCaloriesOutputSchema = z.object({
  foodItems: z.array(FoodItemSchema).describe('A list of identified food items with their details.'),
  totalCalories: z
    .number()
    .describe('The total estimated calories for the entire meal.'),
  totalProteinGrams: z
    .number()
    .describe('The total estimated protein in grams for the entire meal.'),
  totalCarbsGrams: z
    .number()
    .describe('The total estimated carbohydrates in grams for the entire meal.'),
  totalFatsGrams: z
    .number()
    .describe('The total estimated fats in grams for the entire meal.'),
  healthNote: z.string().describe('A short Arabic health advice or insight about the meal.'),
  warningLevel: z.enum(['none', 'low', 'medium', 'high']).describe('The health warning level.'),
});
export type EstimateCaloriesOutput = z.infer<typeof EstimateCaloriesOutputSchema>;

export async function estimateCalories(
  input: EstimateCaloriesInput,
): Promise<EstimateCaloriesOutput> {
  return estimateCaloriesFlow(input);
}

const estimateCaloriesPrompt = ai.definePrompt({
  name: 'estimateCaloriesPrompt',
  input: {schema: EstimateCaloriesInputSchema},
  output: {schema: EstimateCaloriesOutputSchema},
  model: googleAI.model('gemini-2.5-flash-image'),
  prompt: `حلل هذه الوجبة وأعطني النتيجة بصيغة JSON فقط:

1. قائمة بالأطعمة المحددة باللغة العربية.
2. الكميات المقدرة لكل صنف.
3. السعرات المقدرة لكل صنف.
4. المغذيات الكبرى (بروتين، كارب، دهون بالجرام) لكل صنف.
5. الإجمالي للوجبة كاملة.
6. نصيحة صحية قصيرة بالعربي (healthNote).
7. مستوى التحذير الصحي (warningLevel) بناءً على جودة الوجبة.

Image: {{media url=photoDataUri}}`,
});

const estimateCaloriesFlow = ai.defineFlow(
  {
    name: 'estimateCaloriesFlow',
    inputSchema: EstimateCaloriesInputSchema,
    outputSchema: EstimateCaloriesOutputSchema,
  },
  async input => {
    const {output} = await estimateCaloriesPrompt(input);
    if (!output) {
      throw new Error('Failed to estimate calories from the image.');
    }
    return output;
  },
);
