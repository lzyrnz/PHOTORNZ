'use server';
/**
 * @fileOverview Applies AI style transfer to a photo using Gemini 2.5 Flash Image.
 * 
 * - applyAiStyleTransfer - Core function for image generation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ApplyAiStyleTransferInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be styled, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  styleDescription: z.string().describe('The desired visual style.'),
});
export type ApplyAiStyleTransferInput = z.infer<typeof ApplyAiStyleTransferInputSchema>;

const ApplyAiStyleTransferOutputSchema = z.object({
  styledPhotoDataUri: z.string().describe('The generated styled image as a data URI.'),
});
export type ApplyAiStyleTransferOutput = z.infer<typeof ApplyAiStyleTransferOutputSchema>;

/**
 * Uses Gemini 2.5 Flash Image (nano-banana) for true image-to-image style transfer.
 */
export async function applyAiStyleTransfer(input: ApplyAiStyleTransferInput): Promise<ApplyAiStyleTransferOutput> {
  const { photoDataUri, styleDescription } = input;

  const { media } = await ai.generate({
    model: 'googleai/gemini-2.5-flash-image',
    prompt: [
      { media: { url: photoDataUri } },
      { text: `Apply a professional '${styleDescription}' filter to this photo. Preserve the original subject's features and pose perfectly, but transform the lighting, colors, and artistic aesthetic to match the style description. Output ONLY the image.` },
    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  if (!media || !media.url) {
    throw new Error('AI Generation failed to return media.');
  }

  return {
    styledPhotoDataUri: media.url,
  };
}
