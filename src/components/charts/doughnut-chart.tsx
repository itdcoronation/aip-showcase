import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
];
const COLORS = ["#EDEAFF", "#FFEDD5", "#ECFCCB"];
const BORDER_COLORS = ["#C4ADFB", "#FED9A7", "#D9F5AE"];

const DoughnutChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius={36}
          outerRadius={49}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
              stroke={BORDER_COLORS[index % BORDER_COLORS.length]}
              // @ts-expect-error cornerRadius type issue
              cornerRadius={12}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export { DoughnutChart };
