"use client";

import { useState, useEffect, useRef, useId } from "react";

export function LinkDisplay({ link }: { link: string }) {
  const [copyState, setCopyState] = useState<
    "idle" | "copying" | "copied" | "failed"
  >("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const id = useId();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function copy() {
    if (copyState === "copying") return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(link);
      if (!mountedRef.current) return;
      setCopyState("copied");
      timerRef.current = setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      if (!mountedRef.current) return;
      setCopyState("failed");
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }

  return (
    <section className="link-result" aria-label="Your link">
      <div className="result-row">
        <label className="sr-only" htmlFor={id}>
          Shareable link
        </label>
        <input
          ref={inputRef}
          id={id}
          value={link}
          readOnly
          onFocus={(event) => event.target.select()}
          className="link-input"
        />
        <button
          type="button"
          className="button button-primary"
          onClick={copy}
          disabled={copyState === "copying"}
        >
          {copyState === "copied" ? "Copied" : "Copy"}
        </button>
        <a
          className="button button-secondary"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Preview (opens in a new tab)"
        >
          Preview
        </a>
      </div>
      <p
        role="status"
        className={
          copyState === "failed" ? "error-text copy-status" : "sr-only"
        }
      >
        {copyState === "failed"
          ? "Couldn’t copy. Select and copy the link above."
          : copyState === "copied"
            ? "Link copied"
            : "Your link is ready"}
      </p>
    </section>
  );
}
