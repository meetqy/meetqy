import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "next-themes";
export const metadata: Metadata = {
  title:
    "NameSage - AI-Powered Chinese Name Generator | Cultural Name Translation",
  description:
    "Transform your identity with a meaningful Chinese name. Our AI-powered tool creates culturally appropriate names with detailed character meanings, pronunciation guides, and personal story integration. Perfect for students, professionals, and cultural enthusiasts.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(GeistSans.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
