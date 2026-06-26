import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeLight Nexus AI",
  description: "RegulaBot · ContractSense · GrantRadar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
