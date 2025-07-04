import './globals.css'
import { Providers } from './providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toolverse',
  description: '유틸리티 도구의 모든 우주',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className="min-h-screen">
      <body className="flex flex-col min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        <Providers>
          <Header />
          <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 pt-28 pb-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>

  )
}
