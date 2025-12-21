import { useEffect, useState } from 'react';
import { MOCK_DATA } from './data/mockData';
import { predictDemand, ScenarioType } from './agents/demandAgent';
import { analyzeWaste } from './agents/wasteAgent';
import { generatePrepPlan, PrepTask, IngredientNeed, calculateIngredients } from './agents/prepAgent';

import { SummaryCards } from './components/dashboard/SummaryCards';
import { PrepPlanTable } from './components/dashboard/PrepPlanTable';
import { IngredientList } from './components/dashboard/IngredientList';
import { InsightsPanel } from './components/dashboard/InsightsPanel';
import { AskAI } from './components/dashboard/AskAI';
import { AIExplanation } from './components/dashboard/AIExplanation';
import { Button } from './components/ui/button';
import { Calendar, ChefHat, RefreshCw, CheckCheck, CloudRain, PartyPopper, Sun } from 'lucide-react';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

function App() {
  const [scenario, setScenario] = useState<ScenarioType>('Standard');
  const [prepData, setPrepData] = useState<{
    tasks: PrepTask[];
    ingredients: IngredientNeed[];
    revenue: number;
    totalDemand: number;
    wasteInsights: any[];
  } | null>(null);

  const refreshData = (activeScenario: ScenarioType = scenario) => {
    // Simulate "Agentic" Workflow with Scenario
    const predictions = predictDemand(MOCK_DATA.menuItems, activeScenario);
    const wasteInsights = analyzeWaste(MOCK_DATA.menuItems, predictions);
    const plan = generatePrepPlan(MOCK_DATA.menuItems, MOCK_DATA.ingredients, predictions, wasteInsights);

    setPrepData({
      tasks: plan.prepTasks,
      ingredients: plan.ingredientNeeds,
      revenue: plan.totalProjectedRevenue,
      totalDemand: plan.prepTasks.reduce((a, b) => a + b.finalQty, 0),
      wasteInsights
    });
    
    if (activeScenario !== 'Standard') {
      toast.info(`Scenario Applied: ${activeScenario}`, { description: "Demand models updated based on external factors." });
    }
  };

  // Initial Load
  useEffect(() => {
    refreshData('Standard');
  }, []);

  // React to Scenario Change
  const handleScenarioChange = (val: string) => {
    const newScenario = val as ScenarioType;
    setScenario(newScenario);
    refreshData(newScenario);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    if (!prepData) return;

    setPrepData(prev => {
      if (!prev) return null;
      
      const updatedTasks = prev.tasks.map(task => {
        if (task.itemId === itemId) {
          const newQty = Math.max(0, task.finalQty + delta);
          return { ...task, finalQty: newQty };
        }
        return task;
      });

      const updatedIngredients = calculateIngredients(updatedTasks, MOCK_DATA.menuItems, MOCK_DATA.ingredients);
      const newTotalDemand = updatedTasks.reduce((a, b) => a + b.finalQty, 0);
      const newRevenue = updatedTasks.reduce((acc, task) => {
        const item = MOCK_DATA.menuItems.find(i => i.id === task.itemId);
        return acc + (item ? item.price * task.finalQty : 0);
      }, 0);

      return {
        ...prev,
        tasks: updatedTasks,
        ingredients: updatedIngredients,
        totalDemand: newTotalDemand,
        revenue: newRevenue
      };
    });
  };

  const handleFinalize = () => {
    toast.success("Prep Plan Finalized!", {
      description: "Kitchen team has been notified. Inventory orders queued.",
      duration: 5000,
      icon: <CheckCheck className="h-5 w-5 text-green-500" />
    });
  };

  if (!prepData) return <div className="flex items-center justify-center h-screen text-orange-600 animate-pulse">Initializing Annapurna Agents...</div>;

  const criticalShortages = prepData.ingredients.filter(i => i.status === 'Short').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 space-y-6">
      <Toaster position="top-right" theme="light" />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-slate-900 dark:text-slate-100">
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            AnnapurnaOps <span className="text-slate-400 text-lg font-normal">AI Manager</span>
          </h1>
          <p className="text-slate-500 mt-2 ml-1 flex items-center gap-2">
            Operational plan for <span className="font-medium text-slate-900 dark:text-slate-200">{new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center w-full md:w-auto">
          {/* Scenario Simulator */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground ml-2">Simulate:</span>
            <Select value={scenario} onValueChange={handleScenarioChange}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Select Scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard"><div className="flex items-center gap-2"><Sun className="h-3 w-3" /> Standard Day</div></SelectItem>
                <SelectItem value="Weekend"><div className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Weekend Rush</div></SelectItem>
                <SelectItem value="Rainy"><div className="flex items-center gap-2"><CloudRain className="h-3 w-3" /> Rainy Weather</div></SelectItem>
                <SelectItem value="Festival"><div className="flex items-center gap-2"><PartyPopper className="h-3 w-3" /> Festival/Event</div></SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="default" className="bg-green-600 hover:bg-green-700 shadow-sm" onClick={handleFinalize}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Finalize
            </Button>
            <Button variant="outline" size="icon" onClick={() => refreshData(scenario)} className="bg-white">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <SummaryCards 
        totalDemand={prepData.totalDemand}
        projectedRevenue={prepData.revenue}
        wasteReduction={scenario === 'Standard' ? 8 : 12} 
        criticalShortages={criticalShortages}
      />

      {/* Main Content Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        
        {/* Left Column: Prep Plan (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <PrepPlanTable 
            tasks={prepData.tasks} 
            menuItems={MOCK_DATA.menuItems}
            onUpdateQuantity={handleUpdateQuantity} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IngredientList ingredients={prepData.ingredients} />
            <InsightsPanel wasteInsights={prepData.wasteInsights} menuItems={MOCK_DATA.menuItems} />
          </div>
        </div>

        {/* Right Column: AI & Interaction (1/3 width) */}
        <div className="space-y-6">
          <AIExplanation scenario={scenario} />
          <AskAI />
          
          {/* Additional Context Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-dashed border-slate-300 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-sm mb-3 text-slate-700 dark:text-slate-300">System Status</h3>
            <div className="space-y-3 text-xs text-slate-500">
              <div className="flex justify-between items-center">
                <span>Active Model</span>
                <Badge variant="outline" className="font-normal text-[10px]">{scenario} Mode</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Data Ingestion</span>
                <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Sync</span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default App;
