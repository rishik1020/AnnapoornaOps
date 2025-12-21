import { MenuItem } from '../data/mockData';

export type ScenarioType = 'Standard' | 'Festival' | 'Rainy' | 'Weekend';

export interface DemandPrediction {
  itemId: string;
  itemName: string;
  predictedQty: number;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
  trend: 'up' | 'down' | 'stable';
}

export const predictDemand = (items: MenuItem[], scenario: ScenarioType = 'Standard'): DemandPrediction[] => {
  return items.map(item => {
    const recentSales = item.historicalSales.slice(-3);
    const avgSales = recentSales.reduce((a, b) => a + b, 0) / recentSales.length;
    
    let predicted = avgSales;
    let reasoning = "Based on 3-day average.";
    let confidence: 'High' | 'Medium' | 'Low' = 'High';

    // Scenario Logic
    switch (scenario) {
      case 'Festival':
        if (item.category === 'Dessert' || item.category === 'Main') {
          predicted *= 1.4; // 40% boost
          reasoning = "Festival surge detected. Expecting heavy dine-in volume.";
        } else {
          predicted *= 1.1;
          reasoning = "Slight increase due to holiday footfall.";
        }
        break;
      
      case 'Rainy':
        if (item.name.includes('Soup') || item.name.includes('Coffee') || item.category === 'Main') {
          predicted *= 1.25; // Comfort food boost
          reasoning = "Rainy weather forecast: High demand for comfort foods.";
        } else if (item.category === 'Starter' && item.name.includes('Salad')) {
          predicted *= 0.7; // Cold food drop
          reasoning = "Rainy weather: Reduced demand for cold starters.";
        } else {
          predicted *= 0.9; // General dip in walk-ins
          reasoning = "Rain may reduce walk-in traffic slightly.";
        }
        break;

      case 'Weekend':
        predicted *= 1.3;
        reasoning = "Weekend traffic multiplier applied.";
        break;

      default: // Standard
        // Random fluctuation for "Standard"
        predicted *= 1.0;
        reasoning = "Standard weekday projection.";
        break;
    }

    // Rounding
    predicted = Math.round(predicted);

    // Calculate Confidence based on variance
    const variance = Math.max(...recentSales) - Math.min(...recentSales);
    if (variance > 15) confidence = 'Low';
    else if (variance > 8) confidence = 'Medium';

    // Trend detection
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentSales[2] > recentSales[0] * 1.1) trend = 'up';
    if (recentSales[2] < recentSales[0] * 0.9) trend = 'down';

    return {
      itemId: item.id,
      itemName: item.name,
      predictedQty: predicted,
      confidence,
      trend,
      reasoning
    };
  });
};
