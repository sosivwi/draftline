import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write a Story",
  description:
    "Compose and publish editorial essays on travel, fashion, architecture, and mindful entrepreneurship.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
