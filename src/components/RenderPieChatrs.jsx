import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function RenderPieChatrs({ data, dataKey, title = "" }) {

    const COLORS = ["#FF7262", "#69a3d0", "#a4d256", "#ba71b6", "#ffae52","#ffeb5c","#b4aed4","#fec6e3","#72cec1"];
    const COLORS_INV = ["#FE7600", "#C40025", "#286CFF", "#42C1FF", "#D4D884", "#00FEFE", "#8B0875", "#8B0875", "#8884D8", "#808080", "#A9DFBA", "#415E08", "#0D315E"];
    // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#fe0000", "#8b0857", "#088b1e", "#D4D884", "#000000", "#dfa9ce", "#25085e", "#5e3a0d"];
    // const COLORS_INV = ["#FE7600", "#C40025", "#286CFF", "#42C1FF", "#D4D884", "#00FEFE", "#8B0875", "#8B0875", "#8884D8", "#808080", "#A9DFBA", "#415E08", "#0D315E"];


    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const renderLabel = ({ percent, index }) => {
        return data[index].name + "[" + String((percent * 100).toFixed(0)) + "%]";
    }

    return (
        <div className="pie-chart-div-content">
            {/* <ResponsiveContainer width="100%" height="100%"> */}
            <div className="chart-title" >{title}</div>
            <PieChart width={400} height={400} style={{ height: "100%", width: "100%" }}>
                <Pie
                    data={data}
                    // cx="50%"
                    cy="55%"
                    labelLine={false}
                    // label={renderCustomizedLabel}
                    // label={renderLabel}
                    // label
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey={dataKey}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
                {/* <Legend width={300} align='center' style={{ }} /> */}
            </PieChart>
            {/* </ResponsiveContainer> */}
        </div>
    );
}
