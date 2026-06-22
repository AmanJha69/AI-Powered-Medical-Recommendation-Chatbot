import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import ChatSidebar from '../components/ChatSidebar';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import SymptomChips from '../components/SymptomChips';
import type { Chat, Message } from '../types';

export default function ChatPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiThinking, isTyping]);

  const loadChats = useCallback(async () => {
    try {
      const { data } = await chatApi.list();
      setChats(data);
    } catch {
      toast.error('Failed to load chats');
    }
  }, []);

  const loadChat = useCallback(async (chatId: string) => {
    try {
      const { data } = await chatApi.get(chatId);
      setMessages(data.messages);
      setActiveChatId(chatId);
    } catch {
      toast.error('Failed to load chat');
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

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
      loadChats();
    },
    onTypingStart: () => setIsTyping(true),
    onTypingStop: () => setIsTyping(false),
    onAiThinking: (_chatId, thinking) => setAiThinking(thinking),
    onError: (msg) => toast.error(msg),
  });

  useEffect(() => {
    if (activeChatId) joinChat(activeChatId);
  }, [activeChatId, joinChat]);

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

  const handleDeleteChat = async (id: string) => {
    try {
      await chatApi.delete(id);
      setChats((prev) => prev.filter((c) => c._id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch {
      toast.error('Failed to delete chat');
    }
  };

  const handleSendWithChat = async (content: string) => {
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
    sendMessage(chatId, content);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            title="Back to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Dr. G Chat</h1>
            <p className="text-xs text-slate-500">Hello, {user?.name}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={loadChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex flex-1 flex-col bg-slate-50">
          {!activeChatId ? (
            <div className="flex flex-1 flex-col items-center justify-center px-4">
              <div className="max-w-lg text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
                  💬
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  How can I help you today?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Describe your symptoms or pick a quick option below to start a conversation.
                </p>
                <div className="mt-6">
                  <SymptomChips onSelect={handleSendWithChat} />
                </div>
              </div>
              <div className="mt-8 w-full max-w-2xl">
                <ChatInput
                  onSend={handleSendWithChat}
                  onTypingStart={() => {}}
                  onTypingStop={() => {}}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mx-auto max-w-3xl space-y-4">
                  {messages.length === 0 && (
                    <div className="mb-4">
                      <SymptomChips onSelect={handleSendWithChat} disabled={aiThinking} />
                    </div>
                  )}
                  {messages.map((msg) => (
                     <ChatBubble key={msg._id} message={msg} />
                  ))}
                  {aiThinking && <TypingIndicator />}
                  {isTyping && !aiThinking && (
                    <p className="text-xs text-slate-400">Assistant is typing...</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="mx-auto w-full max-w-3xl pb-6">
                <ChatInput
                  onSend={handleSendWithChat}
                  onTypingStart={() => activeChatId && emitTypingStart(activeChatId)}
                  onTypingStop={() => activeChatId && emitTypingStop(activeChatId)}
                  disabled={aiThinking}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
