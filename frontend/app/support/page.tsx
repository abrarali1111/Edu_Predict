'use client';

import React, { useEffect, useState } from 'react';
import { supportApi, SupportTicket } from '@/lib/api';
import { MessageSquare, Plus, Loader2 } from 'lucide-react';

export default function SupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setIsLoading(true);
        try {
            const data = await supportApi.getTickets();
            setTickets(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const newTicket = await supportApi.createTicket(formData);
            setTickets([newTicket, ...tickets]);
            setIsCreating(false);
            setFormData({ subject: '', message: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-cyan-500/20 text-cyan-400';
            case 'In Progress': return 'bg-blue-500/20 text-blue-400';
            case 'Resolved': return 'bg-green-500/20 text-green-400';
            case 'Closed': return 'bg-slate-700 text-slate-400';
            default: return 'bg-slate-700 text-slate-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
                        <p className="text-slate-400">Track issues and request assistance</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2"
                    >
                        {isCreating ? 'Cancel' : (
                            <>
                                <Plus className="w-5 h-5" />
                                New Ticket
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Ticket Form */}
                    {isCreating && (
                        <div className="lg:col-span-1">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm sticky top-24">
                                <h3 className="text-lg font-semibold text-white mb-4">New Request</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                            className="w-full px-4 py-2 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                            className="w-full px-4 py-2 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 min-h-[150px]"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Ticket'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Ticket List */}
                    <div className={isCreating ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        {isLoading ? (
                            <div className="text-center py-12 text-slate-500">Loading tickets...</div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">No support tickets found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tickets.map(ticket => (
                                    <div key={ticket.id} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{ticket.subject}</h3>
                                        <p className="text-slate-400 text-sm">{ticket.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
