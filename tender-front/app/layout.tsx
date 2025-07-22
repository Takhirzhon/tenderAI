// app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"
import type { ReactNode } from "react"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter"
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans`}>
        {/* 
          suppressHydrationWarning tells React:
          “I know this subtree may differ server↔client—ignore it.”
        */}
        <div suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  )
}
