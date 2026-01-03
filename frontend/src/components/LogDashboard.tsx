import React, { useEffect, useState } from 'react';
import type { LogEntry } from '../types';
import { API_URL } from '../config';

const LogDashboard: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        try {
            // Using configured API URL
            const res = await fetch(`${API_URL}/logs`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
                setError(null);
            } else {
                setError(`Server returned ${res.status}`);
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
            setError("Failed to connect to backend");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 2000); // Poll every 2s
        return () => clearInterval(interval);
    }, []);

    const getLevelStyle = (level: string) => {
        switch (level.toUpperCase()) {
            case 'ERROR': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'WARN': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'INFO': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.level === filter);

    return (
        <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden animate-fade-in ring-1 ring-white/10">
            <div className="glass-header px-6 py-4 flex justify-between items-center z-10">
                <div>
                    <h2 className="text-white font-semibold text-lg tracking-tight flex items-center gap-3">
                        <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </span>
                        System Activity
                    </h2>
                    <p className="text-slate-400 text-xs mt-1 ml-11">Real-time log ingestion stream</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-white/5">
                        {['ALL', 'INFO', 'WARN', 'ERROR'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === f
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    {error ? (
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-full border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20 animate-pulse-slow">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Connected
                        </span>
                    )}
                </div>
            </div>

            <div className="overflow-auto flex-1 p-0 custom-scrollbar">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                            <th className="px-6 py-3 font-semibold w-32">Timestamp</th>
                            <th className="px-6 py-3 font-semibold w-24">Level</th>
                            <th className="px-6 py-3 font-semibold w-32">Service</th>
                            <th className="px-6 py-3 font-semibold">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors font-mono group">
                                <td className="px-6 py-3 text-slate-500 text-xs whitespace-nowrap group-hover:text-slate-300 transition-colors">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wide rounded border ${getLevelStyle(log.level)}`}>
                                        {log.level}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-slate-300 whitespace-nowrap">
                                    <span className="opacity-75">{log.service}</span>
                                </td>
                                <td className="px-6 py-3 text-slate-300 group-hover:text-white transition-colors">{log.message}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-50">
                                        <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p className="text-slate-400">Waiting for logs...</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogDashboard;
