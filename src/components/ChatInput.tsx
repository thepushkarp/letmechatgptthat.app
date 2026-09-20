"use client";

import { useRef, useEffect, useId } from "react";
import { SendIcon } from "./SendIcon";

export const MAX_QUERY_LENGTH = 2000;

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  error,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const id = useId();
  const length = value.trim().length;
  const tooLong = length > MAX_QUERY_LENGTH;
  const message = tooLong ? "Keep your question to 2,000 characters." : error;
  const showCount = length >= 1800;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [value]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      aria-busy={isSubmitting}
    >
      <div className="composer" data-invalid={tooLong || undefined}>
        <label className="sr-only" htmlFor={id}>
          Your question
        </label>
        <textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          onKeyDown={(event) => {
            // Safari can end composition before dispatching the final Enter key.
            if (
              event.nativeEvent.isComposing ||
              composingRef.current ||
              event.keyCode === 229
            )
              return;
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Ask a question"
          readOnly={isSubmitting}
          aria-invalid={tooLong}
          aria-describedby={
            [message ? id + "-error" : "", showCount ? id + "-count" : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          rows={1}
          className="composer-text"
        />
        <div className="composer-toolbar">
          <span className="composer-label">
            {isSubmitting ? "Creating link…" : "Create a link to share"}
          </span>
          <button
            type="submit"
            className="send-btn"
            disabled={isSubmitting || !length || tooLong}
            aria-label="Create link"
            title="Create link (Enter)"
          >
            {isSubmitting ? (
              <span className="spinner" aria-hidden="true" />
            ) : (
              <SendIcon />
            )}
          </button>
        </div>
      </div>
      <div className="composer-feedback">
        <p id={id + "-error"} role="alert" className="error-text">
          {message}
        </p>
        {showCount && (
          <span id={id + "-count"} className={tooLong ? "error-text" : "muted"}>
            {length.toLocaleString("en-US")} / 2,000
          </span>
        )}
      </div>
      <span role="status" className="sr-only">
        {isSubmitting ? "Creating link" : ""}
      </span>
    </form>
  );
}
