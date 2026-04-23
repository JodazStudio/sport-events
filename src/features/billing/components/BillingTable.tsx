'use client';

import { useActionState, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Badge, Button, Progress 
} from '@/components/ui';
import { CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { BillingStage } from '../types';
import { settleStageAction } from '../actions/billing-actions';
import { cn } from '@/lib';

interface BillingTableProps {
  stages: BillingStage[];
  searchQuery: string;
  filter: 'all' | 'unpaid' | 'settled';
}

export function BillingTable({ stages, searchQuery, filter }: BillingTableProps) {
  const filteredStages = stages.filter(s => {
    const managerName = s.events?.managers?.name || '';
    const eventName = s.events?.name || '';
    
    const matchesSearch = 
      eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      managerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unpaid') return matchesSearch && !s.is_settled;
    if (filter === 'settled') return matchesSearch && s.is_settled;
    return matchesSearch;
  });

  return (
    <div className="border-2 border-foreground/10 bg-card shadow-[8px_8px_0px_0px_hsl(var(--foreground)/0.05)] overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/30 border-b-2 border-foreground/10">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[300px] font-satoshi font-black uppercase text-[10px] tracking-[0.2em] px-6 py-5 text-foreground italic">
              Event & Manager
            </TableHead>
            <TableHead className="font-satoshi font-black uppercase text-[10px] tracking-[0.2em] py-5 text-foreground italic">
              Stage
            </TableHead>
            <TableHead className="font-satoshi font-black uppercase text-[10px] tracking-[0.2em] py-5 text-foreground italic">
              Capacity
            </TableHead>
            <TableHead className="font-satoshi font-black uppercase text-[10px] tracking-[0.2em] py-5 text-foreground italic">
              Platform Debt
            </TableHead>
            <TableHead className="font-satoshi font-black uppercase text-[10px] tracking-[0.2em] py-5 text-foreground italic">
              Status
            </TableHead>
            <TableHead className="text-right font-satoshi font-black uppercase text-[10px] tracking-[0.2em] px-6 py-5 text-foreground italic">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-32 border-none">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-secondary/20 rounded-none border-2 border-dashed border-foreground/10">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-satoshi font-black uppercase italic text-lg tracking-tight">No Records Detected</p>
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Awaiting financial synchronization...</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredStages.map((stage) => (
              <BillingTableRow key={stage.id} stage={stage} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function BillingTableRow({ stage }: { stage: BillingStage }) {
  const [state, formAction, isPending] = useActionState(settleStageAction, null);

  const totalCap = stage.total_capacity || 1;
  const usedCap = stage.used_capacity || 0;
  const progress = Math.min((usedCap / totalCap) * 100, 100);
  const isOverdue = !stage.is_settled && stage.end_date && new Date() > new Date(stage.end_date);

  return (
    <TableRow className="hover:bg-secondary/10 transition-colors border-b border-foreground/5 group">
      <TableCell className="px-6 py-6">
        <div className="font-satoshi font-black uppercase italic text-base tracking-tight group-hover:text-primary transition-colors">
          {stage.events?.name || 'Unknown Event'}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Manager:
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-foreground">
            {stage.events?.managers?.name || 'Unassigned'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] font-black uppercase tracking-tighter text-foreground bg-secondary/50 px-2 py-0.5 w-fit border border-foreground/5">
            {stage.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="min-w-[180px]">
        <div className="flex flex-col gap-2 max-w-[140px]">
          <div className="flex justify-between font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>{usedCap} REG</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary overflow-hidden border border-foreground/5">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-lg font-black font-satoshi italic text-foreground leading-tight">
          <span className="text-primary mr-0.5">$</span>
          {(stage.platform_commission_usd || 0).toFixed(2)}
        </div>
        <div className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-tight mt-0.5">
          {(stage.gross_revenue_ves || 0).toLocaleString()} VES
        </div>
      </TableCell>
      <TableCell>
        {stage.is_settled ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-satoshi font-black uppercase italic text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-200 w-fit">
              <CheckCircle2 className="h-3 w-3" /> Settled
            </div>
            {stage.settled_at && (
              <div className="font-mono text-[8px] font-bold text-muted-foreground uppercase pl-0.5">
                {format(new Date(stage.settled_at), 'dd.MM.yyyy')}
              </div>
            )}
          </div>
        ) : isOverdue ? (
          <div className="flex items-center gap-1.5 font-satoshi font-black uppercase italic text-[10px] text-destructive bg-destructive/10 px-2 py-1 border border-destructive/20 w-fit animate-pulse">
            <Clock className="h-3 w-3" /> Overdue
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-satoshi font-black uppercase italic text-[10px] text-amber-600 bg-amber-50 px-2 py-1 border border-amber-200 w-fit">
            <Clock className="h-3 w-3" /> Pending
          </div>
        )}
      </TableCell>
      <TableCell className="text-right px-6">
        {!stage.is_settled ? (
          <form action={formAction}>
            <input type="hidden" name="stageId" value={stage.id} />
            <Button 
              type="submit"
              variant="mechanical" 
              size="sm"
              disabled={isPending}
              className="h-9 px-4"
            >
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Confirm Settlement'
              )}
            </Button>
          </form>
        ) : (
          <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-50">
            [ ARCHIVED ]
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}
