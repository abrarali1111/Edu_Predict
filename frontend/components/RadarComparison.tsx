'use client';

import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

interface RadarComparisonProps {
    studentData: {
        label: string;
        value: number;
        classAverage: number;
    }[];
}

export default function RadarComparison({ studentData }: RadarComparisonProps) {
    const data = studentData.map(item => ({
        subject: item.label,
        student: item.value,
        classAvg: item.classAverage,
    }));

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                    <PolarGrid
                        stroke="#475569"
                        strokeDasharray="3 3"
                    />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickLine={{ stroke: '#475569' }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 'auto']}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        tickLine={{ stroke: '#475569' }}
                        axisLine={{ stroke: '#475569' }}
                    />
                    <Radar
                        name="Student"
                        dataKey="student"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Radar
                        name="Class Average"
                        dataKey="classAvg"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#f1f5f9',
                        }}
                        formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
                    />
                    <Legend
                        wrapperStyle={{
                            paddingTop: '10px',
                        }}
                        formatter={(value) => (
                            <span className="text-slate-300">{value}</span>
                        )}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
