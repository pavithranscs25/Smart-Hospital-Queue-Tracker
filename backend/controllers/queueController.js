import { queueService } from '../services/queueService.js';

export const queueController = {
  getDepartments: (_req, res) => {
    const depts = queueService.getDepartments();
    return res.status(200).json({ success: true, departments: depts });
  },

  getDoctors: (req, res) => {
    const { departmentId } = req.query;
    const docs = queueService.getDoctors(departmentId);
    return res.status(200).json({ success: true, doctors: docs });
  },

  generateToken: (req, res) => {
    try {
      const { patientId, patientName, patientAge, patientGender, patientPhone, departmentId, doctorId, symptoms, priority } = req.body;

      if (!departmentId || !doctorId || !patientName) {
        return res.status(400).json({
          success: false,
          message: 'Department, doctor, and patient name are required.'
        });
      }

      const tokenItem = queueService.generateToken({
        patientId,
        patientName,
        patientAge: Number(patientAge) || 30,
        patientGender,
        patientPhone,
        departmentId,
        doctorId,
        symptoms,
        priority
      });

      const details = queueService.getTokenDetails(tokenItem.token);

      return res.status(201).json({
        success: true,
        message: 'Token generated successfully',
        token: tokenItem.token,
        data: details
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate queue token'
      });
    }
  },

  getCurrentQueue: (_req, res) => {
    const status = queueService.getCurrentQueueStatus();
    return res.status(200).json({ success: true, data: status });
  },

  getTokenDetails: (req, res) => {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token parameter is required.' });
    }

    const details = queueService.getTokenDetails(token);
    if (!details) {
      return res.status(404).json({ success: false, message: 'Token not found.' });
    }

    return res.status(200).json({ success: true, data: details });
  },

  getDoctorQueue: (req, res) => {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'Doctor ID is required.' });
    }

    const data = queueService.getDoctorQueue(doctorId);
    return res.status(200).json({ success: true, data });
  },

  callPatient: (req, res) => {
    try {
      const { token } = req.params;
      const { doctorId } = req.body;

      let docId = doctorId;
      let targetToken = token;

      if (token === 'next' && !docId) {
        return res.status(400).json({ success: false, message: 'Doctor ID required to call next patient.' });
      }

      if (token !== 'next') {
        const details = queueService.getTokenDetails(token);
        if (details) docId = details.doctorId;
      }

      const result = queueService.callNextPatient(docId, token === 'next' ? undefined : targetToken);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  completePatient: (req, res) => {
    try {
      const { token } = req.params;
      const updated = queueService.completePatient(token);
      return res.status(200).json({
        success: true,
        message: `Token ${token} consultation completed.`,
        data: updated
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  skipPatient: (req, res) => {
    try {
      const { token } = req.params;
      const { reason } = req.body;
      const updated = queueService.skipPatient(token, reason);
      return res.status(200).json({
        success: true,
        message: `Token ${token} skipped.`,
        data: updated
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  holdPatient: (req, res) => {
    try {
      const { token } = req.params;
      const { reason } = req.body;
      const updated = queueService.holdPatient(token, reason);
      return res.status(200).json({
        success: true,
        message: `Token ${token} put on hold.`,
        data: updated
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getPatientHistory: (req, res) => {
    const { patientId } = req.params;
    const tokens = queueService.getPatientTokens(patientId);
    return res.status(200).json({ success: true, data: tokens });
  }
};
