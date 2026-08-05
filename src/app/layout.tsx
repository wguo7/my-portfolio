import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Variable.woff2",
      weight: "300 900",
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

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://www.williamguo.xyz";
const DESCRIPTION =
  "Math & CS at UChicago. AI Risk Fellow at XLab and builder of Caisson AI. First-author of the IEEE ICDM Best Paper on LLM watermark detection.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Will Guo | Math & CS @ UChicago",
    template: "%s | Will Guo",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Will Guo | Math & CS @ UChicago",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Will Guo",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Will Guo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Will Guo | Math & CS @ UChicago",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "William Guo",
  alternateName: "Will Guo",
  url: SITE_URL,
  email: "mailto:wguo4@uchicago.edu",
  jobTitle: "Student researcher",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Chicago",
  },
  sameAs: [
    "https://github.com/wguo7",
    "https://www.linkedin.com/in/william-guo-4ab71a263/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "grain min-h-screen bg-background font-sans antialiased",
          satoshi.variable,
          satoshiBold.variable,
          mono.variable,
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <Header />
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col px-8">
            <main id="content" className="grow">
              {children}
            </main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
