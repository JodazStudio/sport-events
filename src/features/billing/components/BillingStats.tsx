'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DollarSign, Activity, CreditCard } from 'lucide-react';
import { BillingStage } from '../types';

interface BillingStatsProps {
  stages: BillingStage[];
  exchangeRate: number;
}

export function BillingStats({ stages, exchangeRate }: BillingStatsProps) {
  const totalPendingCommissions = stages
    .filter(s => !s.is_settled)
    .reduce((acc, s) => acc + (s.platform_commission_usd || 0), 0);

  const totalProcessedVolumeVes = stages.reduce((acc, s) => acc + (s.gross_revenue_ves || 0), 0);
  const totalProcessedVolumeUsd = totalProcessedVolumeVes / (exchangeRate || 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-2 border-primary/20 bg-card shadow-[4px_4px_0px_0px_hsl(var(--primary)/0.2)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-satoshi font-black uppercase tracking-tight italic text-sm">
            Pending Commissions
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-none border border-primary/20">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black font-satoshi italic text-foreground">
            <span className="text-primary mr-1">$</span>
            {totalPendingCommissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2">
            <span className="font-mono text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 font-bold">
              Unsettled Debt
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-foreground/10 bg-card shadow-[4px_4px_0px_0px_hsl(var(--foreground)/0.1)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-satoshi font-black uppercase tracking-tight italic text-sm">
            Volume (USD)
          </CardTitle>
          <div className="p-2 bg-foreground/5 rounded-none border border-foreground/10">
            <DollarSign className="h-4 w-4 text-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black font-satoshi italic text-foreground">
            <span className="text-muted-foreground mr-1">$</span>
            {totalProcessedVolumeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground mt-2 uppercase tracking-tight">
            EST. RATE: {exchangeRate.toFixed(2)} VES/USD
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-foreground/10 bg-card shadow-[4px_4px_0px_0px_hsl(var(--foreground)/0.1)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-satoshi font-black uppercase tracking-tight italic text-sm">
            Volume (VES)
          </CardTitle>
          <div className="p-2 bg-foreground/5 rounded-none border border-foreground/10">
            <Activity className="h-4 w-4 text-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black font-satoshi italic text-foreground">
            {totalProcessedVolumeVes.toLocaleString()} 
            <span className="text-sm font-mono text-muted-foreground ml-2">VES</span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground mt-2 uppercase tracking-tight">
            Total gross revenue processed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
