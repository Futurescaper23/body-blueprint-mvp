import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Body Blueprint",
    template: "%s | Body Blueprint",
  },
  description:
    "A mobile-first workout plan app for trainer-created exercise guidance.",
  applicationName: "Body Blueprint",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Body Blueprint",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0b0f14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#0b0f14] antialiased">
      <body className="min-h-full bg-[#0b0f14] text-slate-100">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
