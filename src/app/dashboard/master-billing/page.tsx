import { Suspense } from 'react';
import { Metadata } from 'next';
import { 
  BillingStats, 
  BillingTable, 
  BillingFilters, 
  billingService 
} from '@/features/billing';
import { akomoService } from '@/features/akomo';
import { Activity, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { revalidatePath } from 'next/cache';

export const metadata: Metadata = {
  title: 'Financial Control Tower | Zonacrono SuperAdmin',
  description: 'Global revenue monitoring and commission settlement system for Zonacrono platform.',
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    filter?: string;
  }>;
}

export default async function MasterBillingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || '';
  const filter = (params.filter as 'all' | 'unpaid' | 'settled') || 'all';

  // We fetch base data here, components will handle their own filtered view if needed
  // but for SEO and RSC efficiency, we can fetch once
  const [stages, exchangeRate] = await Promise.all([
    billingService.getGlobalBillingData(),
    akomoService.getExchangeRate()
  ]);

  async function refreshData() {
    'use server';
    revalidatePath('/dashboard/master-billing');
  }

  return (
    <div className="p-4 md:p-10 space-y-10 max-w-[1600px] mx-auto min-h-screen bg-background blueprint-grid pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-foreground pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground">
              <Activity className="h-6 w-6" />
            </div>
            <span className="font-mono text-xs font-black uppercase tracking-[0.3em] text-primary">
              System.Status.Active
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-satoshi font-black uppercase tracking-tighter italic leading-none">
            Financial <span className="text-primary">Tower</span>
          </h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest max-w-md">
            Centralized clearinghouse for global revenue streams and platform commission settlements.
          </p>
        </div>
        
        <form action={refreshData}>
          <Button variant="mechanical-outline" type="submit" size="lg" className="h-14 px-8">
            <Activity className="h-4 w-4 mr-2" />
            SYNC_FINANCIAL_DATA
          </Button>
        </form>
      </div>

      <div className="space-y-8 animate-fade-in">
        {/* Stats Section */}
        <Suspense fallback={<StatsSkeleton />}>
          <BillingStats stages={stages} exchangeRate={exchangeRate} />
        </Suspense>

        {/* Filters Section */}
        <BillingFilters />

        {/* Main Data Table Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <h2 className="font-satoshi font-black uppercase italic text-sm tracking-widest">
              Live Settlement Ledger
            </h2>
          </div>
          
          <Suspense fallback={<TableSkeleton />}>
            <BillingTable stages={stages} searchQuery={q} filter={filter} />
          </Suspense>
        </div>
      </div>

      {/* Technical Footer Label */}
      <div className="fixed bottom-6 right-10 hidden lg:block">
        <div className="flex items-center gap-4 text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-[0.4em] rotate-90 origin-bottom-right">
          <span>Secure_Auth_SuperAdmin</span>
          <span className="w-12 h-px bg-muted-foreground/30" />
          <span>Ver_2.0.4_Billing_Engine</span>
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-secondary/20 animate-pulse border-2 border-foreground/5" />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="w-full h-96 bg-secondary/10 animate-pulse border-2 border-foreground/5 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Initializing Ledger...
        </span>
      </div>
    </div>
  );
}
