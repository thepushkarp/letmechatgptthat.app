"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="page-shell">
      <Header />
      <main id="main" className="landing-main">
        <div className="not-found-content">
          <h1>Link not found</h1>
          <p>This link has expired or doesn’t exist. Links last 30 days.</p>
          <Link href="/" className="button button-primary">
            Create a new link
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
