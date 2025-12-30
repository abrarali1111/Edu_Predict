'use client';

import React, { useState } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    User,
    GraduationCap,
    Wallet,
    AlertTriangle,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { PredictionInput, PredictionResult, predictionsApi } from '@/lib/api';

interface FormStep {
    title: string;
    icon: React.ReactNode;
    fields: Array<{
        name: keyof PredictionInput;
        label: string;
        type: 'number' | 'select';
        options?: { value: number; label: string }[];
        min?: number;
        max?: number;
        step?: number;
    }>;
}

const FORM_STEPS: FormStep[] = [
    {
        title: 'Demographics',
        icon: <User className="w-5 h-5" />,
        fields: [
            {
                name: 'marital_status',
                label: 'Marital Status',
                type: 'select',
                options: [
                    { value: 1, label: 'Single' },
                    { value: 2, label: 'Married' },
                    { value: 3, label: 'Widower' },
                    { value: 4, label: 'Divorced' },
                    { value: 5, label: 'Facto union' },
                    { value: 6, label: 'Legally separated' },
                ]
            },
            { name: 'application_mode', label: 'Application Mode', type: 'number', min: 1, max: 57 },
            { name: 'application_order', label: 'Application Order', type: 'number', min: 0, max: 9 },
            { name: 'course', label: 'Course Code', type: 'number', min: 1, max: 9999 },
            {
                name: 'daytime_evening_attendance',
                label: 'Attendance',
                type: 'select',
                options: [
                    { value: 1, label: 'Daytime' },
                    { value: 0, label: 'Evening' },
                ]
            },
            { name: 'previous_qualification', label: 'Previous Qualification', type: 'number', min: 1, max: 43 },
            { name: 'nationality', label: 'Nationality Code', type: 'number', min: 1, max: 109 },
            {
                name: 'gender',
                label: 'Gender',
                type: 'select',
                options: [
                    { value: 1, label: 'Male' },
                    { value: 0, label: 'Female' },
                ]
            },
            { name: 'age_at_enrollment', label: 'Age at Enrollment', type: 'number', min: 17, max: 70 },
            {
                name: 'international',
                label: 'International',
                type: 'select',
                options: [
                    { value: 1, label: 'Yes' },
                    { value: 0, label: 'No' },
                ]
            },
            {
                name: 'displaced',
                label: 'Displaced',
                type: 'select',
                options: [
                    { value: 1, label: 'Yes' },
                    { value: 0, label: 'No' },
                ]
            },
            {
                name: 'educational_special_needs',
                label: 'Special Educational Needs',
                type: 'select',
                options: [
                    { value: 1, label: 'Yes' },
                    { value: 0, label: 'No' },
                ]
            },
        ],
    },
    {
        title: 'Academic',
        icon: <GraduationCap className="w-5 h-5" />,
        fields: [
            { name: 'admission_grade', label: 'Admission Grade', type: 'number', min: 0, max: 200, step: 0.1 },
            { name: 'curricular_units_1st_sem_credited', label: '1st Sem Credits', type: 'number', min: 0, max: 30 },
            { name: 'curricular_units_1st_sem_enrolled', label: '1st Sem Enrolled', type: 'number', min: 0, max: 30 },
            { name: 'curricular_units_1st_sem_evaluations', label: '1st Sem Evaluations', type: 'number', min: 0, max: 50 },
            { name: 'curricular_units_1st_sem_approved', label: '1st Sem Approved', type: 'number', min: 0, max: 30 },
            { name: 'curricular_units_1st_sem_grade', label: '1st Sem Grade', type: 'number', min: 0, max: 20, step: 0.01 },
            { name: 'curricular_units_1st_sem_without_evaluations', label: '1st Sem Without Eval', type: 'number', min: 0, max: 20 },
            { name: 'curricular_units_2nd_sem_credited', label: '2nd Sem Credits', type: 'number', min: 0, max: 30 },
            { name: 'curricular_units_2nd_sem_enrolled', label: '2nd Sem Enrolled', type: 'number', min: 0, max: 30 },
            { name: 'curricular_units_2nd_sem_evaluations', label: '2nd Sem Evaluations', type: 'number', min: 0, max: 50 },
            { name: 'curricular_units_2nd_sem_approved', label: '2nd Sem Approved', type: 'number', min: 0, max: 30 },
            { name: 'curricular_units_2nd_sem_grade', label: '2nd Sem Grade', type: 'number', min: 0, max: 20, step: 0.01 },
            { name: 'curricular_units_2nd_sem_without_evaluations', label: '2nd Sem Without Eval', type: 'number', min: 0, max: 20 },
        ],
    },
    {
        title: 'Socio-economic',
        icon: <Wallet className="w-5 h-5" />,
        fields: [
            { name: 'mothers_qualification', label: "Mother's Qualification", type: 'number', min: 1, max: 44 },
            { name: 'fathers_qualification', label: "Father's Qualification", type: 'number', min: 1, max: 44 },
            { name: 'mothers_occupation', label: "Mother's Occupation", type: 'number', min: 0, max: 200 },
            { name: 'fathers_occupation', label: "Father's Occupation", type: 'number', min: 0, max: 200 },
            {
                name: 'scholarship_holder',
                label: 'Scholarship Holder',
                type: 'select',
                options: [
                    { value: 1, label: 'Yes' },
                    { value: 0, label: 'No' },
                ]
            },
            {
                name: 'debtor',
                label: 'Debtor',
                type: 'select',
                options: [
                    { value: 1, label: 'Yes' },
                    { value: 0, label: 'No' },
                ]
            },
            {
                name: 'tuition_fees_up_to_date',
                label: 'Tuition Fees Up to Date',
                type: 'select',
                options: [
                    { value: 1, label: 'Yes' },
                    { value: 0, label: 'No' },
                ]
            },
            { name: 'unemployment_rate', label: 'Unemployment Rate (%)', type: 'number', min: 0, max: 50, step: 0.1 },
            { name: 'inflation_rate', label: 'Inflation Rate (%)', type: 'number', min: -10, max: 20, step: 0.1 },
            { name: 'gdp', label: 'GDP', type: 'number', min: -10, max: 10, step: 0.01 },
        ],
    },
];

