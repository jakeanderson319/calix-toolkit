import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calix Toolkit',
  description: 'ONT reference and troubleshooting for ISP support',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-grid">
        {children}
      </body>
    </html>
  )
}
