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
  placeholder = "Type your question here...",
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
    <div className="relative w-full group">
      {/* Subtle glow effect on focus */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/10 rounded-[30px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />

      <div
        className={`
          relative flex items-end gap-3
          bg-surface-primary
          border border-border-subtle
          rounded-[28px]
          px-5 py-4
          transition-all duration-200
          group-focus-within:border-accent/50
          group-focus-within:shadow-glow
          ${disabled ? "opacity-50" : ""}
        `}
      >
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
            text-text-primary
            placeholder-text-muted
            resize-none
            outline-none
            min-h-[28px]
            max-h-[200px]
            overflow-y-auto
            text-[16px]
            leading-7
          "
          style={{
            height: "auto",
            minHeight: "28px",
          }}
        />

        {/* Send button */}
        <button
          onClick={onSubmit}
          disabled={disabled || !hasValue}
          className={`
            relative
            p-2.5
            rounded-xl
            transition-all duration-200
            flex-shrink-0
            ${
              hasValue
                ? "bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
                : "bg-bg-tertiary text-text-muted cursor-not-allowed"
            }
          `}
          aria-label="Generate link"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
