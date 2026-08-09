import { mockUsers, doctors } from '../data/mockData.js';

export const authController = {
  login: (req, res) => {
    try {
      const { email, password, role } = req.body;

      // Simple mock authentication
      let user = mockUsers.find(
        u => u.email.toLowerCase() === (email || '').toLowerCase()
      );

      // If user not found by email, find default by role
      if (!user && role) {
        user = mockUsers.find(u => u.role === role);
      }

      if (!user) {
        // Fallback default patient user
        user = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: email ? email.split('@')[0] : 'Guest User',
          email: email || 'user@apexmedicare.com',
          role: role || 'patient',
          phone: '+1 555-0199'
        };
      }

      // Generate mock token
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      let doctorDetails = null;
      if (user.role === 'doctor' && user.doctorId) {
        doctorDetails = doctors.find(d => d.id === user.doctorId) || null;
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user,
        doctorDetails
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  },

  register: (req, res) => {
    try {
      const { name, email, phone, role, age, gender, bloodGroup } = req.body;

      const newUser = {
        id: `pat-${Date.now().toString().slice(-4)}`,
        name: name || 'New Patient',
        email: email || 'patient@example.com',
        role: role || 'patient',
        phone: phone || '',
        age: Number(age) || 30,
        gender: gender || 'Other',
        bloodGroup: bloodGroup || 'O+'
      };

      mockUsers.push(newUser);

      const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: newUser
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }
};
