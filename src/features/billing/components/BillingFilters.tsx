'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input, Button } from '@/components/ui';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib';

export function BillingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('q') || '';
  const currentFilter = searchParams.get('filter') || 'all';

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-card p-6 border-2 border-foreground/10 shadow-[4px_4px_0px_0px_hsl(var(--foreground)/0.05)]">
      <div className="relative w-full md:w-[450px]">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
          isPending ? "text-primary animate-pulse" : "text-muted-foreground"
        )} />
        <Input
          placeholder="SEARCH EVENT OR MANAGER ID..."
          className="pl-12 h-12 rounded-none border-2 border-foreground/10 bg-secondary/20 font-mono text-xs uppercase tracking-widest focus-visible:ring-primary focus-visible:border-primary transition-all"
          defaultValue={currentSearch}
          onChange={(e) => updateParams('q', e.target.value)}
        />
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="flex bg-secondary p-1 border border-foreground/10 w-full md:w-auto">
        <FilterButton 
          active={currentFilter === 'all'} 
          onClick={() => updateParams('filter', 'all')}
          label="ALL_STAGES"
        />
        <FilterButton 
          active={currentFilter === 'unpaid'} 
          onClick={() => updateParams('filter', 'unpaid')}
          label="UNPAID"
        />
        <FilterButton 
          active={currentFilter === 'settled'} 
          onClick={() => updateParams('filter', 'settled')}
          label="SETTLED"
        />
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 md:flex-none px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] italic transition-all",
        active 
          ? "bg-foreground text-background shadow-[2px_2px_0px_0px_hsl(var(--primary))] scale-[1.02]" 
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
      )}
    >
      {label}
    </button>
  );
}
