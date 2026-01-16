import React from "react";
import Link from "next/link";

export const Header = React.memo(function Header() {
  return (
    <header
      className="w-full px-6 py-4 flex items-center justify-between"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <Link href="/" className="transition-opacity hover:opacity-80">
        <span
          className="font-semibold tracking-tight"
          style={{ color: "var(--text-primary)", fontSize: "18px" }}
        >
          LetMeChatGPTThat
        </span>
      </Link>

      {/* Creator attribution */}
      <a
        href="https://x.com/thepushkarp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-link-muted text-xs"
      >
        by thepushkarp
      </a>
    </header>
  );
});
