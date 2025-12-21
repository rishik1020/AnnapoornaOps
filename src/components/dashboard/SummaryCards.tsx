import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, IndianRupee, Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface SummaryProps {
  totalDemand: number;
  projectedRevenue: number;
  wasteReduction: number;
  criticalShortages: number;
}

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{value.toLocaleString('en-IN')}{suffix}
    </motion.span>
  );
};

export function SummaryCards({ totalDemand, projectedRevenue, wasteReduction, criticalShortages }: SummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Projected Demand</CardTitle>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={totalDemand} suffix=" dishes" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">+12% from yesterday</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Est. Revenue</CardTitle>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={projectedRevenue} prefix="₹" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Based on prep plan</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Waste Risk</CardTitle>
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={wasteReduction} prefix="-" suffix="%" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Predicted reduction</p>
        </CardContent>
      </Card>

      <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 ${criticalShortages > 0 ? "border-l-red-500 bg-red-50/50 dark:bg-red-900/10" : "border-l-gray-300"}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Stock Alerts</CardTitle>
          <div className={`p-2 rounded-full ${criticalShortages > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
            <TrendingDown className={`h-4 w-4 ${criticalShortages > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${criticalShortages > 0 ? "text-red-600 dark:text-red-400" : ""}`}>
             <AnimatedNumber value={criticalShortages} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Critical shortages</p>
        </CardContent>
      </Card>
    </div>
  );
}
