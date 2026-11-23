import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Compass, Gem, Coffee, TrendingUp } from "lucide-react";
import { RevealText } from "@/components/RevealText";

export const metadata: Metadata = {
  title: "About Our Story & Mission",
  description:
    "Learn about Draftline, our editorial mission, and our dispatches across travel places, fashion and culture, modern living, and mindful entrepreneurship.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Our Story & Mission | Draftline",
    description:
      "Learn about Draftline, our editorial mission, and our dispatches across travel places, fashion and culture, modern living, and mindful entrepreneurship.",
    url: "/about",
    siteName: "Draftline",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Our Story & Mission | Draftline",
    description:
      "Learn about Draftline, our editorial mission, and our dispatches across travel places, fashion and culture, modern living, and mindful entrepreneurship.",
  },
};

export default function AboutPage() {
  const principles = [
    {
      icon: Compass,
      title: "Travel Places",
      description:
        "Documenting the quiet luxury of global destinations, intimate sanctuaries, and slow voyages far removed from mass tourism.",
    },
    {
      icon: Gem,
      title: "Fashion & Culture",
      description:
        "Exploring heirloom textiles, bespoke tailoring, mechanical horology, and the cultural movements shaping enduring aesthetics.",
    },
    {
      icon: Coffee,
      title: "Lifestyle & Modern Living",
      description:
        "Celebrating architectural stillness, meditative morning rituals, tactile interior design, and digital mindfulness.",
    },
    {
      icon: TrendingUp,
      title: "Business & Entrepreneurship",
      description:
        "Investigating calm companies, modern wealth architecture, bootstrapped cash flows, and high-leverage solopreneur models.",
    },
  ];

  return (
    <div className="w-full text-content-primary">
      <div className="w-full max-w-[1440px] mx-auto pb-16">
        <div className="flex flex-col items-start gap-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-content-secondary hover:text-content-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to articles</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-mono text-[11px] uppercase tracking-wider leading-none border border-neutral-200 dark:border-neutral-800">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-accent" />
            <span>Our Story & Mission</span>
          </div>
        </div>

        <RevealText delay={0}>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-content-primary mb-6 leading-[1.08]">
            About Draftline
          </h1>
        </RevealText>

        <RevealText delay={80}>
          <p className="font-sans text-base sm:text-lg text-content-secondary leading-relaxed mb-10 max-w-4xl">
            Draftline is an independent digital journal founded to curate stories
            at the intersection of travel, fashion, architectural living, and
            entrepreneurial freedom.
          </p>
        </RevealText>

        {/* Editorial Manifesto Card */}
        <RevealText delay={120}>
          <div className="rounded-none border border-neutral-200 dark:border-neutral-800 bg-surface-card p-6 sm:p-10 mb-10 shadow-sm">
            <h2 className="font-sans font-bold text-2xl tracking-tight text-content-primary mb-4">
              The Editorial Manifesto
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-content-secondary">
              <p>
                In an age of breathless notifications and algorithmic micro-trends,
                Draftline is built as an antidote: an elegant, deliberate publication
                focused on timeless discernment and authentic substance.
              </p>
              <p>
                We profile the artisans, travelers, architects, and founders who
                choose depth over superficial speed. Our writing honors fine
                prose, tactile design, and the quiet pleasure of ideas that endure.
              </p>
            </div>
          </div>
        </RevealText>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <RevealText key={idx} delay={140 + idx * 60}>
                <div className="rounded-none border border-neutral-200 dark:border-neutral-800 bg-surface-card p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-4 text-neutral-900 dark:text-neutral-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-bold text-lg text-content-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-content-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </RevealText>
            );
          })}
        </div>

        {/* Phase Milestone Card */}
        <RevealText delay={380}>
          <div className="rounded-none border border-neutral-200 dark:border-neutral-800 bg-surface-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
                Curated Editorial Series
              </div>
              <h3 className="font-sans font-bold text-lg text-content-primary">
                12 Dispatches Available
              </h3>
              <p className="font-sans text-xs sm:text-sm text-content-secondary">
                Explore our latest essays across Travel, Fashion, Modern Living, and Business.
              </p>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-none text-xs sm:text-sm font-semibold shrink-0 shadow-sm bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
            >
              Explore Articles
            </Link>
          </div>
        </RevealText>
      </div>
    </div>
  );
}
