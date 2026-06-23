import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  const handleChange = (text: string) => {
    setValue(text);
    onTypingStart();
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(onTypingStop, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    
    onSend(trimmed);
    setValue('');
    onTypingStop();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Describe your symptoms..."
          disabled={disabled}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-900"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-500"
        >
          Send
        </button>
      </div>
    </form>
  );
}
