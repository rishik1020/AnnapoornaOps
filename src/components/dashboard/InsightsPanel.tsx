import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MenuItem } from "@/data/mockData";
import { WasteInsight } from "@/agents/wasteAgent";

interface InsightsPanelProps {
  wasteInsights: WasteInsight[];
  menuItems: MenuItem[];
}

export function InsightsPanel({ wasteInsights, menuItems }: InsightsPanelProps) {
  const data = wasteInsights.map(w => {
    const item = menuItems.find(i => i.id === w.itemId);
    return {
      name: item?.name || w.itemId,
      score: w.wasteScore === 'High' ? 3 : w.wasteScore === 'Medium' ? 2 : 1,
      label: w.wasteScore
    };
  }).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Waste & Cost Insights</CardTitle>
        <CardDescription>Top items contributing to potential waste.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border text-popover-foreground p-2 rounded shadow-sm text-xs">
                      <p className="font-bold">{payload[0].payload.name}</p>
                      <p>Risk Level: {payload[0].payload.label}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.label === 'High' ? '#ef4444' : entry.label === 'Medium' ? '#f59e0b' : '#22c55e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>AI Strategy: Reducing prep for high-risk items could save approx. <span className="font-bold text-foreground">₹2,400</span> daily.</p>
        </div>
      </CardContent>
    </Card>
  );
}
