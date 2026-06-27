import { Response } from 'express';
import { Appointment } from '../models/Appointment';
import { AuthRequest } from '../middleware/auth';

import { User } from '../models/User';

export async function getDoctorAppointments(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'doctor' || !user.doctorId) {
      res.status(403).json({ message: 'Access denied: Doctors only' });
      return;
    }
    const doctorId = user.doctorId;

    const appointments = await Appointment.find({ doctorId })
      .populate('userId', 'name email')
      .sort({ date: 1, time: 1 });
      
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Failed to fetch doctor appointments' });
  }
}

export async function updateAppointmentStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'doctor' || !user.doctorId) {
      res.status(403).json({ message: 'Access denied: Doctors only' });
      return;
    }
    const doctorId = user.doctorId;

    const appointment = await Appointment.findOne({ _id: id, doctorId });
    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found or unauthorized' });
      return;
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Status updated successfully', appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
}
