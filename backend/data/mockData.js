export const departments = [
  {
    id: 'dept-1',
    name: 'General Medicine',
    code: 'GEN',
    description: 'Routine checkups, fever, flu, primary healthcare consultations.',
    roomPrefix: '10',
    avgConsultationTime: 8,
    icon: 'Stethoscope',
    activeDoctorsCount: 3
  },
  {
    id: 'dept-2',
    name: 'Cardiology',
    code: 'CARD',
    description: 'Heart health, ECG, blood pressure, cardiovascular consultations.',
    roomPrefix: '20',
    avgConsultationTime: 12,
    icon: 'HeartPulse',
    activeDoctorsCount: 2
  },
  {
    id: 'dept-3',
    name: 'Orthopedics',
    code: 'ORTHO',
    description: 'Bone, joint, fracture care and musculoskeletal treatment.',
    roomPrefix: '30',
    avgConsultationTime: 10,
    icon: 'Bone',
    activeDoctorsCount: 2
  },
  {
    id: 'dept-4',
    name: 'Pediatrics',
    code: 'PED',
    description: 'Child healthcare, vaccinations, pediatric consultations.',
    roomPrefix: '15',
    avgConsultationTime: 10,
    icon: 'Baby',
    activeDoctorsCount: 2
  },
  {
    id: 'dept-5',
    name: 'Neurology',
    code: 'NEURO',
    description: 'Brain, nerves, headache, spine and neurological disorders.',
    roomPrefix: '40',
    avgConsultationTime: 15,
    icon: 'Brain',
    activeDoctorsCount: 1
  },
  {
    id: 'dept-6',
    name: 'Dermatology',
    code: 'DERM',
    description: 'Skin care, allergies, rash, and cosmetic dermatological issues.',
    roomPrefix: '25',
    avgConsultationTime: 8,
    icon: 'Sparkles',
    activeDoctorsCount: 2
  }
];

export const doctors = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@apexmedicare.com',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    roomNo: 'Room 102',
    specialization: 'Senior Physician (MBBS, MD)',
    status: 'available',
    avgConsultationTime: 8,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    patientsServedToday: 14
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@apexmedicare.com',
    departmentId: 'dept-2',
    departmentName: 'Cardiology',
    roomNo: 'Room 205',
    specialization: 'Consultant Cardiologist (DM)',
    status: 'busy',
    avgConsultationTime: 12,
    avatar: 'https://images.unsplash.com/photo-1594824813566-78853b0e14c7?auto=format&fit=crop&q=80&w=300',
    patientsServedToday: 9
  },
  {
    id: 'doc-3',
    name: 'Dr. Vikramaditya Singh',
    email: 'vikram.singh@apexmedicare.com',
    departmentId: 'dept-3',
    departmentName: 'Orthopedics',
    roomNo: 'Room 301',
    specialization: 'Orthopedic Surgeon (MS)',
    status: 'available',
    avgConsultationTime: 10,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    patientsServedToday: 11
  },
  {
    id: 'doc-4',
    name: 'Dr. Priya Nair',
    email: 'priya.nair@apexmedicare.com',
    departmentId: 'dept-4',
    departmentName: 'Pediatrics',
    roomNo: 'Room 154',
    specialization: 'Pediatrician (DCH, MD)',
    status: 'available',
    avgConsultationTime: 10,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    patientsServedToday: 16
  },
  {
    id: 'doc-5',
    name: 'Dr. Meera Menon',
    email: 'meera.menon@apexmedicare.com',
    departmentId: 'dept-6',
    departmentName: 'Dermatology',
    roomNo: 'Room 252',
    specialization: 'Dermatologist (MD)',
    status: 'available',
    avgConsultationTime: 8,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    patientsServedToday: 8
  }
];

export const mockUsers = [
  {
    id: 'pat-101',
    name: 'John Doe',
    email: 'patient@example.com',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+'
  },
  {
    id: 'pat-102',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'patient',
    phone: '+1 (555) 876-5432',
    age: 28,
    gender: 'Female',
    bloodGroup: 'A+'
  },
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Kumar',
    email: 'doctor@example.com',
    role: 'doctor',
    doctorId: 'doc-1',
    phone: '+1 (555) 111-2233'
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Sharma',
    email: 'ananya@example.com',
    role: 'doctor',
    doctorId: 'doc-2',
    phone: '+1 (555) 444-5566'
  },
  {
    id: 'admin-1',
    name: 'Hospital Chief Admin',
    email: 'admin@example.com',
    role: 'admin',
    phone: '+1 (555) 999-0000'
  }
];

