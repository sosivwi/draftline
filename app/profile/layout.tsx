import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributor Profile & Settings",
  description:
    "Manage your contributor profile, personal bio, and online links on Draftline.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
