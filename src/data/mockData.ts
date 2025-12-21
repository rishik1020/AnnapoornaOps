import { faker } from '@faker-js/faker';

export interface MenuItem {
  id: string;
  name: string;
  category: 'Main' | 'Starter' | 'Dessert';
  price: number;
  ingredients: { name: string; quantity: number; unit: string }[];
  historicalSales: number[]; // Last 7 days
  historicalLeftovers: number[]; // Last 7 days
}

export interface Ingredient {
  name: string;
  stock: number;
  unit: string;
  costPerUnit: number;
  minThreshold: number;
}

// Updated prices to realistic INR values
const MENU_ITEMS_DATA = [
  { name: 'Grilled Salmon', category: 'Main', price: 1850, ingredients: [{ name: 'Salmon Fillet', quantity: 0.2, unit: 'kg' }, { name: 'Lemon', quantity: 0.5, unit: 'pc' }] },
  { name: 'Caesar Salad', category: 'Starter', price: 450, ingredients: [{ name: 'Romaine Lettuce', quantity: 0.15, unit: 'kg' }, { name: 'Parmesan', quantity: 0.05, unit: 'kg' }] },
  { name: 'Maharaja Burger', category: 'Main', price: 550, ingredients: [{ name: 'Ground Beef', quantity: 0.2, unit: 'kg' }, { name: 'Burger Bun', quantity: 1, unit: 'pc' }] },
  { name: 'Manchow Soup', category: 'Starter', price: 280, ingredients: [{ name: 'Carrots', quantity: 0.1, unit: 'kg' }, { name: 'Potatoes', quantity: 0.1, unit: 'kg' }] },
  { name: 'Chocolate Lava Cake', category: 'Dessert', price: 350, ingredients: [{ name: 'Dark Chocolate', quantity: 0.1, unit: 'kg' }, { name: 'Eggs', quantity: 2, unit: 'pc' }] },
];

export const generateMockData = () => {
  const menuItems: MenuItem[] = MENU_ITEMS_DATA.map((item, index) => {
    // Simulate trends: Randomly assign if an item is trending up, down, or stable
    const trend = faker.helpers.arrayElement(['up', 'down', 'stable']);
    const baseSales = faker.number.int({ min: 20, max: 80 });
    
    const historicalSales = Array.from({ length: 7 }).map((_, i) => {
      let daily = baseSales;
      if (trend === 'up') daily += i * 2;
      if (trend === 'down') daily -= i * 2;
      return Math.max(0, Math.round(daily + faker.number.int({ min: -5, max: 5 })));
    });

    // Simulate leftovers (inefficiency)
    const historicalLeftovers = historicalSales.map(sales => 
      Math.round(sales * faker.number.float({ min: 0, max: 0.15 }))
    );

    return {
      id: `item-${index}`,
      ...item,
      category: item.category as any,
      historicalSales,
      historicalLeftovers,
    };
  });

  // Updated costs to realistic INR values
  const ingredients: Ingredient[] = [
    { name: 'Salmon Fillet', stock: 10, unit: 'kg', costPerUnit: 2200, minThreshold: 5 },
    { name: 'Lemon', stock: 50, unit: 'pc', costPerUnit: 10, minThreshold: 20 },
    { name: 'Romaine Lettuce', stock: 5, unit: 'kg', costPerUnit: 180, minThreshold: 8 }, // Intentionally low
    { name: 'Parmesan', stock: 10, unit: 'kg', costPerUnit: 1200, minThreshold: 2 },
    { name: 'Ground Beef', stock: 30, unit: 'kg', costPerUnit: 600, minThreshold: 10 },
    { name: 'Burger Bun', stock: 100, unit: 'pc', costPerUnit: 15, minThreshold: 40 },
    { name: 'Carrots', stock: 20, unit: 'kg', costPerUnit: 60, minThreshold: 5 },
    { name: 'Potatoes', stock: 25, unit: 'kg', costPerUnit: 40, minThreshold: 5 },
    { name: 'Dark Chocolate', stock: 8, unit: 'kg', costPerUnit: 850, minThreshold: 3 },
    { name: 'Eggs', stock: 200, unit: 'pc', costPerUnit: 8, minThreshold: 50 },
  ];

  return { menuItems, ingredients };
};

export const MOCK_DATA = generateMockData();
