import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Toolverse - 유틸리티 툴의 모든 우주',
  description: '이미지, PDF, 텍스트 도구 등 다양한 기능을 하나의 웹사이트에서 제공합니다.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-black min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
