import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { queueApi } from '../../services/api.js';
import { QueueCard } from '../../components/QueueCard.jsx';
import { RefreshCw, Play, Search } from 'lucide-react';

export const DoctorQueuePage = () => {
  const { user } = useAuth();
  const doctorId = user?.doctorId || 'doc-1';

  const [queueData, setQueueData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const data = await queueApi.getDoctorQueue(doctorId);
      setQueueData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3500);
    return () => clearInterval(interval);
  }, [doctorId]);

  const handleCallNext = async (token) => {
    try {
      await queueApi.callNextPatient(doctorId, token);
      fetchQueue();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleComplete = async (token) => {
    try {
      await queueApi.completePatient(token);
      fetchQueue();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSkip = async (token) => {
    try {
      await queueApi.skipPatient(token);
      fetchQueue();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleHold = async (token) => {
    try {
      await queueApi.holdPatient(token);
      fetchQueue();
    } catch (err) {
      alert(err.message);
    }
  };

  const getFilteredItems = () => {
    if (!queueData) return [];
    let items = queueData.fullQueue || [];

    if (activeTab === 'waiting') items = queueData.waitingPatients || [];
    if (activeTab === 'serving') items = queueData.currentPatient ? [queueData.currentPatient] : [];
    if (activeTab === 'on_hold') items = queueData.onHoldPatients || [];
    if (activeTab === 'skipped') items = queueData.skippedPatients || [];
    if (activeTab === 'completed') items = queueData.completedPatients || [];

    if (searchFilter.trim()) {
      items = items.filter(
        i =>
          i.token.toLowerCase().includes(searchFilter.toLowerCase()) ||
          i.patientName.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    return items;
  };

  const filtered = getFilteredItems();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Doctor Queue Roster
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Complete Department Queue</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCallNext()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" /> Call Next Patient
          </button>
          <button
            onClick={fetchQueue}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'waiting', 'serving', 'on_hold', 'skipped', 'completed'].map((tab) => {
            const count =
              tab === 'all'
                ? queueData?.fullQueue?.length ?? 0
                : tab === 'waiting'
                ? queueData?.waitingPatients?.length ?? 0
                : tab === 'serving'
                ? queueData?.currentPatient ? 1 : 0
                : tab === 'on_hold'
                ? queueData?.onHoldPatients?.length ?? 0
                : tab === 'skipped'
                ? queueData?.skippedPatients?.length ?? 0
                : queueData?.completedPatients?.length ?? 0;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 capitalize ${
                  activeTab === tab
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.replace('_', ' ')}
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === tab ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search patient name, token..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Queue List Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <QueueCard
              key={item.token}
              item={item}
              isCurrent={item.status === 'serving'}
              onCall={(token) => handleCallNext(token)}
              onComplete={handleComplete}
              onSkip={handleSkip}
              onHold={handleHold}
              showActions
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
          No patients found in this queue category.
        </div>
      )}
    </div>
  );
};
