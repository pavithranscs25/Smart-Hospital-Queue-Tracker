import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { queueApi } from '../../services/api.js';
import { QueueCard } from '../../components/QueueCard.jsx';
import { StatisticsCard } from '../../components/StatisticsCard.jsx';
import {
  Users,
  Clock,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  FastForward,
  PauseCircle,
  Play
} from 'lucide-react';

export const DoctorDashboardPage = () => {
  const { user, doctorDetails } = useAuth();
  const doctorId = user?.doctorId || 'doc-1';

  const [queueData, setQueueData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchDoctorQueue = async () => {
    setIsLoading(true);
    try {
      const data = await queueApi.getDoctorQueue(doctorId);
      setQueueData(data);
    } catch (err) {
      console.error('Failed to fetch doctor queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorQueue();
    const interval = setInterval(fetchDoctorQueue, 3000); // Polling every 3s
    return () => clearInterval(interval);
  }, [doctorId]);

  const showFeedback = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3000);
  };

  const handleCallNext = async (token) => {
    try {
      const res = await queueApi.callNextPatient(doctorId, token);
      showFeedback(res.message || 'Called patient');
      fetchDoctorQueue();
    } catch (err) {
      alert(err.message || 'Failed to call patient');
    }
  };

  const handleComplete = async (token) => {
    try {
      await queueApi.completePatient(token);
      showFeedback(`Token ${token} consultation marked complete.`);
      fetchDoctorQueue();
    } catch (err) {
      alert(err.message || 'Failed to complete consultation');
    }
  };

  const handleSkip = async (token) => {
    try {
      await queueApi.skipPatient(token, 'Patient skipped by doctor');
      showFeedback(`Token ${token} skipped.`);
      fetchDoctorQueue();
    } catch (err) {
      alert(err.message || 'Failed to skip patient');
    }
  };

  const handleHold = async (token) => {
    try {
      await queueApi.holdPatient(token, 'Consultation put on hold');
      showFeedback(`Token ${token} put on hold.`);
      fetchDoctorQueue();
    } catch (err) {
      alert(err.message || 'Failed to put patient on hold');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={doctorDetails?.avatar || queueData?.doctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
            alt="Doctor Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-300 shadow-md shrink-0"
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Doctor OPD Consultation Console
            </span>
            <h1 className="text-2xl font-extrabold text-white">
              {doctorDetails?.name || queueData?.doctor?.name || 'Dr. Rajesh Kumar'}
            </h1>
            <p className="text-xs text-teal-100 flex items-center gap-2 mt-0.5">
              <span>{doctorDetails?.departmentName || queueData?.doctor?.departmentName || 'General Medicine'}</span>
              <span>•</span>
              <span className="font-bold text-emerald-400">{doctorDetails?.roomNo || queueData?.doctor?.roomNo || 'Room 102'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDoctorQueue}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-300 ${isLoading ? 'animate-spin' : ''}`} /> Sync Queue
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {actionMsg}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Total Waiting"
          value={queueData?.totalWaiting ?? 0}
          subtitle="Patients in queue line"
          icon={Users}
          color="amber"
        />
        <StatisticsCard
          title="Currently Serving"
          value={queueData?.currentPatient ? 1 : 0}
          subtitle={queueData?.currentPatient ? queueData.currentPatient.token : 'Room Available'}
          icon={UserCheck}
          color="emerald"
        />
        <StatisticsCard
          title="Completed Today"
          value={queueData?.totalCompleted ?? 0}
          subtitle="Consultations finished"
          icon={CheckCircle2}
          color="teal"
        />
        <StatisticsCard
          title="Avg Consultation Time"
          value={`${queueData?.avgConsultationTime ?? 8} mins`}
          subtitle="Per patient average"
          icon={Clock}
          color="cyan"
        />
      </div>

      {/* Main Console Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Patient & Next Up */}
        <div className="lg:col-span-7 space-y-6">
          {/* Currently In Room */}
          <div className="bg-white p-6 rounded-2xl border border-teal-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Now In Room / Active Consultation
              </h3>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                Room 102
              </span>
            </div>

            {queueData?.currentPatient ? (
              <div className="space-y-4">
                <QueueCard
                  item={queueData.currentPatient}
                  isCurrent
                  onComplete={handleComplete}
                  onHold={handleHold}
                  onSkip={handleSkip}
                  showActions
                />

                {/* Primary Call Controls */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleComplete(queueData.currentPatient.token)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Complete Consultation
                  </button>

                  <button
                    onClick={() => handleHold(queueData.currentPatient.token)}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <PauseCircle className="w-4 h-4" /> Put on Hold
                  </button>

                  <button
                    onClick={() => handleSkip(queueData.currentPatient.token)}
                    className="col-span-2 sm:col-span-1 px-4 py-2.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <FastForward className="w-4 h-4" /> Skip Patient
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
                <UserCheck className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Patient Currently In Consultation</p>
                <button
                  onClick={() => handleCallNext()}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Call Next Patient Now
                </button>
              </div>
            )}
          </div>

          {/* Next Patient Up */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Next Patient Up In Queue
              </h3>
              <button
                onClick={() => handleCallNext()}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" /> Call Next
              </button>
            </div>

            {queueData?.nextPatient ? (
              <QueueCard
                item={queueData.nextPatient}
                onCall={(token) => handleCallNext(token)}
                showActions
              />
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No waiting patients remaining in line.</p>
            )}
          </div>
        </div>

        {/* Right Column: Full Waiting Queue List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Waiting Patients Queue ({queueData?.waitingPatients?.length ?? 0})
              </h3>
            </div>

            {queueData?.waitingPatients && queueData.waitingPatients.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {queueData.waitingPatients.map((patient) => (
                  <QueueCard
                    key={patient.token}
                    item={patient}
                    onCall={(token) => handleCallNext(token)}
                    onHold={handleHold}
                    onSkip={handleSkip}
                    showActions
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                Queue is clear! All patients have been served.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
