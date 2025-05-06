import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RouteAwareNavigation from '@/components/RouteAwareNavigation';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booking",
  description: "Booking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <RouteAwareNavigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
