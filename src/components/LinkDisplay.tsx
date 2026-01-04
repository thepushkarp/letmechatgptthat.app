"use client";

import { useState, useEffect } from "react";

interface LinkDisplayProps {
  link: string;
  copied: boolean;
  onCopy: () => void;
}

export function LinkDisplay({ link, copied, onCopy }: LinkDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        space-y-5 p-6
        bg-surface-primary
        rounded-2xl
        border border-border-subtle
        shadow-lg
        transition-all duration-500
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <svg
            className="w-5 h-5 text-accent"
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
          <h3 className="font-display font-semibold text-text-primary">
            Your link is ready
          </h3>
          <p className="text-text-secondary text-sm mt-0.5">
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
            className="
              w-full
              bg-bg-primary
              text-text-primary
              px-4 py-3.5
              rounded-xl
              border border-border-subtle
              text-sm
              font-mono
              outline-none
              transition-colors
              group-hover:border-border-default
              cursor-text
              selection:bg-accent/20
            "
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>

        <button
          onClick={onCopy}
          className={`
            px-5 py-3.5
            rounded-xl
            font-medium
            text-sm
            transition-all duration-200
            flex items-center gap-2
            whitespace-nowrap
            ${
              copied
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
            }
          `}
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
          className="
            inline-flex items-center gap-1.5
            text-accent hover:text-accent-hover
            text-sm
            transition-colors
            group
          "
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
}
