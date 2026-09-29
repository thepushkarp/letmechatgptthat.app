import Link from "next/link";

export function Footer({ playback = false }: { playback?: boolean }) {
  return (
    <footer className="site-footer">
      <nav aria-label="Footer">
        {playback && <Link href="/">Create your own link</Link>}
        <Link href="/faq">FAQ</Link>
        <span>
          Made by{" "}
          <a
            href="https://www.thepushkarp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pushkar
          </a>
        </span>
      </nav>
      <p>Not affiliated with OpenAI.</p>
    </footer>
  );
}
