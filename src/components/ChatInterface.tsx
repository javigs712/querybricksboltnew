import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./chat/ChatHeader";
import { ExampleQueries } from "./chat/ExampleQueries";
import { QueryInput } from "./chat/QueryInput";
import { ResultsDisplay } from "./chat/ResultsDisplay";

interface Message {
  type: 'user' | 'ai';
  query?: string;
  results?: any[] | null;
  naturalResponse?: string | null;
  visualizationType?: 'table' | 'chart' | 'natural';
}

const exampleQueries = [
  "Muestra en una tabla los 10 inversores que más han invertido",
  "Visualiza en un gráfico los proyectos con más inversiones",
  "Gráfico de inversiones mayores a 10000",
  "Explícame quién es el inversor que más ha invertido",
];

export function ChatInterface() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectVisualizationType = (query: string): 'table' | 'chart' | 'natural' => {
    const lowercaseQuery = query.toLowerCase();
    if (lowercaseQuery.includes('explica') || 
        lowercaseQuery.includes('dime') || 
        lowercaseQuery.includes('cuéntame')) return 'natural';
    if (lowercaseQuery.includes('tabla')) return 'table';
    if (lowercaseQuery.includes('gráfico') || 
        lowercaseQuery.includes('grafico') || 
        lowercaseQuery.includes('visualiza')) return 'chart';
    return 'table';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    const userMessage: Message = {
      type: 'user',
      query: query.trim()
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const visualizationType = detectVisualizationType(query);
      
      const { data, error } = await supabase.functions.invoke('natural-to-sql', {
        body: { 
          query: query.trim(),
          generateNaturalResponse: visualizationType === 'natural'
        }
      });

      if (error) throw error;
      
      const aiMessage: Message = {
        type: 'ai',
        results: data.results,
        naturalResponse: data.naturalResponse,
        visualizationType
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error');
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const showInitialElements = messages.length === 0;

  return (
    <div className="flex flex-col h-screen w-full max-w-none">
      {showInitialElements && (
        <>
          <ChatHeader />
          <ExampleQueries 
            queries={exampleQueries} 
            onSelect={handleExampleClick} 
          />
        </>
      )}

      {error && (
        <div className="mx-auto max-w-2xl p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div 
        className={`
          flex-1 overflow-y-auto px-4 py-6 space-y-6 
          ${showInitialElements ? '' : 'h-full'}
          scrollbar-thin scrollbar-thumb-domoblock-accent scrollbar-track-domoblock-panel
          hover:scrollbar-thumb-domoblock-accent/80
        `}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-domoblock-accent text-white ml-auto'
                  : 'bg-domoblock-panel w-full'
              }`}
            >
              {message.type === 'user' ? (
                <p>{message.query}</p>
              ) : (
                <ResultsDisplay
                  results={message.results}
                  naturalResponse={message.naturalResponse}
                  visualizationType={message.visualizationType || 'table'}
                />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <QueryInput
        query={query}
        loading={loading}
        onChange={setQuery}
        onSubmit={handleSubmit}
      />
    </div>
  );
}