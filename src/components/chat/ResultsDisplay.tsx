import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataVisualization } from "../DataVisualization";

interface ResultsDisplayProps {
  results: any[] | null;
  naturalResponse: string | null;
  visualizationType: 'table' | 'chart' | 'natural';
}

export function ResultsDisplay({ results, naturalResponse, visualizationType }: ResultsDisplayProps) {
  if (!results && !naturalResponse) return null;

  return (
    <div className="w-full">
      {visualizationType === 'natural' && naturalResponse && (
        <div className="prose dark:prose-invert max-w-none text-white">
          {naturalResponse}
        </div>
      )}
      
      {results && results.length > 0 && visualizationType === 'table' && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(results[0]).map((key) => (
                  <TableHead key={key} className="text-white">{key}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((row, i) => (
                <TableRow key={i}>
                  {Object.values(row).map((value: any, j) => (
                    <TableCell key={j} className="text-white">
                      {value?.toString() ?? 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {results && results.length > 0 && visualizationType === 'chart' && (
        <div className="w-full">
          <DataVisualization data={results} />
        </div>
      )}
      
      {results && results.length === 0 && (
        <p className="text-center text-gray-400">
          No se encontraron resultados
        </p>
      )}
    </div>
  );
}