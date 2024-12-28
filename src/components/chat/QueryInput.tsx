import { Send } from "lucide-react";

interface QueryInputProps {
  query: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function QueryInput({ query, loading, onChange, onSubmit }: QueryInputProps) {
  return (
    <div className="border-t border-domoblock-panel p-4">
      <form onSubmit={onSubmit} className="relative max-w-4xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu consulta aquí... (especifica 'tabla', 'gráfico' o usa 'explícame' para respuesta en texto)"
          className="w-full bg-domoblock-panel text-white rounded-full py-4 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-domoblock-accent"
          disabled={loading}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-domoblock-accent rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <Send className="h-5 w-5 text-white" />
        </button>
      </form>
    </div>
  );
}