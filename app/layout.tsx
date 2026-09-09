import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Elsewhere — Explore the life you didn’t choose", description: "Step into a fictional alternate life. Follow five years of memories, unexpected connections, and roads not taken.", icons: { icon: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
