import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const satoshiBold = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Will Guo — Economics & Computer Science @ UChicago",
  description:
    "Personal portfolio of Will Guo — Economics & Computer Science at UChicago. AI Risk Fellow at XLab, researcher at the Chicago Human+AI Lab, and builder.",
  openGraph: {
    title: "Will Guo — Economics & Computer Science @ UChicago",
    description:
      "Personal portfolio of Will Guo — Economics & Computer Science at UChicago. AI Risk Fellow at XLab, researcher at the Chicago Human+AI Lab, and builder.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon-wg-v4.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-wg-v4.png?v=4", type: "image/png", sizes: "192x192" },
    ],
    shortcut: ["/favicon-wg-v4.png?v=4"],
    apple: [{ url: "/favicon-wg-v4.png?v=4", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          satoshi.variable,
          satoshiBold.variable,
        )}
      >
        <Providers>
          <Header />
          <div className="mx-auto flex max-w-3xl flex-col px-8">
            <main className="grow">{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
