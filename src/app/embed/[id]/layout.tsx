// app/embed/[id]/iframe/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import "@/app/globals.css";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booking",
  description: "Booking Widget",
};

interface EmbedLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function EmbedLayout({
  children,
  params,
}: EmbedLayoutProps) {

  const { id } = await params;

  // set up supabase
  const supabase = await createClient();

  // fetch the embed
  const { data: embed, error } = await supabase
    .from("embeds")
    .select("id")
    .eq("id", id)
    .single();

  if (error || !embed) {
    console.error("Embed not found or error fetching:", error);
    redirect("/embed/not-found");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      {children}
    </main>
  );
}
