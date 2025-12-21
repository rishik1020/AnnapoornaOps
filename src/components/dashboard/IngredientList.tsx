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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IngredientNeed } from "@/agents/prepAgent";
import { AlertTriangle, CheckCircle, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface IngredientListProps {
  ingredients: IngredientNeed[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  // Sort: Shortages first
  const sorted = [...ingredients].sort((a, b) => {
    if (a.status === 'Short' && b.status !== 'Short') return -1;
    if (a.status !== 'Short' && b.status === 'Short') return 1;
    return 0;
  });

  const handleOrder = (name: string, amount: number, unit: string) => {
    toast.success(`Order Placed: ${amount} ${unit} of ${name}`, {
      description: "Vendor has been notified via email.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          Ingredient Prep List
          <Badge variant="secondary" className="text-xs font-normal">
            Live Updates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] overflow-auto pr-2 custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Ingredient</TableHead>
                <TableHead className="text-center">Stock vs Need</TableHead>
                <TableHead className="text-center w-[80px]">Status</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {sorted.map((ing) => (
                <motion.tr 
                  key={ing.ingredientName}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell className="font-medium py-3">
                    <div className="flex flex-col">
                      <span>{ing.ingredientName}</span>
                      <span className="text-xs text-muted-foreground">{ing.amountNeeded} {ing.unit} needed</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{ing.currentStock} {ing.unit} in stock</span>
                        <span>{Math.min(100, ing.utilization).toFixed(0)}% used</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (ing.currentStock / ing.amountNeeded) * 100)} 
                        className={`h-2 ${ing.status === 'Short' ? "[&>div]:bg-red-500 bg-red-100" : "[&>div]:bg-green-500 bg-green-100"}`} 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    {ing.status === 'Short' ? (
                      <Badge variant="destructive" className="text-[10px] px-1.5 h-5">
                        Short
                      </Badge>
                    ) : ing.status === 'Excess' ? (
                      <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                        Excess
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-green-200 text-green-700">
                        OK
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    {ing.status === 'Short' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleOrder(ing.ingredientName, ing.shortageAmount, ing.unit)}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
