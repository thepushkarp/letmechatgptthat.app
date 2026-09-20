import Link from "next/link";

export function Footer({ playback = false }: { playback?: boolean }) {
  return (
    <footer className="site-footer">
      <nav aria-label="Footer">
        {playback && <Link href="/">Create your own link</Link>}
        <Link href="/faq">FAQ</Link>
        <a
          href="https://thepushkarp.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          by thepushkarp
        </a>
      </nav>
      <p>Not affiliated with OpenAI.</p>
    </footer>
  );
}
