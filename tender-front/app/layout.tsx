import { Inter } from "next/font/google"
import "./globals.css"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
