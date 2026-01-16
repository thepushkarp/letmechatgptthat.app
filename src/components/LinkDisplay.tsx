"use client";

import React, { useState, useEffect } from "react";

interface LinkDisplayProps {
  link: string;
  copied: boolean;
  onCopy: () => void;
}

export const LinkDisplay = React.memo(function LinkDisplay({
  link,
  copied,
  onCopy,
}: LinkDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`space-y-5 p-6 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        background: "var(--surface-primary)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-md)",
        transitionTimingFunction: "var(--ease-out-expo)",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="p-2.5"
          style={{
            background: "var(--accent-light)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: "var(--accent)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <div>
          <h3
            className="font-semibold"
            style={{ color: "var(--text-primary)", fontSize: "16px" }}
          >
            Your link is ready
          </h3>
          <p
            className="mt-0.5"
            style={{ color: "var(--text-secondary)", fontSize: "14px" }}
          >
            Share this with someone who should have just asked ChatGPT
          </p>
        </div>
      </div>

      {/* Link input and copy button */}
      <div className="flex items-stretch gap-3">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={link}
            readOnly
            className="w-full outline-none transition-colors cursor-text"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              padding: "14px 16px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
            }}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>

        <button
          onClick={onCopy}
          className={`copy-btn flex items-center gap-2 whitespace-nowrap font-medium ${copied ? "copied" : ""}`}
          style={{
            padding: "14px 20px",
            borderRadius: "var(--radius-lg)",
            fontSize: "14px",
          }}
        >
          {copied ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Preview link */}
      <div className="pt-1">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm transition-colors group"
          style={{ color: "var(--accent)" }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="group-hover:underline">Preview the animation</span>
          <svg
            className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
});
