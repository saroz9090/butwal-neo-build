import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";
import chatbotData from "@/data/chatbotData.json";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = chatbotData.greetings[Math.floor(Math.random() * chatbotData.greetings.length)];
      setMessages([{ text: greeting, isBot: true, timestamp: new Date() }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const findResponse = (userInput: string): string => {
    const lowercaseInput = userInput.toLowerCase();
    
    for (const response of chatbotData.responses) {
      if (response.keywords.some(keyword => lowercaseInput.includes(keyword.toLowerCase()))) {
        return response.answer;
      }
    }
    
    return chatbotData.fallback[Math.floor(Math.random() * chatbotData.fallback.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse: Message = {
        text: findResponse(input),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button - adjusted for mobile bottom nav */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 md:bottom-6 bottom-24 right-6 z-50 h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg glow"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Window - adjusted for mobile */}
      {isOpen && (
        <Card className="fixed bottom-24 md:bottom-24 bottom-44 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] glass animate-fade-in">
          {/* Header */}
          <div className="bg-primary/10 p-4 border-b border-primary/20">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <MessageCircle className="text-primary" size={20} />
              Construction Assistant
            </h3>
            <p className="text-xs text-muted-foreground">Ask me anything about our services</p>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.isBot
                      ? "bg-muted text-foreground"
                      : "bg-primary text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-primary/20">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="glass border-primary/30"
              />
              <Button
                onClick={handleSend}
                className="bg-primary hover:bg-primary/90"
                size="icon"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
