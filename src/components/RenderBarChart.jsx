import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#fe0000"];
const COLORS_INV = ["#FE7600", "#C40025", "#286CFF", "#42C1FF", "#D4D884", "#00FEFE"];


export default function RenderBarChart({ data, colorIndx = 5, dataKey, stack = false, title="" }) {

    // bars.push(<Bar key={""} dataKey={arr[i]} fill={colors[i]} activeBar={<Rectangle fill={colorsInv[i]} stroke={colors[i]} />} />)

    function renderStackBar() {

        let keys = [];
        data?.forEach(obj => {
            let temp = Object.keys(obj);
            temp.forEach(t => {
                if (!keys.includes(t) && t != "_zone") {
                    keys.push(t)
                }
            })
        })
        keys.sort();
        let arr = []
        keys.forEach((obj, index) => {
            arr.push(<Bar key={obj} dataKey={obj} stackId="a" fill={COLORS[index]} />)
        })
        return arr;
    }

    return (
        <>
            {/* <div className='c1'> */}
            {/* <ResponsiveContainer width="100%" height="100%"> */}
            <div className="chart-title" >{title}</div>
            <BarChart
                width={500}
                height={500}
                style={{ height: "100%", width: "100%" }}
                data={data}
                margin={{
                    top: 30,
                    right: 10,
                    left: 10,
                    bottom: 50,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={dataKey.x}>
                    {/* <Label value="Zones" offset={0} position="insideBottom" /> */}
                </XAxis>
                <YAxis />
                {/* <YAxis label={{ value: ylabel, angle: -90, position: 'insideLeft' }} /> */}
                <Tooltip />
                <Legend />
                {stack ?
                    renderStackBar() :
                    <Bar dataKey={dataKey.y} fill={COLORS[colorIndx]} activeBar={<Rectangle fill={COLORS_INV[colorIndx]} stroke={COLORS[colorIndx]} />} />
                }
            </BarChart>
            {/* </ResponsiveContainer> */}
            {/* </div> */}
        </>

    )
}

// export { RenderBarChart }
