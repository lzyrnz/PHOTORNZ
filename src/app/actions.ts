'use server';

import { applyAiStyleTransfer } from '@/ai/flows/apply-ai-style-transfer';
import type { ApplyAiStyleTransferInput } from '@/ai/flows/apply-ai-style-transfer';
import { suggestArProps } from '@/ai/flows/suggest-ar-props';
import type { SuggestArPropsInput } from '@/ai/flows/suggest-ar-props';

export async function handleStyleTransfer(input: ApplyAiStyleTransferInput) {
  try {
    const result = await applyAiStyleTransfer(input);
    return result;
  } catch (error) {
    console.error('Error in style transfer:', error);
    return { error: 'Failed to apply style transfer.' };
  }
}

export async function handleSuggestProp(input: SuggestArPropsInput) {
  try {
    const result = await suggestArProps(input);
    return result;
  } catch (error) {
    console.error('Error suggesting prop:', error);
    return { error: 'Failed to suggest a new prop.' };
  }
}
