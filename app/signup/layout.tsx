import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join the Draftline fellowship and publish thoughtful stories.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