const DEFAULT_VALUES: PredictionInput = {
    marital_status: 1,
    application_mode: 1,
    application_order: 1,
    course: 9500,
    daytime_evening_attendance: 1,
    previous_qualification: 1,
    nationality: 1,
    gender: 1,
    age_at_enrollment: 20,
    international: 0,
    displaced: 0,
    educational_special_needs: 0,
    mothers_qualification: 1,
    fathers_qualification: 1,
    mothers_occupation: 0,
    fathers_occupation: 0,
    scholarship_holder: 0,
    debtor: 0,
    tuition_fees_up_to_date: 1,
    admission_grade: 130,
    curricular_units_1st_sem_credited: 0,
    curricular_units_1st_sem_enrolled: 6,
    curricular_units_1st_sem_evaluations: 6,
    curricular_units_1st_sem_approved: 5,
    curricular_units_1st_sem_grade: 12.5,
    curricular_units_1st_sem_without_evaluations: 0,
    curricular_units_2nd_sem_credited: 0,
    curricular_units_2nd_sem_enrolled: 6,
    curricular_units_2nd_sem_evaluations: 6,
    curricular_units_2nd_sem_approved: 5,
    curricular_units_2nd_sem_grade: 13.0,
    curricular_units_2nd_sem_without_evaluations: 0,
    unemployment_rate: 10.8,
    inflation_rate: 1.4,
    gdp: 1.74,
};

interface PredictFormProps {
    onPrediction?: (result: PredictionResult) => void;
}

export default function PredictForm({ onPrediction }: PredictFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<PredictionInput>(DEFAULT_VALUES);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (name: keyof PredictionInput, value: number) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (currentStep < FORM_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const prediction = await predictionsApi.predict({ ...formData, save_record: true });
            setResult(prediction);
            onPrediction?.(prediction);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get prediction. Please check your connection.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData(DEFAULT_VALUES);
        setResult(null);
        setError(null);
        setCurrentStep(0);
    };

    const currentStepData = FORM_STEPS[currentStep];

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            {/* Progress Header */}
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Student Prediction Form</h2>
                    <span className="text-sm text-slate-400">
                        Step {currentStep + 1} of {FORM_STEPS.length}
                    </span>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center gap-2">
                    {FORM_STEPS.map((step, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${index === currentStep
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                : index < currentStep
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-slate-700/50 text-slate-400'
                                }`}
                        >
                            {step.icon}
                            <span className="hidden sm:inline">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            {!result ? (
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentStepData.fields.map((field) => (
                            <div key={field.name} className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-300">
                                    {field.label}
                                </label>
                                {field.type === 'select' ? (
                                    <select
                                        value={formData[field.name] as number}
                                        onChange={(e) => handleChange(field.name, Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    >
                                        {field.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        value={formData[field.name] as number}
                                        onChange={(e) => handleChange(field.name, Number(e.target.value))}
                                        min={field.min}
                                        max={field.max}
                                        step={field.step || 1}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        {currentStep < FORM_STEPS.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Predicting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Get Prediction
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* Result Display */
                <div className="p-6">
                    <div className={`p-6 rounded-xl border-2 ${result.high_risk
                        ? 'bg-red-500/10 border-red-500/50'
                        : result.predicted_class === 'Graduate'
                            ? 'bg-green-500/10 border-green-500/50'
                            : 'bg-yellow-500/10 border-yellow-500/50'
                        }`}>
                        {result.high_risk && (
                            <div className="flex items-center gap-3 mb-4 p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                                <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                                <div>
                                    <p className="text-red-400 font-bold text-lg">HIGH RISK ALERT</p>
                                    <p className="text-red-300 text-sm">Academic Intervention Recommended</p>
                                </div>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <p className="text-slate-400 text-sm uppercase tracking-wider">Predicted Status</p>
                            <p className={`text-4xl font-bold mt-1 ${result.predicted_class === 'Dropout' ? 'text-red-400' :
                                result.predicted_class === 'Graduate' ? 'text-green-400' :
                                    'text-yellow-400'
                                }`}>
                                {result.predicted_class}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-slate-400 text-sm">Dropout Risk</p>
                                <p className="text-2xl font-bold text-white">
                                    {(result.dropout_probability * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-slate-400 text-sm">Grade Trend</p>
                                <p className={`text-2xl font-bold ${result.grade_trend >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {result.grade_trend >= 0 ? '+' : ''}{result.grade_trend.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                            <p className="text-slate-400 text-sm mb-2">Class Probabilities</p>
                            <div className="space-y-2">
                                {Object.entries(result.all_probabilities).map(([cls, prob]) => (
                                    <div key={cls} className="flex items-center gap-3">
                                        <span className="text-white w-20">{cls}</span>
                                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${cls === 'Dropout' ? 'bg-red-500' :
                                                    cls === 'Graduate' ? 'bg-green-500' :
                                                        'bg-yellow-500'
                                                    }`}
                                                style={{ width: `${prob * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-slate-400 w-16 text-right">
                                            {(prob * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleReset}
                        className="w-full mt-6 px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all"
                    >
                        Make Another Prediction
                    </button>
                </div>
            )}
        </div>
    );
}
