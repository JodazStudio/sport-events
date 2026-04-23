import { supabaseAdmin } from '@/lib';
import { BillingStage, BillingDataSchema } from '../types';

export const billingService = {
  /**
   * Fetches global billing data for all stages
   */
  async getGlobalBillingData(): Promise<BillingStage[]> {
    try {
      // Fetch all stages joined with events and managers
      const { data: stages, error: stagesError } = await supabaseAdmin!
        .from('registration_stages')
        .select(`
          *,
          events (
            name,
            slug,
            manager_id,
            managers (
              name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (stagesError) throw stagesError;

      // Enriched data: calculate revenue and commission for each stage
      const enrichedStages = await Promise.all((stages || []).map(async (stage: any) => {
        // Gross Revenue: Sum of amount_ves from all payments where status = 'APPROVED'
        const { data: registrations, error: regError } = await supabaseAdmin!
          .from('registrations')
          .select(`
            id, 
            status,
            payments (
              amount_ves
            )
          `)
          .eq('stage_id', stage.id)
          .eq('status', 'APPROVED');

        if (regError) console.error(`Error fetching registrations for stage ${stage.id}:`, regError);

        let grossRevenueVes = 0;
        let approvedCount = registrations?.length || 0;

        registrations?.forEach((reg: any) => {
          const payment = Array.isArray(reg.payments) ? reg.payments[0] : reg.payments;
          if (payment) {
            grossRevenueVes += Number(payment.amount_ves || 0);
          }
        });

        const platformCommissionUsd = approvedCount * (stage.service_fee || 0);

        return {
          ...stage,
          gross_revenue_ves: grossRevenueVes,
          approved_count: approvedCount,
          platform_commission_usd: platformCommissionUsd,
        };
      }));

      return BillingDataSchema.parse(enrichedStages);
    } catch (error) {
      console.error('Error in billingService.getGlobalBillingData:', error);
      throw error;
    }
  },

  /**
   * Marks a stage as settled
   */
  async settleStage(stageId: string) {
    try {
      const { data, error } = await supabaseAdmin!
        .from('registration_stages')
        .update({ 
          is_settled: true,
          settled_at: new Date().toISOString()
        })
        .eq('id', stageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in billingService.settleStage:', error);
      throw error;
    }
  }
};
