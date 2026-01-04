interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder = "Message ChatGPT...",
  disabled = false,
}: ChatInputProps) {
  return (
    <div className="relative w-full">
      <div className="flex items-end gap-2 bg-[#2f2f2f] border border-[#424242] rounded-3xl px-4 py-3 focus-within:border-[#10a37f] transition-colors">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none outline-none min-h-[24px] max-h-[200px] overflow-y-auto"
          style={{
            height: "auto",
            minHeight: "24px",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
          }}
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="p-2 bg-white disabled:bg-gray-600 rounded-full transition-colors hover:bg-gray-200 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send message"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-black"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19V5m0 0l-7 7m7-7l7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
