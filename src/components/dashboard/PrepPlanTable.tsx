import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { PrepTask } from "@/agents/prepAgent";
import { Info, Minus, Plus, UserCog, BarChart2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { MenuItem } from "@/data/mockData";

interface PrepPlanTableProps {
  tasks: PrepTask[];
  menuItems: MenuItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export function PrepPlanTable({ tasks, menuItems, onUpdateQuantity }: PrepPlanTableProps) {
  
  const getHistoricalData = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return [];
    return item.historicalSales.map((sales, i) => ({ day: `Day ${i+1}`, sales }));
  };

  return (
    <Card className="col-span-1 lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Item-wise Prep Plan</span>
          <Badge variant="outline" className="font-normal text-muted-foreground bg-muted/50">
            <UserCog className="mr-1 h-3 w-3" />
            Human-in-the-loop Active
          </Badge>
        </CardTitle>
        <CardDescription>AI-recommended preparation quantities. Adjust if necessary.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Menu Item</TableHead>
              <TableHead className="text-center">Rec. Qty</TableHead>
              <TableHead className="text-center">Confidence</TableHead>
              <TableHead>AI Reasoning</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.itemId} className={`transition-colors ${task.finalQty !== task.originalPrediction && !task.adjustmentReason ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-muted/50"}`}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{task.itemName}</span>
                    {task.adjustmentReason && (
                       <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                         <Info className="h-3 w-3" /> Waste Risk Detected
                       </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2 bg-background border rounded-md p-1 shadow-sm w-fit mx-auto">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 hover:bg-muted hover:text-red-500"
                      onClick={() => onUpdateQuantity(task.itemId, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="flex flex-col items-center min-w-[2.5rem]">
                      <span className="font-bold text-base">{task.finalQty}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 hover:bg-muted hover:text-green-500"
                      onClick={() => onUpdateQuantity(task.itemId, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  {task.finalQty !== task.originalPrediction && (
                    <div className="text-center mt-1">
                      <span className="text-[10px] text-muted-foreground line-through">
                        AI: {task.originalPrediction}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={task.confidence === 'High' ? 'default' : task.confidence === 'Medium' ? 'secondary' : 'outline'}
                    className={task.confidence === 'High' ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-100 border-green-200' : ''}
                  >
                    {task.confidence}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate" title={task.adjustmentReason || "Standard prediction"}>
                  {task.adjustmentReason || "Standard prediction based on recent trends."}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{task.itemName} - Demand Analysis</DialogTitle>
                        <DialogDescription>Historical sales trend over the last 7 days.</DialogDescription>
                      </DialogHeader>
                      <div className="h-[200px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={getHistoricalData(task.itemId)}>
                            <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" hide />
                            <YAxis hide />
                            <RechartsTooltip />
                            <Area type="monotone" dataKey="sales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        <p><strong>AI Note:</strong> Demand for {task.itemName} is {task.confidence === 'High' ? 'highly predictable' : 'volatile'}. {task.adjustmentReason}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
