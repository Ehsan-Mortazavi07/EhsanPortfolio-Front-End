import type { Metadata, Viewport } from "next";
import "@/assets/css/globals.css";
import { ClientProvider } from "@/components/providers/ClientProvider";
import { SITE_URL } from "@/common/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ehsan Mortazavi | Full-Stack Developer",
    template: "%s | Ehsan Mortazavi",
  },
  description:
    "Portfolio of Ehsan Mortazavi — full-stack developer specializing in scalable architecture, clean code, and performance.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ehsan Mortazavi",
    title: "Ehsan Mortazavi | Full-Stack Developer",
    description: "International developer portfolio — projects, blog, and contact.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8f0ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1b4332" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeBootstrapScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';var l=localStorage.getItem('locale')||'en';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.setAttribute('data-theme',d?'dark':'light');r.style.colorScheme=d?'dark':'light';r.lang=l==='fa'?'fa':'en';r.dir=l==='fa'?'rtl':'ltr';}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className="bg-background overflow-x-clip">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Vazirmatn:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
