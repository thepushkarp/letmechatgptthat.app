import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQueryByCode } from "@/lib/redis";
import { AnimationView } from "@/components/AnimationView";

interface PageProps {
  params: Promise<{ code: string }>;
}

// Generic metadata that doesn't reveal the question - this is the key to keeping links "unsuspecting"
// Note: OG and Twitter images are auto-generated via opengraph-image.tsx and twitter-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Someone sent you a link",
    description: "Click to see what they want to show you",
    openGraph: {
      title: "Someone sent you a link",
      description: "Click to see what they want to show you",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Someone sent you a link",
      description: "Click to see what they want to show you",
    },
  };
}

export default async function ShortUrlPage({ params }: PageProps) {
  const { code } = await params;

  // Look up the query from Redis
  const query = await getQueryByCode(code);

  if (!query) {
    notFound();
  }

  return <AnimationView query={query} />;
}
