'use server';

/**
 * @fileOverview An AI agent for suggesting new AR props based on user descriptions.
 *
 * - suggestArProps - A function that handles the AR prop suggestion process.
 * - SuggestArPropsInput - The input type for the suggestArProps function.
 * - SuggestArPropsOutput - The return type for the suggestArProps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestArPropsInputSchema = z.string().describe('A description of the desired AR prop.');
export type SuggestArPropsInput = z.infer<typeof SuggestArPropsInputSchema>;

const SuggestArPropsOutputSchema = z.object({
  prompt: z.string().describe('A prompt to generate AR prop image.'),
  description: z.string().describe('A description of the generated AR prop.'),
});
export type SuggestArPropsOutput = z.infer<typeof SuggestArPropsOutputSchema>;

export async function suggestArProps(input: SuggestArPropsInput): Promise<SuggestArPropsOutput> {
  return suggestArPropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestArPropsPrompt',
  input: {schema: SuggestArPropsInputSchema},
  output: {schema: SuggestArPropsOutputSchema},
  prompt: `You are an expert in generating prompts for AR props based on user descriptions.

  Based on the following description, generate a prompt to create an AR prop image and provide a short description of the generated prop.

  Description: {{{$input}}}`,
});

const suggestArPropsFlow = ai.defineFlow(
  {
    name: 'suggestArPropsFlow',
    inputSchema: SuggestArPropsInputSchema,
    outputSchema: SuggestArPropsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
