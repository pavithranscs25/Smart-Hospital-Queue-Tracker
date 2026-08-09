import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api.js';
import { StatisticsCard } from '../../components/StatisticsCard.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import {
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  Building2,
  Activity,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdminStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    const interval = setInterval(fetchAdminStats, 4000);
    return () => clearInterval(interval);
  }, []);

  const overview = stats?.overview;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 md:p-8 rounded-2xl text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Hospital Administration</span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">Hospital OPD Queue Analytics</h1>
          <p className="text-xs text-purple-200 mt-1">
            Real-time queue load monitoring, department metrics, and doctor availability.
          </p>
        </div>

        <button
          onClick={fetchAdminStats}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-300 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Analytics
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatisticsCard
          title="Total Patients Today"
          value={overview?.totalPatientsToday ?? 42}
          subtitle="Registered tokens"
          icon={Users}
          color="teal"
        />

        <StatisticsCard
          title="Currently Waiting"
          value={overview?.currentlyWaiting ?? 5}
          subtitle="In line across OPD"
          icon={Clock}
          color="amber"
        />

        <StatisticsCard
          title="Doctors Active"
          value={`${overview?.activeDoctorsCount ?? 4} / ${overview?.totalDoctorsCount ?? 5}`}
          subtitle="In consultation rooms"
          icon={Stethoscope}
          color="emerald"
        />

        <StatisticsCard
          title="Completed Consultations"
          value={overview?.completedConsultations ?? 28}
          subtitle="Patients discharged"
          icon={CheckCircle2}
          color="cyan"
        />

        <StatisticsCard
          title="Avg Waiting Time"
          value={`${overview?.averageWaitTimeMinutes ?? 14} mins`}
          subtitle="System wide average"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Department Load Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" /> Department Queue Breakdown
              </h2>
              <p className="text-xs text-slate-500">Live patient load & estimated wait time by department</p>
            </div>
          </div>

          <div className="space-y-4">
            {stats?.departmentStats?.map((dept) => {
              const maxTokens = 20;
              const percentage = Math.min(100, Math.round((dept.totalTokens / maxTokens) * 100));

              return (
                <div key={dept.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-xs">
                        {dept.code}
                      </span>
                      {dept.name}
                    </span>
                    <span className="font-semibold text-slate-600">
                      {dept.waiting} waiting • {dept.serving} in room • {dept.completed} finished
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-teal-500 h-full transition-all duration-500"
                      style={{ width: `${Math.max(12, percentage)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Est. Department Wait Time: <strong>{dept.avgWaitTimeMinutes} mins</strong></span>
                    <span>Total Tokens: <strong>{dept.totalTokens}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor Status Roster */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" /> Doctor Roster Status
          </h2>

          <div className="space-y-3">
            {stats?.doctors?.map((doc) => (
              <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{doc.name}</h4>
                    <p className="text-[10px] text-slate-500">{doc.departmentName} • {doc.roomNo}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md capitalize ${
                    doc.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.status === 'busy'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Live Queue Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" /> Live Queue System Activity Log
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Token</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Department</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Room</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {stats?.recentQueue?.map((item) => (
                <tr key={item.token} className="hover:bg-slate-50/80">
                  <td className="p-3 font-mono font-bold text-teal-800">{item.token}</td>
                  <td className="p-3 font-semibold text-slate-900">{item.patientName}</td>
                  <td className="p-3">{item.departmentName}</td>
                  <td className="p-3">{item.doctorName}</td>
                  <td className="p-3">{item.roomNo}</td>
                  <td className="p-3"><StatusBadge status={item.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
