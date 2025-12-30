'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { predictionsApi } from '@/lib/api';

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            setFile(acceptedFiles[0]);
            setResult(null);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
    });

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        try {
            const data = await predictionsApi.uploadCSV(file);
            setResult(data);
            setFile(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Upload failed. Please check the file format.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!result && (
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-white">Batch Prediction</h2>
                        <p className="text-slate-400 text-sm mt-1">Upload a CSV file to process multiple student records at once.</p>
                    </div>

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                            ${isDragActive
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        {file ? (
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-cyan-500/20 rounded-full mb-4">
                                    <FileText className="w-8 h-8 text-cyan-400" />
                                </div>
                                <p className="text-white font-medium">{file.name}</p>
                                <p className="text-slate-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                    }}
                                    className="mt-4 text-xs text-red-400 hover:text-red-300"
                                >
                                    Remove File
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-slate-800 rounded-full mb-4">
                                    <Upload className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-300 font-medium">Click to upload or drag and drop</p>
                                <p className="text-slate-500 text-sm mt-1">CSV files only</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={`w-full mt-6 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2
                            ${!file || uploading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                            }`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Start Processing
                            </>
                        )}
                    </button>

                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500 text-center">
                            Expected CSV headers should match API fields (e.g., marital_status, course, etc.)
                        </p>
                    </div>
                </div>
            )}

            {result && (
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-green-500/20 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Processing Complete</h2>
                            <p className="text-slate-400 text-sm">Successfully analyzed batch data</p>
                        </div>
                        <button
                            onClick={() => setResult(null)}
                            className="ml-auto p-2 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm">Processed Records</p>
                            <p className="text-2xl font-bold text-white">{result.processed_count}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm">High Risk Detected</p>
                            <p className="text-2xl font-bold text-red-400">{result.high_risk_count}</p>
                        </div>
                    </div>

                    {result.errors && result.errors.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Errors ({result.errors.length})
                            </h4>
                            <ul className="text-xs text-red-300 space-y-1 max-h-40 overflow-y-auto">
                                {result.errors.map((err: string, i: number) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={() => setResult(null)}
                        className="w-full mt-6 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all"
                    >
                        Upload Another File
                    </button>
                </div>
            )}
        </div>
    );
}
