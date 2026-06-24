import type { Chat } from '../types';

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
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            + New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-slate-400 dark:text-slate-500">No conversations yet</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`group mb-1 flex items-center rounded-lg ${
                  activeChatId === chat._id ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectChat(chat._id);
                    onClose();
                  }}
                  className="flex-1 truncate px-3 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300"
                >
                  {chat.title}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat._id);
                  }}
                  className="mr-2 hidden rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 group-hover:block dark:text-slate-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  title="Delete chat"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
