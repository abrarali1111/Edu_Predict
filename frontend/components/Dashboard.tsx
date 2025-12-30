'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    GraduationCap,
    AlertTriangle,
    TrendingUp,
    Activity,
    RefreshCw
} from 'lucide-react';
import GaugeChart from './GaugeChart';
import RadarComparison from './RadarComparison';
import PredictForm from './PredictForm';
import { PredictionResult, ClassAverage, predictionsApi } from '@/lib/api';

interface DashboardStats {
    totalStudents: number;
    highRiskCount: number;
    averageDropoutRisk: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        highRiskCount: 0,
        averageDropoutRisk: 0,
    });
    const [classAverage, setClassAverage] = useState<ClassAverage | null>(null);
    const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const { logout, user } = useAuth(); // Moved to Navbar

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        setIsLoading(true);
        try {
            const health = await predictionsApi.healthCheck();
            setIsConnected(true);
            if (health.ml_models_loaded) {
                loadClassAverage();
            }
        } catch {
            setIsConnected(false);
        } finally {
            setIsLoading(false);
        }
    };

    const loadClassAverage = async () => {
        try {
            const avg = await predictionsApi.getClassAverage();
            setClassAverage(avg);
        } catch (err) {
            console.error('Failed to load class average:', err);
        }
    };

    const handlePrediction = (result: PredictionResult) => {
        setLatestPrediction(result);
        // Update stats
        setStats(prev => ({
            ...prev,
            totalStudents: prev.totalStudents + 1,
            highRiskCount: result.high_risk ? prev.highRiskCount + 1 : prev.highRiskCount,
            averageDropoutRisk: (prev.averageDropoutRisk * prev.totalStudents + result.dropout_probability * 100) / (prev.totalStudents + 1),
        }));
    };

    const radarData = latestPrediction && classAverage ? [
        { label: '1st Sem Grade', value: latestPrediction.grade_trend + 12, classAverage: classAverage['1st_sem_grade'] },
        { label: '2nd Sem Grade', value: latestPrediction.grade_trend + 13, classAverage: classAverage['2nd_sem_grade'] },
        { label: 'Admission', value: 130 / 10, classAverage: classAverage.admission_grade / 10 },
        { label: '1st Approved', value: 5, classAverage: classAverage['1st_sem_approved'] },
        { label: '2nd Approved', value: 5, classAverage: classAverage['2nd_sem_approved'] },
    ] : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Predictions</p>
                                <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">High Risk Alerts</p>
                                <p className="text-2xl font-bold text-white">{stats.highRiskCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/20 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Avg Dropout Risk</p>
                                <p className="text-2xl font-bold text-white">
                                    {stats.averageDropoutRisk.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Prediction Form */}
                    <div className="lg:col-span-2">
                        <PredictForm onPrediction={handlePrediction} />
                    </div>

                    {/* Visualization Panel */}
                    <div className="space-y-6">
                        {/* Gauge Chart */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white mb-4">Dropout Risk</h3>
                            <GaugeChart
                                value={latestPrediction ? latestPrediction.dropout_probability * 100 : 0}
                                label="Current Risk Level"
                            />
                        </div>

                        {/* Radar Chart */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white mb-4">Grade Comparison</h3>
                            {radarData.length > 0 ? (
                                <RadarComparison studentData={radarData} />
                            ) : (
                                <div className="h-60 flex items-center justify-center text-slate-500">
                                    <p>Make a prediction to see comparison</p>
                                </div>
                            )}
                        </div>

                        {/* High Risk Alert Panel */}
                        {latestPrediction?.high_risk && (
                            <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl p-6 border border-red-500/30 animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                    <h3 className="text-lg font-semibold text-red-400">Intervention Required</h3>
                                </div>
                                <p className="text-red-300 text-sm">
                                    This student has a {(latestPrediction.dropout_probability * 100).toFixed(1)}% probability of dropout.
                                    Academic intervention is strongly recommended.
                                </p>
                                <div className="mt-4 space-y-2">
                                    <p className="text-red-200 text-sm font-medium">Recommended Actions:</p>
                                    <ul className="text-red-300 text-sm space-y-1 list-disc list-inside">
                                        <li>Schedule counseling session</li>
                                        <li>Review academic support options</li>
                                        <li>Connect with mentorship program</li>
                                        <li>Assess financial aid eligibility</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
