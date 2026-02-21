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
  name: z.string().describe('The name of the identified food item.'),
  estimatedPortionSize: z
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
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
  prompt: `Analyze this food image and provide the following details in a structured JSON format:

1.  A list of identified food items.
2.  Estimated portion sizes for each item.
3.  Estimated calories per item.
4.  Estimated macronutrients (protein, carbs, fats in grams) per item.
5.  The total estimated calories for the entire meal.
6.  The total estimated macronutrients (protein, carbs, fats in grams) for the entire meal.

Return the output strictly as a JSON object matching the output schema provided.

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
