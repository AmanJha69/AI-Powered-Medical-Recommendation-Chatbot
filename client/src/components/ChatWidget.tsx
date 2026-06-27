import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { chatApi } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import SymptomChips from './SymptomChips';
import { useAuth } from '../context/AuthContext';
import type { Chat, Message } from '../types';

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, aiThinking, isTyping, isOpen]);

  const loadChats = useCallback(async () => {
    try {
      const { data } = await chatApi.list();
      setChats(data);
      if (data.length > 0 && !activeChatId) {
        loadChat(data[0]._id);
      }
    } catch {
      toast.error('Failed to load chats');
    }
  }, [activeChatId]);

  const loadChat = async (chatId: string) => {
    try {
      const { data } = await chatApi.get(chatId);
      setMessages(data.messages);
      setActiveChatId(chatId);
    } catch {
      toast.error('Failed to load chat');
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadChats();
    }
  }, [isOpen, loadChats]);

  const { joinChat, sendMessage, emitTypingStart, emitTypingStop } = useSocket({
    onMessage: (message, chatTitle) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (chatTitle) {
        setChats((prev) =>
          prev.map((c) => (c._id === message.chatId ? { ...c, title: chatTitle } : c))
        );
      }
    },
    onTypingStart: () => setIsTyping(true),
    onTypingStop: () => setIsTyping(false),
    onAiThinking: (_chatId, thinking) => setAiThinking(thinking),
    onError: (msg) => toast.error(msg),
  });

  useEffect(() => {
    if (activeChatId && isOpen) joinChat(activeChatId);
  }, [activeChatId, joinChat, isOpen]);

  const handleSendWithChat = async (content: string, attachments?: any[]) => {
    let chatId = activeChatId;
    if (!chatId) {
      try {
        const { data } = await chatApi.create();
        setChats((prev) => [data, ...prev]);
        setActiveChatId(data._id);
        chatId = data._id;
        joinChat(data._id);
      } catch {
        toast.error('Failed to create chat');
        return;
      }
    }
    sendMessage(chatId, content, attachments);
  };

  const handleNewChat = async () => {
    try {
      const { data } = await chatApi.create();
      setChats((prev) => [data, ...prev]);
      setActiveChatId(data._id);
      setMessages([]);
      joinChat(data._id);
    } catch {
      toast.error('Failed to create chat');
    }
  };

  // Do not render the widget on the full screen chat page, login, register, for doctors, or unauthenticated users
  if (
    window.location.pathname === '/chat' ||
    window.location.pathname === '/login' ||
    window.location.pathname === '/register' ||
    user?.role === 'doctor' ||
    !user
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 50, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex h-[600px] max-h-[80vh] w-[400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold">Dr. G</h3>
                  <p className="text-xs text-primary-100">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleNewChat}
                  className="rounded-lg p-1.5 hover:bg-white/20 transition"
                  title="New Chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/chat');
                  }}
                  className="rounded-lg p-1.5 hover:bg-white/20 transition"
                  title="Open Full Screen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-white/20 transition"
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 text-4xl">👋</div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">Need Medical Advice?</h4>
                  <p className="mt-2 text-sm text-slate-500 mb-6 dark:text-slate-400">
                    I'm your personal AI health assistant. Ask me anything about your symptoms or medications.
                  </p>
                  <SymptomChips onSelect={handleSendWithChat} disabled={aiThinking} />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <ChatBubble key={msg._id} message={msg} />
                  ))}
                  {aiThinking && <TypingIndicator />}
                  {isTyping && !aiThinking && (
                    <p className="text-xs text-slate-400">Assistant is typing...</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-slate-900">
              <ChatInput
                onSend={handleSendWithChat}
                onTypingStart={() => activeChatId && emitTypingStart(activeChatId)}
                onTypingStop={() => activeChatId && emitTypingStop(activeChatId)}
                disabled={aiThinking}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={() => setIsOpen(true)}
            className="absolute bottom-0 right-0 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-600/30 transition hover:bg-primary-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
