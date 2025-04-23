import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import RouteAwareNavigation from '@/components/RouteAwareNavigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slot Fox - Smart Scheduling for Your Business",
  description: "Slot Fox helps you manage appointments, reduce no-shows, and provide a seamless booking experience for your clients.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RouteAwareNavigation />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
