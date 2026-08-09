import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { queueApi } from '../../services/api.js';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { Modal } from '../../components/Modal.jsx';
import { TokenCard } from '../../components/TokenCard.jsx';
import { History, Calendar, Stethoscope, Search, Eye, Ticket } from 'lucide-react';

export const PatientHistoryPage = ({ onNavigate }) => {
  const { user, setActiveToken } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTokenDetails, setSelectedTokenDetails] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const patientId = user?.id || 'pat-101';
        const data = await queueApi.getPatientHistory(patientId);
        setHistoryItems(data);
      } catch (err) {
        console.error('Failed to fetch patient queue history:', err);
      }
    };
    fetchHistory();
  }, [user]);

  const filteredHistory = historyItems.filter((i) =>
    i.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInspectToken = async (token) => {
    try {
      const details = await queueApi.getTokenDetails(token);
      setSelectedTokenDetails(details);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Consultation Log
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Patient Queue History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View your current and previous OPD token consultations.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search token, doctor..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* History List Table / Cards */}
      {filteredHistory.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredHistory.map((item) => (
              <div
                key={item.token}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-mono font-bold text-base flex items-center justify-center shrink-0">
                    {item.token}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{item.departmentName}</h4>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> {item.doctorName} ({item.roomNo})
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setActiveToken(item.token);
                      onNavigate('/patient/track');
                    }}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1"
                  >
                    <Ticket className="w-3.5 h-3.5" /> Track
                  </button>
                  <button
                    onClick={() => handleInspectToken(item.token)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Queue History Found</h3>
          <p className="text-xs text-slate-500">You do not have any past tokens matching your search criteria.</p>
        </div>
      )}

      {/* Inspect Ticket Modal */}
      <Modal
        isOpen={!!selectedTokenDetails}
        onClose={() => setSelectedTokenDetails(null)}
        title={`Queue Ticket Details - ${selectedTokenDetails?.token}`}
        maxWidth="lg"
      >
        {selectedTokenDetails && <TokenCard details={selectedTokenDetails} onPrint={() => window.print()} />}
      </Modal>
    </div>
  );
};
