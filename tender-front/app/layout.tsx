// app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"
import type { ReactNode } from "react"

// Load Inter font with Latin and Cyrillic support
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter"
})

export const metadata = {
  title: "AI Tender Optimizer",
  description: "Smart procurement assistant powered by AI"
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="font-sans">
        {/* 
          Use suppressHydrationWarning ONLY where needed 
          (e.g. dynamic or client-only values rendered inside)
        */}
        {children}
      </body>
    </html>
  )
}
