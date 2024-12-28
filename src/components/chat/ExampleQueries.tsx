interface ExampleQueriesProps {
  queries: string[];
  onSelect: (query: string) => void;
}

export function ExampleQueries({ queries, onSelect }: ExampleQueriesProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {queries.map((query, index) => (
        <button
          key={index}
          onClick={() => onSelect(query)}
          className="flex items-center gap-2 text-gray-400 bg-domoblock-panel rounded-full px-4 py-2 hover:bg-opacity-80 transition-colors"
        >
          <span className="text-domoblock-accent">?</span>
          {query}
        </button>
      ))}
    </div>
  );
}