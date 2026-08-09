import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { queueApi } from '../../services/api.js';
import { TokenCard } from '../../components/TokenCard.jsx';
import { Modal } from '../../components/Modal.jsx';
import {
  Building2,
  Stethoscope,
  User,
  Clock,
  Ticket,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const GetTokenPage = ({ onNavigate }) => {
  const { user, setActiveToken } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [patientName, setPatientName] = useState(user?.name || 'John Doe');
  const [patientAge, setPatientAge] = useState(user?.age || 34);
  const [patientGender, setPatientGender] = useState(user?.gender || 'Male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [symptoms, setSymptoms] = useState('');
  const [priority, setPriority] = useState('normal');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTokenDetails, setGeneratedTokenDetails] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depts = await queueApi.getDepartments();
        const docs = await queueApi.getDoctors();
        setDepartments(depts);
        setDoctors(docs);

        if (depts.length > 0) {
          setSelectedDeptId(depts[0].id);
        }
      } catch (err) {
        console.error('Error fetching departments/doctors:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDeptId) {
      const matchDocs = doctors.filter(d => d.departmentId === selectedDeptId);
      setFilteredDoctors(matchDocs);
      if (matchDocs.length > 0) {
        setSelectedDoctorId(matchDocs[0].id);
      } else {
        setSelectedDoctorId('');
      }
    }
  }, [selectedDeptId, doctors]);

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    if (!selectedDeptId || !selectedDoctorId || !patientName) {
      alert('Please select department, doctor, and enter patient name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await queueApi.generateToken({
        patientId: user?.id || `pat-${Date.now()}`,
        patientName,
        patientAge,
        patientGender,
        patientPhone,
        departmentId: selectedDeptId,
        doctorId: selectedDoctorId,
        symptoms,
        priority
      });

      setGeneratedTokenDetails(res.data);
      setActiveToken(res.token);
      setShowConfirmationModal(true);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to generate token');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold mb-2">
          <Ticket className="w-4 h-4" /> OPD Token Issuance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Get Hospital Queue Token</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select your department and doctor to reserve your spot in the live queue instantly.
        </p>
      </div>

      <form onSubmit={handleGenerateToken} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        {/* Step 1: Select Department */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" /> Step 1: Select Department
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {departments.map((dept) => {
              const isSelected = dept.id === selectedDeptId;
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {dept.code}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{dept.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{dept.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Doctor */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" /> Step 2: Select Doctor
          </label>
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDoctors.map((doc) => {
                const isSelected = doc.id === selectedDoctorId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                          {doc.roomNo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{doc.specialization}</p>
                      <p className="text-[11px] text-teal-700 mt-0.5 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> ~{doc.avgConsultationTime} mins / patient
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs">
              No active doctors currently scheduled for this department.
            </div>
          )}
        </div>

        {/* Step 3: Patient Information */}
        <div className="pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" /> Step 3: Patient Information
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Age</label>
              <input
                type="number"
                required
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Gender</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600 block mb-1">Symptoms / Reason for Visit (Optional)</label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Fever, headache, follow-up"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Priority Selection */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-600 block mb-1">Priority Tag</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="priority"
                checked={priority === 'normal'}
                onChange={() => setPriority('normal')}
                className="text-teal-600 focus:ring-teal-500"
              />
              Normal Consultation
            </label>
            <label className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold cursor-pointer">
              <input
                type="radio"
                name="priority"
                checked={priority === 'urgent'}
                onChange={() => setPriority('urgent')}
                className="text-rose-600 focus:ring-rose-500"
              />
              Urgent / High Fever
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            'Generating Token...'
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Generate OPD Queue Token Now
            </>
          )}
        </button>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
          onNavigate('/patient/track');
        }}
        title="Token Generated Successfully!"
        maxWidth="lg"
      >
        {generatedTokenDetails && (
          <div className="space-y-6">
            <TokenCard details={generatedTokenDetails} />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  onNavigate('/patient/track');
                }}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                Track Live Queue Status <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  onNavigate('/patient/dashboard');
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
