import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function AskAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Namaste! I am Annapurna, your Kitchen Ops AI. How can I assist with today's prep?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let response = "I'm analyzing the latest data...";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes("waste") || lower.includes("reduce")) {
        response = "I've flagged 'Grilled Salmon' for waste reduction today due to 15% leftovers yesterday. Reducing prep by 10% should save costs without risking stockouts.";
      } else if (lower.includes("prep") || lower.includes("cook")) {
        response = "Focus on 'Maharaja Burger' first. We expect a 20% demand spike due to the weekend trend. Ensure buns are thawed.";
      } else if (lower.includes("stock") || lower.includes("buy")) {
        response = "Critical Alert: We are short on 'Romaine Lettuce'. You need 3.5kg more for the projected Caesar Salad demand.";
      } else if (lower.includes("festival") || lower.includes("diwali")) {
        response = "For festivals, I recommend increasing dessert prep by 40%. Shall I activate 'Festival Mode'?";
      } else {
        response = "I can help optimize your kitchen. Try asking: 'Why is Salmon prep reduced?' or 'What are the critical shortages?'";
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Card className="flex flex-col h-[450px] border-orange-100 dark:border-orange-900 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="py-3 px-4 border-b bg-orange-50/50 dark:bg-orange-950/20">
        <CardTitle className="text-sm flex items-center gap-2 text-orange-700 dark:text-orange-300">
          <Sparkles className="h-4 w-4" />
          Ask Annapurna
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden bg-gradient-to-b from-white to-orange-50/30 dark:from-background dark:to-background">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8 border shadow-sm">
                  <AvatarFallback className={m.role === 'ai' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}>
                    {m.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-2xl px-4 py-2 text-sm max-w-[85%] shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-tr-none' 
                    : 'bg-white border text-slate-700 rounded-tl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-orange-100 text-orange-700"><Bot size={16} /></AvatarFallback>
                </Avatar>
                <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-2 text-sm shadow-sm dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t bg-background">
        <form 
          className="flex w-full gap-2"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <Input 
            placeholder="Ask about tomorrow's plan..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 focus-visible:ring-orange-500"
          />
          <Button type="submit" size="icon" disabled={isTyping} className="bg-orange-600 hover:bg-orange-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
