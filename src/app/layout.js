import { Libre_Baskerville, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: 'swap',
});

export const metadata = {
  title: "Reskill Occupation",
  description: "See how AI transforms your career skills",
};

// Conditionally wrap with Clerk only if real keys are configured
async function MaybeClerkProvider({ children }) {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (key && !key.includes('REPLACE_ME')) {
    const { ClerkProvider } = await import("@clerk/nextjs")
    return <ClerkProvider>{children}</ClerkProvider>
  }
  return <>{children}</>
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${libreBaskerville.variable} ${dmSans.variable} antialiased`}>
        <MaybeClerkProvider>
          {children}
        </MaybeClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
