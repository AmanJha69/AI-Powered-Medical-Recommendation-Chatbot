import type { Chat } from '../types';
import { format } from 'date-fns';

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  open,
  onClose,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900/80 dark:border-slate-800/80 lg:relative lg:translate-x-0 lg:shadow-none lg:bg-white lg:dark:bg-slate-900 pillio-card p-0 flex flex-col h-full ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800/50">
          <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">
            Consultations
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewChat}
              className="rounded-full bg-primary-50 p-2.5 text-primary-600 transition-all hover:bg-primary-100 hover:scale-105 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
              title="New Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 p-2.5 text-slate-500 hover:bg-slate-200 lg:hidden"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                activeChatId === chat._id 
                  ? 'bg-primary-50/50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectChat(chat._id);
                  onClose();
                }}
                className="flex-1 text-left truncate flex flex-col"
              >
                <span className="font-medium text-sm truncate">{chat.title}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-60 mt-0.5">
                  {format(new Date(chat.updatedAt), 'MMM d, h:mm a')}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat._id);
                }}
                className="opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                title="Delete chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          {chats.length === 0 && (
            <div className="p-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-10">
              <span className="text-3xl block mb-2 opacity-50">💬</span>
              No conversations yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}
