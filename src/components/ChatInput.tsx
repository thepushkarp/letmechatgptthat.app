"use client";

import { useRef, useEffect } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder = "Ask anything...",
  disabled = false,
  autoFocus = true,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const hasValue = value.trim().length > 0;

  return (
    <div className="w-full">
      <div
        className={`
          chatgpt-input
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {/* Attachment button (decorative) */}
        <button
          type="button"
          className="btn-icon flex-shrink-0 -ml-1"
          aria-label="Attach file"
          tabIndex={-1}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="
            flex-1
            bg-transparent
            text-[var(--text-primary)]
            placeholder-[var(--text-placeholder)]
            resize-none
            outline-none
            min-h-[24px]
            max-h-[200px]
            text-[15px]
            leading-6
            py-1.5
          "
          style={{
            height: "auto",
            minHeight: "24px",
            fontFamily: "var(--font-mono)",
          }}
        />

        {/* Send button */}
        <button
          onClick={onSubmit}
          disabled={disabled || !hasValue}
          className={`send-btn ${hasValue ? "active" : "inactive"}`}
          aria-label="Send message"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Hint text */}
      <p className="text-center text-[var(--text-muted)] text-xs mt-3">
        Press Enter to generate link, Shift+Enter for new line
      </p>
    </div>
  );
}
