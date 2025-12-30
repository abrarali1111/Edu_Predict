'use client';

import FileUpload from '@/components/FileUpload';

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Data Ingestion</h1>
                    <p className="text-slate-400">Upload historical records for batch analysis</p>
                </div>

                <FileUpload />
            </div>
        </div>
    );
}
