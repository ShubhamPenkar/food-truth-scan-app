import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface NutritionData {
  calories?: number;
  fat?: number;
  carbs?: number;
  protein?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface NutritionChartProps {
  nutrition: NutritionData;
}

export const NutritionChart = ({ nutrition }: NutritionChartProps) => {
  const chartData = [
    { name: 'Calories', value: nutrition.calories || 0, unit: 'kcal', color: '#8884d8' },
    { name: 'Fat', value: nutrition.fat || 0, unit: 'g', color: '#82ca9d' },
    { name: 'Carbs', value: nutrition.carbs || 0, unit: 'g', color: '#ffc658' },
    { name: 'Protein', value: nutrition.protein || 0, unit: 'g', color: '#ff7300' },
    { name: 'Fiber', value: nutrition.fiber || 0, unit: 'g', color: '#00ff00' },
    { name: 'Sugar', value: nutrition.sugar || 0, unit: 'g', color: '#ff0000' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-primary">
            {payload[0].value.toFixed(2)} {payload[0].payload.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Macronutrients Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item) => (
          <div key={item.name} className="text-center p-4 bg-secondary/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {item.value.toFixed(2)}
              <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
            </div>
            <div className="text-sm text-muted-foreground">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sodium Warning */}
      {nutrition.sodium && nutrition.sodium > 600 && (
        <div className="p-4 bg-health-danger/10 border border-health-danger/30 rounded-lg">
          <div className="flex items-center gap-2 text-health-danger">
            <span className="text-xl">⚠️</span>
            <span className="font-medium">High Sodium Content</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This food contains {nutrition.sodium}mg of sodium, which is above the recommended daily limit.
          </p>
        </div>
      )}

      {/* Sugar Warning */}
      {nutrition.sugar && nutrition.sugar > 15 && (
        <div className="p-4 bg-health-moderate/10 border border-health-moderate/30 rounded-lg">
          <div className="flex items-center gap-2 text-health-moderate">
            <span className="text-xl">🍯</span>
            <span className="font-medium">High Sugar Content</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Contains {nutrition.sugar.toFixed(2)}g of sugar. Consider moderation.
          </p>
        </div>
      )}
    </div>
  );
};
