import { Ingredient, MenuItem } from '../data/mockData';
import { DemandPrediction } from './demandAgent';
import { WasteInsight } from './wasteAgent';

export interface PrepTask {
  itemId: string;
  itemName: string;
  finalQty: number;
  originalPrediction: number;
  adjustmentReason: string | null;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface IngredientNeed {
  ingredientName: string;
  amountNeeded: number;
  currentStock: number;
  unit: string;
  status: 'OK' | 'Short' | 'Excess';
  shortageAmount: number;
  utilization: number; // Percentage of stock used
}

// Helper to calculate ingredients based on current tasks
export const calculateIngredients = (
  tasks: PrepTask[],
  menuItems: MenuItem[],
  ingredients: Ingredient[]
): IngredientNeed[] => {
  const ingredientMap = new Map<string, number>();
  
  tasks.forEach(task => {
    const item = menuItems.find(i => i.id === task.itemId);
    if (item) {
      item.ingredients.forEach(ing => {
        const current = ingredientMap.get(ing.name) || 0;
        ingredientMap.set(ing.name, current + (ing.quantity * task.finalQty));
      });
    }
  });

  return ingredients.map(ing => {
    const needed = ingredientMap.get(ing.name) || 0;
    const status = ing.stock < needed ? 'Short' : (ing.stock > needed * 3 ? 'Excess' : 'OK');
    const utilization = ing.stock > 0 ? (needed / ing.stock) * 100 : 100;

    return {
      ingredientName: ing.name,
      amountNeeded: parseFloat(needed.toFixed(2)),
      currentStock: ing.stock,
      unit: ing.unit,
      status,
      shortageAmount: status === 'Short' ? parseFloat((needed - ing.stock).toFixed(2)) : 0,
      utilization
    };
  });
};

export const generatePrepPlan = (
  menuItems: MenuItem[],
  ingredients: Ingredient[],
  predictions: DemandPrediction[],
  wasteInsights: WasteInsight[]
): { prepTasks: PrepTask[], ingredientNeeds: IngredientNeed[], totalProjectedRevenue: number } => {
  
  const prepTasks: PrepTask[] = predictions.map(pred => {
    const wasteData = wasteInsights.find(w => w.itemId === pred.itemId);
    let finalQty = pred.predictedQty;
    let adjustmentReason = null;

    if (wasteData && wasteData.suggestedReduction > 0) {
      const reduction = Math.round(finalQty * wasteData.suggestedReduction);
      finalQty -= reduction;
      adjustmentReason = wasteData.reason;
    }

    return {
      itemId: pred.itemId,
      itemName: pred.itemName,
      finalQty,
      originalPrediction: pred.predictedQty,
      adjustmentReason,
      confidence: pred.confidence
    };
  });

  const ingredientNeeds = calculateIngredients(prepTasks, menuItems, ingredients);

  const totalProjectedRevenue = prepTasks.reduce((acc, task) => {
    const item = menuItems.find(i => i.id === task.itemId);
    return acc + (item ? item.price * task.finalQty : 0);
  }, 0);

  return { prepTasks, ingredientNeeds, totalProjectedRevenue };
};
