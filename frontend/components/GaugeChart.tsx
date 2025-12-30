'use client';

import React from 'react';

interface GaugeChartProps {
    value: number; // 0-100
    label: string;
    size?: number;
}

export default function GaugeChart({ value, label, size = 200 }: GaugeChartProps) {
    const clampedValue = Math.max(0, Math.min(100, value));
    const rotation = (clampedValue / 100) * 180 - 90;

    // Color based on risk level
    const getColor = (val: number) => {
        if (val <= 30) return { main: '#22c55e', glow: '#22c55e40' }; // Green
        if (val <= 50) return { main: '#eab308', glow: '#eab30840' }; // Yellow
        if (val <= 70) return { main: '#f97316', glow: '#f9731640' }; // Orange
        return { main: '#ef4444', glow: '#ef444440' }; // Red
    };

    const colors = getColor(clampedValue);

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size / 2 + 40 }}>
                <svg
                    width={size}
                    height={size / 2 + 20}
                    viewBox={`0 0 ${size} ${size / 2 + 20}`}
                    className="overflow-visible"
                >
                    {/* Background arc */}
                    <path
                        d={`M ${size * 0.1} ${size / 2} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size / 2}`}
                        fill="none"
                        stroke="#334155"
                        strokeWidth={size * 0.08}
                        strokeLinecap="round"
                    />

                    {/* Colored progress arc */}
                    <path
                        d={`M ${size * 0.1} ${size / 2} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size / 2}`}
                        fill="none"
                        stroke={colors.main}
                        strokeWidth={size * 0.08}
                        strokeLinecap="round"
                        strokeDasharray={`${(clampedValue / 100) * size * 0.4 * Math.PI} ${size * 0.4 * Math.PI}`}
                        style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
                    />

                    {/* Needle */}
                    <g transform={`translate(${size / 2}, ${size / 2})`}>
                        <circle r={size * 0.06} fill="#1e293b" stroke="#475569" strokeWidth="2" />
                        <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2={-size * 0.32}
                            stroke={colors.main}
                            strokeWidth="4"
                            strokeLinecap="round"
                            transform={`rotate(${rotation})`}
                            style={{
                                transition: 'transform 0.5s ease-out',
                                filter: `drop-shadow(0 0 4px ${colors.glow})`
                            }}
                        />
                    </g>

                    {/* Min/Max labels */}
                    <text x={size * 0.08} y={size / 2 + 18} fill="#64748b" fontSize="12" textAnchor="middle">0%</text>
                    <text x={size * 0.92} y={size / 2 + 18} fill="#64748b" fontSize="12" textAnchor="middle">100%</text>
                </svg>

                {/* Value display */}
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 text-center"
                    style={{ bottom: 0 }}
                >
                    <span
                        className="text-3xl font-bold"
                        style={{ color: colors.main }}
                    >
                        {clampedValue.toFixed(1)}%
                    </span>
                </div>
            </div>
            <p className="text-slate-400 text-sm mt-2">{label}</p>
        </div>
    );
}
