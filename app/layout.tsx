import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";
import { RoutePreloader } from "@/components/RoutePreloader";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://draftline.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Draftline — Contemporary Editorial Journal",
    template: "%s | Draftline",
  },
  description:
    "A contemporary editorial publication exploring travel places, fashion and culture, modern living, and mindful entrepreneurship.",
  keywords: [
    "Draftline",
    "editorial publication",
    "travel places",
    "fashion and culture",
    "modern living",
    "mindful entrepreneurship",
    "quiet luxury",
    "architecture",
    "essays",
    "contemporary culture",
  ],
  authors: [{ name: "Draftline Editorial Guild" }],
  creator: "Draftline",
  publisher: "Draftline Media",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Draftline",
    title: "Draftline — Contemporary Editorial Journal",
    description:
      "A contemporary editorial publication exploring travel places, fashion and culture, modern living, and mindful entrepreneurship.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Draftline Editorial Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Draftline — Contemporary Editorial Journal",
    description:
      "A contemporary editorial publication exploring travel places, fashion and culture, modern living, and mindful entrepreneurship.",
    creator: "@draftline",
    images: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Draftline",
        "description":
          "A contemporary editorial publication exploring travel places, fashion and culture, modern living, and mindful entrepreneurship.",
        "publisher": {
          "@id": `${siteUrl}/#organization`,
        },
        "inLanguage": "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Draftline",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/favicon.ico`,
        },
        "sameAs": ["https://twitter.com", "https://instagram.com"],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=plus-jakarta-sans@300,400,500,600,700,800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-surface-upper text-content-primary selection:bg-accent selection:text-accent-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RoutePreloader />
          <SmoothScroll />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="w-[90%] mx-auto py-12 flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>

          {/* Sticky Smooth Scroll-to-Top Button */}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
