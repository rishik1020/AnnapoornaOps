import { MenuItem } from '../data/mockData';
import { DemandPrediction } from './demandAgent';

export interface WasteInsight {
  itemId: string;
  wasteScore: 'High' | 'Medium' | 'Low';
  suggestedReduction: number; // Percentage to reduce from prediction
  reason: string;
}

export const analyzeWaste = (items: MenuItem[], predictions: DemandPrediction[]): WasteInsight[] => {
  return items.map(item => {
    const totalLeftovers = item.historicalLeftovers.reduce((a, b) => a + b, 0);
    const totalSales = item.historicalSales.reduce((a, b) => a + b, 0);
    const wasteRate = totalLeftovers / (totalSales + totalLeftovers);

    let wasteScore: 'High' | 'Medium' | 'Low' = 'Low';
    let suggestedReduction = 0;
    let reason = "Waste levels are within acceptable limits.";

    if (wasteRate > 0.15) {
      wasteScore = 'High';
      suggestedReduction = 0.10; // Suggest 10% reduction
      reason = `Consistently high leftovers (${(wasteRate * 100).toFixed(0)}%). Recommended conservative prep.`;
    } else if (wasteRate > 0.08) {
      wasteScore = 'Medium';
      suggestedReduction = 0.05;
      reason = "Moderate waste detected. Slight reduction advised.";
    }

    return {
      itemId: item.id,
      wasteScore,
      suggestedReduction,
      reason
    };
  });
};
