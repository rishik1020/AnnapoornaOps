import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CloudRain, PartyPopper, Calendar } from "lucide-react";
import { ScenarioType } from "@/agents/demandAgent";

interface AIExplanationProps {
  scenario: ScenarioType;
}

export function AIExplanation({ scenario }: AIExplanationProps) {
  const getContent = () => {
    switch (scenario) {
      case 'Festival':
        return {
          icon: <PartyPopper className="h-4 w-4 text-orange-500" />,
          title: "Festival Mode Active",
          text: (
            <>
              "I've activated <span className="font-semibold text-orange-600">Festival Mode</span>. 
              Expect a <span className="font-bold">40% surge</span> in Main Courses and Desserts. 
              Prep levels for <span className="font-semibold">Chocolate Lava Cake</span> have been maximized. 
              Ensure extra staff is on standby for the dinner rush."
            </>
          ),
          style: "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900"
        };
      case 'Rainy':
        return {
          icon: <CloudRain className="h-4 w-4 text-blue-500" />,
          title: "Weather Adaptation: Rainy",
          text: (
            <>
              "Heavy rain detected. I've shifted the strategy to <span className="font-semibold text-blue-600">Comfort Foods</span>. 
              Increased prep for <span className="font-semibold">Manchow Soup</span> (+25%) and reduced cold salads (-30%). 
              Delivery packaging stock check is recommended."
            </>
          ),
          style: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900"
        };
      case 'Weekend':
        return {
          icon: <Calendar className="h-4 w-4 text-purple-500" />,
          title: "Weekend Surge Strategy",
          text: (
            <>
              "Standard <span className="font-semibold text-purple-600">Weekend Protocol</span> applied. 
              All prep quantities boosted by 30% to match historical Saturday trends. 
              <span className="font-semibold">Maharaja Burger</span> stock is critical for lunch service."
            </>
          ),
          style: "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900"
        };
      default:
        return {
          icon: <Sparkles className="h-4 w-4 text-indigo-500" />,
          title: "Standard Daily Operations",
          text: (
            <>
              "Operating on <span className="font-semibold text-indigo-600">Standard Efficiency</span> model. 
              I've conservatively reduced <span className="font-semibold">Grilled Salmon</span> prep by 10% due to recent leftover trends. 
              Please prioritize restocking <span className="font-semibold text-red-600 dark:text-red-400">Romaine Lettuce</span>."
            </>
          ),
          style: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900"
        };
    }
  };

  const content = getContent();

  return (
    <Card className={`transition-colors duration-500 ${content.style}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {content.icon}
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {content.text}
        </p>
      </CardContent>
    </Card>
  );
}
