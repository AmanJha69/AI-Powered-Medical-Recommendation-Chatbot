import { useEffect, useRef } from 'react';
import { getSocket, disconnectSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import type { Message } from '../types';

interface UseSocketOptions {
  onMessage?: (message: Message, chatTitle?: string) => void;
  onTypingStart?: (chatId: string) => void;
  onTypingStop?: (chatId: string) => void;
  onAiThinking?: (chatId: string, thinking: boolean) => void;
  onError?: (message: string) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { token } = useAuth();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);

    socket.on('receive_message', ({ message, chatTitle }: { message: Message; chatTitle?: string }) => {
      optionsRef.current.onMessage?.(message, chatTitle);
    });

    socket.on('typing_start', ({ chatId }: { chatId: string }) => {
      optionsRef.current.onTypingStart?.(chatId);
    });

    socket.on('typing_stop', ({ chatId }: { chatId: string }) => {
      optionsRef.current.onTypingStop?.(chatId);
    });

    socket.on('ai_thinking', ({ chatId, thinking }: { chatId: string; thinking: boolean }) => {
      optionsRef.current.onAiThinking?.(chatId, thinking);
    });

    socket.on('error', ({ message }: { message: string }) => {
      optionsRef.current.onError?.(message);
    });

    return () => {
      socket.off('receive_message');
      socket.off('typing_start');
      socket.off('typing_stop');
      socket.off('ai_thinking');
      socket.off('error');
    };
  }, [token]);

  useEffect(() => {
    return () => {
      if (!token) disconnectSocket();
    };
  }, [token]);

  const joinChat = (chatId: string) => {
    if (!token) return;
    getSocket(token).emit('join_chat', chatId);
  };

  const sendMessage = (chatId: string, content: string, attachments?: any[]) => {
    if (!token) return;
    getSocket(token).emit('send_message', { chatId, content, attachments });
  };

  const emitTypingStart = (chatId: string) => {
    if (!token) return;
    getSocket(token).emit('typing_start', { chatId });
  };

  const emitTypingStop = (chatId: string) => {
    if (!token) return;
    getSocket(token).emit('typing_stop', { chatId });
  };

  return { joinChat, sendMessage, emitTypingStart, emitTypingStop };
}
