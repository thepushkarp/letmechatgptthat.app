import React from "react";
import Link from "next/link";

export const Header = React.memo(function Header() {
  return (
    <header
      className="w-full px-6 py-4 flex items-center justify-between"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <Link
        href="/"
        className="transition-colors font-semibold tracking-tight hover:text-[var(--text-secondary)]"
        style={{ color: "var(--text-primary)", fontSize: "18px" }}
      >
        LetMeChatGPTThat
      </Link>

      {/* Creator attribution */}
      <a
        href="https://thepushkarp.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-link-muted text-xs"
      >
        by thepushkarp
      </a>
    </header>
  );
});
