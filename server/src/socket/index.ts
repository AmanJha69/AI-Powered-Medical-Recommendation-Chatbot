import { Server, Socket } from 'socket.io';
import { z } from 'zod';
import { verifyToken } from '../middleware/auth';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';
import { generateMedicalResponse } from '../services/aiService';

const sendMessageSchema = z.object({
  chatId: z.string(),
  content: z.string().min(1).max(2000),
});

export function setupSocket(io: Server): void {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) {
      next(new Error('Authentication required'));
      return;
    }
    const payload = verifyToken(token);
    if (!payload) {
      next(new Error('Invalid token'));
      return;
    }
    socket.data.userId = payload.userId;
    next();
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId as string;

    socket.on('join_chat', async (chatId: string) => {
      try {
        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }
        socket.join(`chat:${chatId}`);
      } catch {
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    socket.on('typing_start', ({ chatId }: { chatId: string }) => {
      socket.to(`chat:${chatId}`).emit('typing_start', { chatId, userId });
    });

    socket.on('typing_stop', ({ chatId }: { chatId: string }) => {
      socket.to(`chat:${chatId}`).emit('typing_stop', { chatId, userId });
    });

    socket.on('send_message', async (data: unknown) => {
      const parsed = sendMessageSchema.safeParse(data);
      if (!parsed.success) {
        socket.emit('error', { message: parsed.error.issues[0].message });
        return;
      }

      const { chatId, content } = parsed.data;

      try {
        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        const userMessage = await Message.create({
          chatId: chat._id,
          userId,
          role: 'user',
          content,
        });

        if (chat.title === 'New chat') {
          chat.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        }
        chat.updatedAt = new Date();
        await chat.save();

        io.to(`chat:${chatId}`).emit('receive_message', {
          message: userMessage,
          chatTitle: chat.title,
        });

        io.to(`chat:${chatId}`).emit('ai_thinking', { chatId, thinking: true });

        const aiResult = await generateMedicalResponse(chatId, content);

        const assistantMessage = await Message.create({
          chatId: chat._id,
          userId,
          role: 'assistant',
          content: aiResult.reply,
          metadata: aiResult.metadata,
        });

        io.to(`chat:${chatId}`).emit('ai_thinking', { chatId, thinking: false });
        io.to(`chat:${chatId}`).emit('receive_message', {
          message: assistantMessage,
          chatTitle: chat.title,
        });
      } catch (error) {
        console.error('Socket send_message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
        io.to(`chat:${parsed.data.chatId}`).emit('ai_thinking', {
          chatId: parsed.data.chatId,
          thinking: false,
        });
      }
    });
  });
}
