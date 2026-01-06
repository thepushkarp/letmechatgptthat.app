"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="text-center space-y-6 max-w-md">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full"
          style={{
            background: "var(--surface-primary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <span style={{ fontSize: "32px" }}>🔗</span>
        </div>

        <div className="space-y-3">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Link Not Found
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            This link may have expired or never existed. Links expire after 30
            days.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200"
          style={{
            background: "var(--accent)",
            color: "white",
            borderRadius: "var(--radius-full)",
          }}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create a new link
        </Link>
      </div>
    </main>
  );
}
