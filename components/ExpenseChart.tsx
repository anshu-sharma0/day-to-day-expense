import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LabelList,
} from "recharts";

interface ExpenseChartProps {
  data: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
}

export const ExpenseChart = ({ data }: ExpenseChartProps) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="border border-border bg-card rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl font-semibold text-card-foreground text-center sm:text-left">
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 text-sm sm:text-base">
            No data to display. Add some expenses to see the chart!
          </p>
        ) : (
          <div className="w-full h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  dataKey="amount"
                  animationDuration={800}
                  isAnimationActive={true}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={1.5}
                    />
                  ))}
                  <LabelList
                    dataKey="category"
                    position="inside"
                    style={{
                      fill: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  />
                </Pie>

                <Tooltip
                  formatter={(value: number, name: string) => [
                    `₹${value.toFixed(2)}`,
                    `${name}`,
                  ]}
                  labelFormatter={(label: string) => `Category: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    padding: "8px 12px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />

                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: 12,
                    fontSize: 13,
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

          </div>
        )}
      </CardContent>
    </Card>
  );
};