// Initial pre-populated in-memory queue items for realistic testing
const now = new Date();
const timeAgo = (mins) => new Date(now.getTime() - mins * 60000).toISOString();

export const initialQueue = [
  {
    token: 'GEN-018',
    patientId: 'pat-001',
    patientName: 'Robert Paulson',
    patientAge: 45,
    patientGender: 'Male',
    patientPhone: '+1 555-0101',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Kumar',
    roomNo: 'Room 102',
    symptoms: 'Mild fever and sore throat for 2 days',
    status: 'completed',
    priority: 'normal',
    createdAt: timeAgo(45),
    calledAt: timeAgo(30),
    completedAt: timeAgo(15),
    estimatedWaitMinutes: 0
  },
  {
    token: 'GEN-019',
    patientId: 'pat-002',
    patientName: 'Anita Desai',
    patientAge: 52,
    patientGender: 'Female',
    patientPhone: '+1 555-0102',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Kumar',
    roomNo: 'Room 102',
    symptoms: 'High blood pressure checkup and prescription refill',
    status: 'serving',
    priority: 'normal',
    createdAt: timeAgo(30),
    calledAt: timeAgo(10),
    estimatedWaitMinutes: 0
  },
  {
    token: 'GEN-020',
    patientId: 'pat-101',
    patientName: 'John Doe',
    patientAge: 34,
    patientGender: 'Male',
    patientPhone: '+1 (555) 234-5678',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Kumar',
    roomNo: 'Room 102',
    symptoms: 'Seasonal allergies and sinus headache',
    status: 'waiting',
    priority: 'normal',
    createdAt: timeAgo(20),
    estimatedWaitMinutes: 8
  },
  {
    token: 'GEN-021',
    patientId: 'pat-004',
    patientName: 'David Miller',
    patientAge: 61,
    patientGender: 'Male',
    patientPhone: '+1 555-0104',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Kumar',
    roomNo: 'Room 102',
    symptoms: 'Joint pain and general fatigue',
    status: 'waiting',
    priority: 'normal',
    createdAt: timeAgo(15),
    estimatedWaitMinutes: 16
  },
  {
    token: 'GEN-022',
    patientId: 'pat-005',
    patientName: 'Emily Clark',
    patientAge: 29,
    patientGender: 'Female',
    patientPhone: '+1 555-0105',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Kumar',
    roomNo: 'Room 102',
    symptoms: 'Stomach cramp after dinner',
    status: 'waiting',
    priority: 'normal',
    createdAt: timeAgo(8),
    estimatedWaitMinutes: 24
  },
  {
    token: 'CARD-008',
    patientId: 'pat-006',
    patientName: 'Michael Chang',
    patientAge: 58,
    patientGender: 'Male',
    patientPhone: '+1 555-0106',
    departmentId: 'dept-2',
    departmentName: 'Cardiology',
    doctorId: 'doc-2',
    doctorName: 'Dr. Ananya Sharma',
    roomNo: 'Room 205',
    symptoms: 'Chest tightness evaluation and ECG review',
    status: 'serving',
    priority: 'urgent',
    createdAt: timeAgo(25),
    calledAt: timeAgo(5),
    estimatedWaitMinutes: 0
  },
  {
    token: 'CARD-009',
    patientId: 'pat-007',
    patientName: 'Sophia Rodriguez',
    patientAge: 41,
    patientGender: 'Female',
    patientPhone: '+1 555-0107',
    departmentId: 'dept-2',
    departmentName: 'Cardiology',
    doctorId: 'doc-2',
    doctorName: 'Dr. Ananya Sharma',
    roomNo: 'Room 205',
    symptoms: 'Heart palpitations during exercise',
    status: 'waiting',
    priority: 'normal',
    createdAt: timeAgo(12),
    estimatedWaitMinutes: 12
  }
];
