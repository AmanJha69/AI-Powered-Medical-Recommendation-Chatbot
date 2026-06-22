import { Response } from 'express';
import { z } from 'zod';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';
import { AuthRequest } from '../middleware/auth';
import { generateMedicalResponse } from '../services/aiService';

const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000),
});

export async function listChats(req: AuthRequest, res: Response): Promise<void> {
  const chats = await Chat.find({ userId: req.userId })
    .sort({ updatedAt: -1 })
    .select('_id title createdAt updatedAt');
  res.json(chats);
}

export async function createChat(req: AuthRequest, res: Response): Promise<void> {
  const chat = await Chat.create({ userId: req.userId, title: 'New chat' });
  res.status(201).json(chat);
}

export async function getChat(req: AuthRequest, res: Response): Promise<void> {
  const chat = await Chat.findOne({ _id: req.params.id, userId: req.userId });
  if (!chat) {
    res.status(404).json({ message: 'Chat not found' });
    return;
  }

  const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
  res.json({ chat, messages });
}

export async function deleteChat(req: AuthRequest, res: Response): Promise<void> {
  const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!chat) {
    res.status(404).json({ message: 'Chat not found' });
    return;
  }
  await Message.deleteMany({ chatId: chat._id });
  res.json({ message: 'Chat deleted' });
}

export async function sendMessage(req: AuthRequest, res: Response): Promise<void> {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const chat = await Chat.findOne({ _id: req.params.id, userId: req.userId });
  if (!chat) {
    res.status(404).json({ message: 'Chat not found' });
    return;
  }

  const { content } = parsed.data;

  const userMessage = await Message.create({
    chatId: chat._id,
    userId: req.userId,
    role: 'user',
    content,
  });

  if (chat.title === 'New chat') {
    chat.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
    await chat.save();
  } else {
    chat.updatedAt = new Date();
    await chat.save();
  }

  const aiResult = await generateMedicalResponse(chat._id.toString(), content);

  const assistantMessage = await Message.create({
    chatId: chat._id,
    userId: req.userId!,
    role: 'assistant',
    content: aiResult.reply,
    metadata: aiResult.metadata,
  });

  res.status(201).json({ userMessage, assistantMessage });
}
