import { departments, doctors, initialQueue, mockUsers } from '../data/mockData.js';

// Mutable in-memory store
let queueStore = [...initialQueue];
let tokenCounters = {
  'GEN': 22,
  'CARD': 9,
  'ORTHO': 5,
  'PED': 12,
  'NEURO': 3,
  'DERM': 7
};

export const queueService = {
  getDepartments: () => {
    return departments;
  },

  getDoctors: (departmentId) => {
    if (departmentId) {
      return doctors.filter(d => d.departmentId === departmentId);
    }
    return doctors;
  },

  getDoctorById: (doctorId) => {
    return doctors.find(d => d.id === doctorId);
  },

  // Recalculate estimated waiting times and positions for waiting patients in a doctor's queue
  updateDoctorQueueEstimates: (doctorId) => {
    const doc = doctors.find(d => d.id === doctorId);
    const avgTime = doc ? doc.avgConsultationTime : 10;

    const waitingInQueue = queueStore.filter(
      item => item.doctorId === doctorId && item.status === 'waiting'
    );

    waitingInQueue.forEach((item, index) => {
      item.estimatedWaitMinutes = index * avgTime;
    });
  },

  // Generate a new Token
  generateToken: (data) => {
    const dept = departments.find(d => d.id === data.departmentId);
    const doc = doctors.find(d => d.id === data.doctorId);

    if (!dept || !doc) {
      throw new Error('Invalid department or doctor specified.');
    }

    const code = dept.code || 'GEN';
    const currentNum = (tokenCounters[code] || 0) + 1;
    tokenCounters[code] = currentNum;

    const formattedNum = currentNum < 10 ? `00${currentNum}` : currentNum < 100 ? `0${currentNum}` : `${currentNum}`;
    const token = `${code}-${formattedNum}`;

    // Count patients ahead for this doctor
    const patientsAhead = queueStore.filter(
      item => item.doctorId === doc.id && item.status === 'waiting'
    ).length;

    const estimatedWaitMinutes = patientsAhead * doc.avgConsultationTime;

    const newItem = {
      token,
      patientId: data.patientId || `pat-${Date.now().toString().slice(-4)}`,
      patientName: data.patientName,
      patientAge: data.patientAge || 30,
      patientGender: data.patientGender || 'Other',
      patientPhone: data.patientPhone || '',
      departmentId: dept.id,
      departmentName: dept.name,
      doctorId: doc.id,
      doctorName: doc.name,
      roomNo: doc.roomNo,
      symptoms: data.symptoms || '',
      status: 'waiting',
      priority: data.priority || 'normal',
      createdAt: new Date().toISOString(),
      estimatedWaitMinutes
    };

    if (data.priority === 'emergency') {
      // Put emergency patient at top of waiting list
      const firstWaitingIdx = queueStore.findIndex(
        i => i.doctorId === doc.id && i.status === 'waiting'
      );
      if (firstWaitingIdx !== -1) {
        queueStore.splice(firstWaitingIdx, 0, newItem);
      } else {
        queueStore.push(newItem);
      }
    } else {
      queueStore.push(newItem);
    }

    queueService.updateDoctorQueueEstimates(doc.id);

    return newItem;
  },

  // Get specific token queue details
  getTokenDetails: (token) => {
    const item = queueStore.find(i => i.token.toUpperCase() === token.toUpperCase());
    if (!item) return null;

    const doc = doctors.find(d => d.id === item.doctorId);
    const nowServingItem = queueStore.find(
      i => i.doctorId === item.doctorId && i.status === 'serving'
    );

    // Calculate queue position if waiting
    let position = 0;
    let patientsAhead = 0;

    if (item.status === 'waiting') {
      const waitingList = queueStore.filter(
        i => i.doctorId === item.doctorId && i.status === 'waiting'
      );
      const index = waitingList.findIndex(i => i.token === item.token);
      if (index !== -1) {
        position = index + 1;
        patientsAhead = index;
      }
    }

    const estimatedWait = patientsAhead * (doc ? doc.avgConsultationTime : 10);

    return {
      ...item,
      nowServing: nowServingItem ? nowServingItem.token : 'None',
      position: position > 0 ? position : (item.status === 'serving' ? 'Now Serving' : '-'),
      patientsAhead: item.status === 'waiting' ? patientsAhead : 0,
      estimatedWaitMinutes: item.status === 'waiting' ? estimatedWait : 0,
    };
  },

  // Current overall queue status summary
  getCurrentQueueStatus: () => {
    const currentlyServing = queueStore.filter(i => i.status === 'serving');
    const waitingList = queueStore.filter(i => i.status === 'waiting');
    const completedList = queueStore.filter(i => i.status === 'completed');

    return {
      totalInQueue: waitingList.length + currentlyServing.length,
      currentlyServingCount: currentlyServing.length,
      waitingCount: waitingList.length,
      completedTodayCount: completedList.length,
      servingTokens: currentlyServing.map(i => ({
        token: i.token,
        doctor: i.doctorName,
        department: i.departmentName,
        room: i.roomNo,
        patientName: i.patientName
      })),
      latestTokens: queueStore.slice(-10).reverse()
    };
  },

  // Doctor Queue view
  getDoctorQueue: (doctorId) => {
    const doctorQueue = queueStore.filter(i => i.doctorId === doctorId);
    const doc = doctors.find(d => d.id === doctorId);

    const currentlyServing = doctorQueue.find(i => i.status === 'serving') || null;
    const waitingPatients = doctorQueue.filter(i => i.status === 'waiting');
    const onHoldPatients = doctorQueue.filter(i => i.status === 'on_hold');
    const skippedPatients = doctorQueue.filter(i => i.status === 'skipped');
    const completedPatients = doctorQueue.filter(i => i.status === 'completed');

    const nextPatient = waitingPatients.length > 0 ? waitingPatients[0] : null;

    return {
      doctor: doc,
      currentPatient: currentlyServing,
      nextPatient,
      waitingPatients,
      onHoldPatients,
      skippedPatients,
      completedPatients,
      totalWaiting: waitingPatients.length,
      totalCompleted: completedPatients.length,
      avgConsultationTime: doc ? doc.avgConsultationTime : 10,
      fullQueue: doctorQueue
    };
  },

  // Doctor Action: Call Next Patient or Call Specific Token
  callNextPatient: (doctorId, specificToken) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) throw new Error('Doctor not found');

    const currentServing = queueStore.find(
      i => i.doctorId === doctorId && i.status === 'serving'
    );
    if (currentServing) {
      currentServing.status = 'completed';
      currentServing.completedAt = new Date().toISOString();
      doc.patientsServedToday += 1;
    }

    let targetItem;

    if (specificToken) {
      targetItem = queueStore.find(
        i => i.token.toUpperCase() === specificToken.toUpperCase() && i.doctorId === doctorId
      );
    } else {
      targetItem = queueStore.find(
        i => i.doctorId === doctorId && (i.status === 'waiting' || i.status === 'on_hold')
      );
    }

    if (!targetItem) {
      doc.status = 'available';
      return { message: 'No waiting patients in queue.', currentPatient: null };
    }

    targetItem.status = 'serving';
    targetItem.calledAt = new Date().toISOString();
    doc.status = 'busy';

    queueService.updateDoctorQueueEstimates(doctorId);

    return {
      message: `Called patient ${targetItem.patientName} (${targetItem.token})`,
      currentPatient: targetItem
    };
  },

  // Doctor Action: Complete Consultation
  completePatient: (token) => {
    const item = queueStore.find(i => i.token.toUpperCase() === token.toUpperCase());
    if (!item) throw new Error('Token not found');

    item.status = 'completed';
    item.completedAt = new Date().toISOString();

    const doc = doctors.find(d => d.id === item.doctorId);
    if (doc) {
      doc.patientsServedToday += 1;
      const hasServing = queueStore.some(i => i.doctorId === doc.id && i.status === 'serving');
      if (!hasServing) {
        doc.status = 'available';
      }
    }

    queueService.updateDoctorQueueEstimates(item.doctorId);
    return item;
  },

  // Doctor Action: Skip Patient
  skipPatient: (token, reason) => {
    const item = queueStore.find(i => i.token.toUpperCase() === token.toUpperCase());
    if (!item) throw new Error('Token not found');

    item.status = 'skipped';
    item.skipReason = reason || 'Patient absent when called';

    const doc = doctors.find(d => d.id === item.doctorId);
    if (doc) {
      const hasServing = queueStore.some(i => i.doctorId === doc.id && i.status === 'serving');
      if (!hasServing) {
        doc.status = 'available';
      }
    }

    queueService.updateDoctorQueueEstimates(item.doctorId);
    return item;
  },

  // Doctor Action: Put Patient on Hold
  holdPatient: (token, reason) => {
    const item = queueStore.find(i => i.token.toUpperCase() === token.toUpperCase());
    if (!item) throw new Error('Token not found');

    item.status = 'on_hold';
    item.holdAt = new Date().toISOString();
    if (reason) item.skipReason = reason;

    queueService.updateDoctorQueueEstimates(item.doctorId);
    return item;
  },

  // Get tokens for a patient
  getPatientTokens: (patientIdOrPhone) => {
    return queueStore.filter(
      i => i.patientId === patientIdOrPhone || i.patientPhone === patientIdOrPhone
    );
  },

  // Admin Dashboard Statistics
  getAdminStats: () => {
    const totalPatients = queueStore.length;
    const currentlyWaiting = queueStore.filter(i => i.status === 'waiting').length;
    const inConsultation = queueStore.filter(i => i.status === 'serving').length;
    const completed = queueStore.filter(i => i.status === 'completed').length;
    const onHoldOrSkipped = queueStore.filter(i => i.status === 'on_hold' || i.status === 'skipped').length;

    const availableDoctors = doctors.filter(d => d.status === 'available' || d.status === 'busy').length;

    const departmentStats = departments.map(dept => {
      const deptTokens = queueStore.filter(i => i.departmentId === dept.id);
      const waiting = deptTokens.filter(i => i.status === 'waiting').length;
      const serving = deptTokens.filter(i => i.status === 'serving').length;
      const completedCount = deptTokens.filter(i => i.status === 'completed').length;

      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        totalTokens: deptTokens.length,
        waiting,
        serving,
        completed: completedCount,
        avgWaitTimeMinutes: dept.avgConsultationTime * waiting
      };
    });

    return {
      overview: {
        totalPatientsToday: totalPatients + 18,
        currentlyWaiting,
        inConsultation,
        completedConsultations: completed + 18,
        activeDoctorsCount: availableDoctors,
        totalDoctorsCount: doctors.length,
        averageWaitTimeMinutes: 14,
        averageConsultationTimeMinutes: 9,
        onHoldOrSkipped
      },
      departmentStats,
      doctors,
      recentQueue: queueStore.slice(-10).reverse()
    };
  }
};
