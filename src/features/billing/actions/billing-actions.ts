'use server';

import { revalidatePath } from 'next/cache';
import { billingService } from '../services/billing-service';

export async function settleStageAction(prevState: any, formData: FormData) {
  const stageId = formData.get('stageId') as string;
  
  if (!stageId) {
    return { error: 'Stage ID is required' };
  }

  try {
    await billingService.settleStage(stageId);
    revalidatePath('/dashboard/master-billing');
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to settle stage' };
  }
}
