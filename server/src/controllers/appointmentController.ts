import { Request, Response } from 'express';
import axios from 'axios';
import { Appointment } from '../models/Appointment';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export async function bookAppointment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { doctorId, date, time } = req.body;
    
    if (!doctorId || !date || !time) {
      res.status(400).json({ message: 'Doctor ID, date, and time are required' });
      return;
    }

    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (existingAppointment) {
      res.status(409).json({ message: 'This time slot is already booked for this doctor' });
      return;
    }

    const appointment = new Appointment({
      userId,
      doctorId,
      date,
      time,
      status: 'confirmed',
    });

    await appointment.save();
    
    // Populate doctor details before returning
    await appointment.populate('doctorId', 'name specialty location contact fee');

    // If n8n mode is enabled, trigger the n8n webhook asynchronously
    if (process.env.USE_N8N === 'true' && process.env.N8N_APPOINTMENT_WEBHOOK_URL) {
      try {
        axios.post(process.env.N8N_APPOINTMENT_WEBHOOK_URL, {
          appointmentId: appointment._id,
          userId,
          userName: user.name,
          userEmail: user.email,
          doctorId: appointment.doctorId,
          date,
          time,
        }).catch(err => console.error('Failed to trigger n8n appointment webhook:', err.message));
      } catch (e) {
        // Ignore errors to not break the frontend flow
      }
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
}

export async function getUserAppointments(req: AuthRequest, res: Response): Promise<void> {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate('doctorId', 'name specialty location contact fee')
      .sort({ createdAt: -1 });
      
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
}

export async function cancelAppointment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const appointment = await Appointment.findOne({ _id: id, userId: req.userId });
    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
}

export async function rescheduleAppointment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!date || !time) {
      res.status(400).json({ message: 'Date and time are required' });
      return;
    }

    const appointment = await Appointment.findOne({ _id: id, userId: req.userId });
    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    const existingAppointment = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date,
      time,
      status: { $in: ['confirmed', 'pending'] },
      _id: { $ne: id }
    });

    if (existingAppointment) {
      res.status(409).json({ message: 'This time slot is already booked for this doctor' });
      return;
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'confirmed'; // Reset to confirmed if it was somehow cancelled
    await appointment.save();

    res.json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Failed to reschedule appointment' });
  }
}
