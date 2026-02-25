// "use client";

// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// interface Props {
//   data: {
//     courseName: string;
//     students: number;
//   }[];
// }

// const COLORS = ["#F43F5E", "#6366F1", "#22C55E", "#F59E0B", "#0EA5E9"];

// export default function CourseWiseEnrollmentChart({ data }: Props) {
//   const chartData = data.map((item) => ({
//     name: item.courseName,
//     value: item.students,
//   }));

//   if (chartData.every((d) => d.value === 0)) {
//     return (
//       <div className="h-64 flex items-center justify-center text-gray-500">
//         No enrollment data
//       </div>
//     );
//   }

//   return (
//     <ResponsiveContainer width="100%" height={260}>
//       <PieChart>
//         <Pie
//           data={chartData}
//           dataKey="value"
//           nameKey="name"
//           cx="50%"
//           cy="50%"
//           innerRadius={60}
//           outerRadius={90}
//           paddingAngle={4}
//         >
//           {chartData.map((_, index) => (
//             <Cell key={index} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// }

"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: {
    courseName: string;
    students: number;
  }[];
}

const COLORS = ["#F43F5E", "#6366F1", "#22C55E", "#F59E0B", "#0EA5E9"];

export default function CourseWiseEnrollmentChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: item.courseName,
    value: item.students,
  }));

  if (chartData.every((d) => d.value === 0)) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No enrollment data
      </div>
    );
  }

  return (
    <div className="relative flex h-65 w-full">
      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Right Top Legend */}
      <div className="absolute top-2 right-2 space-y-2 text-sm">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 bg-white/80 backdrop-blur px-2 py-1 rounded-md shadow-sm"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium text-gray-700">{item.name}</span>
            <span className="text-gray-500">({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
