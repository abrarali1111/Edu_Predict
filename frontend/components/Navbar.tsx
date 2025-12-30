'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LayoutDashboard, Upload, LogOut, FileText, Bell, MessageSquare } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">EduPredict</h1>
                                <p className="text-xs text-slate-400">Student Retention System</p>
                            </div>
                        </Link>
                    </div>

                    {user && (
                        <nav className="flex items-center gap-1">
                            <Link
                                href="/"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                    ${isActive('/')
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/upload"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                    ${isActive('/upload')
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                            >
                                <Upload className="w-4 h-4" />
                                Batch Upload
                            </Link>
                            <Link
                                href="/notifications"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                    ${isActive('/notifications')
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                            >
                                <Bell className="w-4 h-4" />
                                Alerts
                            </Link>
                            <Link
                                href="/support"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                    ${isActive('/support')
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Support
                            </Link>

                            <div className="w-px h-6 bg-slate-700 mx-2" />

                            <button
                                onClick={logout}
                                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}
