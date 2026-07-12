import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "@/components/layout/ClientShell";

export const metadata: Metadata = {
  title: {
    default: "JavaForge — Learn Java. Build Real Software. Become Job-Ready.",
    template: "%s | JavaForge",
  },
  description:
    "JavaForge is an interactive Java learning platform that teaches you from absolute beginner to professional through structured courses, real-world examples, coding exercises, and guided projects.",
  keywords: ["Java", "learn Java", "Java programming", "Spring Boot", "Java tutorial", "coding platform", "JavaForge"],
  openGraph: {
    type: "website",
    title: "JavaForge — Interactive Java Learning Platform",
    description: "Learn Java through interactive lessons, real-world projects, and guided practice.",
    siteName: "JavaForge",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
