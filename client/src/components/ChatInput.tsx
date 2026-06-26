import { useState, useRef, useEffect, ChangeEvent } from 'react';
import type { Attachment } from '../types';

interface ChatInputProps {
  onSend: (content: string, attachments?: Attachment[]) => void;
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
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setAttachments([{ name: file.name, type: file.type, data: base64Data }]);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = () => {
    setAttachments([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed && attachments.length === 0 || disabled) return;
    
    onSend(trimmed, attachments.length > 0 ? attachments : undefined);
    setValue('');
    setAttachments([]);
    onTypingStop();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      {attachments.length > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
          <div className="h-12 w-12 overflow-hidden rounded bg-slate-100 dark:bg-slate-800 flex-shrink-0">
            {attachments[0].type.startsWith('image/') ? (
              <img src={attachments[0].data} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">FILE</div>
            )}
          </div>
          <div className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
            {attachments[0].name}
          </div>
          <button
            type="button"
            onClick={removeAttachment}
            className="p-1 text-slate-400 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*,.pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex items-center justify-center rounded-xl p-3 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          title="Attach medical report or image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Describe your symptoms or attach a report..."
          disabled={disabled}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-900"
        />
        <button
          type="submit"
          disabled={disabled || (!value.trim() && attachments.length === 0)}
          className="rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-500"
        >
          Send
        </button>
      </div>
    </form>
  );
}
