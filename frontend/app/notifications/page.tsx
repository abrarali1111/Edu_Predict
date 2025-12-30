'use client';

import React, { useEffect, useState } from 'react';
import { notificationApi, Notification } from '@/lib/api';
import { Bell, CheckCircle, Info, AlertTriangle, AlertOctagon, Check } from 'lucide-react';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await notificationApi.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const markRead = async (id: number) => {
        try {
            await notificationApi.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationApi.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
            case 'error': return <AlertOctagon className="w-5 h-5 text-red-400" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                        <p className="text-slate-400">System alerts and updates</p>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Mark all read
                    </button>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-slate-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-xl border transition-all ${notification.is_read
                                        ? 'bg-slate-900/30 border-slate-800 opacity-70'
                                        : 'bg-slate-800/50 border-slate-700 shadow-lg'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-full h-fit ${notification.type === 'error' ? 'bg-red-500/10' :
                                            notification.type === 'warning' ? 'bg-amber-500/10' :
                                                'bg-blue-500/10'
                                        }`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <h3 className={`font-semibold ${notification.is_read ? 'text-slate-400' : 'text-white'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-slate-500">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{notification.message}</p>

                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markRead(notification.id)}
                                                className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
