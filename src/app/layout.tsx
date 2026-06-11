import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import { appUrl } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Body Blueprint",
    template: "%s | Body Blueprint",
  },
  description:
    "Simple workout plans, exercise demos, and nutrition tracking you can open on your phone and use straight away.",
  applicationName: "Body Blueprint",
  openGraph: {
    title: "Body Blueprint",
    description:
      "Simple workout plans, exercise demos, and nutrition tracking you can open on your phone and use straight away.",
    url: appUrl,
    siteName: "Body Blueprint",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Body Blueprint workout app preview",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Body Blueprint",
    description:
      "Simple workout plans, exercise demos, and nutrition tracking you can open on your phone and use straight away.",
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Body Blueprint",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
    shortcut: "/icons/icon.svg",
  },
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
