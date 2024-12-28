import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface DataVisualizationProps {
  data: any[];
}

export function DataVisualization({ data }: DataVisualizationProps) {
  if (!data || data.length === 0) return null;

  // Determine if the data contains numeric values we can chart
  const numericColumns = Object.keys(data[0]).filter(key => 
    typeof data[0][key] === 'number' || !isNaN(Number(data[0][key]))
  );

  if (numericColumns.length === 0) return null;

  // Use the first numeric column as the value
  const valueKey = numericColumns[0];
  
  // Use a non-numeric column as the category if available
  const categoryKey = Object.keys(data[0]).find(key => 
    !numericColumns.includes(key)
  ) || numericColumns[0];

  // Prepare data for the chart
  const chartData = data.map(item => ({
    category: item[categoryKey]?.toString() || 'N/A',
    value: Number(item[valueKey]) || 0
  }));

  return (
    <div className="w-full h-[300px] mt-4">
      <ChartContainer
        config={{
          value: {
            theme: {
              light: "var(--theme-primary)",
              dark: "var(--theme-primary)",
            },
          },
        }}
      >
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
          />
          <YAxis />
          <ChartTooltip />
          <Bar dataKey="value" fill="var(--theme-primary)" />
        </BarChart>
      </ChartContainer>
    </div>
  );
}