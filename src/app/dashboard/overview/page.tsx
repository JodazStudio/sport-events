import OverviewView from "@/components/dashboard/overview-view";
import LiveResultsView from "@/components/dashboard/live-results-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Activity } from "lucide-react";

export default function OverviewPage() {
  return (
    <Tabs defaultValue="overview" className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <TabsList className="bg-muted/50 border-2 border-black p-1 rounded-none h-auto">
          <TabsTrigger 
            value="overview" 
            className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black italic uppercase text-[10px] tracking-widest px-6 py-2 transition-all gap-2"
          >
            <LayoutDashboard className="size-3" />
            Resumen
          </TabsTrigger>
          <TabsTrigger 
            value="live" 
            className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black italic uppercase text-[10px] tracking-widest px-6 py-2 transition-all gap-2"
          >
            <Activity className="size-3" />
            Resultados en Vivo
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-0 border-none p-0 outline-none">
        <OverviewView />
      </TabsContent>
      
      <TabsContent value="live" className="mt-0 border-none p-0 outline-none">
        <LiveResultsView />
      </TabsContent>
    </Tabs>
  );
}
