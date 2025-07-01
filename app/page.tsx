'use client'

import Link from 'next/link'
import {
  ImageIcon,
  FileText,
  TextIcon,
  Lock,
  Globe,
  Calendar,
  FileCode,
  PaintBucket,
} from 'lucide-react'

const TOOLS = [
  {
    label: '이미지 포맷 변환기',
    href: '/image-converter',
    icon: <ImageIcon color="#3B82F6" className="w-6 h-6" />,
  },
  {
    label: '이미지 → PDF',
    href: '/image-to-pdf',
    icon: <FileText color="#3B82F6" className="w-6 h-6" />,
  },
  {
    label: 'PDF 병합',
    href: '/pdf-merge',
    icon: <FileText color="#6366F1" className="w-6 h-6" />,
  },
  {
    label: 'PDF 분할',
    href: '/pdf-split',
    icon: <FileText color="#6366F1" className="w-6 h-6" />,
  },
  {
    label: '색상 선택기',
    href: '/color-picker',
    icon: <PaintBucket color="#F59E0B" className="w-6 h-6" />,
  },
  {
    label: '비밀번호 생성기',
    href: '/password-generator',
    icon: <Lock color="#10B981" className="w-6 h-6" />,
  },
  {
    label: 'IP 확인',
    href: '/ip-check',
    icon: <Globe color="#06B6D4" className="w-6 h-6" />,
  },
  {
    label: '나이 계산기',
    href: '/age-calculator',
    icon: <Calendar color="#8B5CF6" className="w-6 h-6" />,
  },
  {
    label: '날짜 차이 계산기',
    href: '/date-diff',
    icon: <Calendar color="#8B5CF6" className="w-6 h-6" />,
  },
  {
    label: '텍스트 비교',
    href: '/text-compare',
    icon: <TextIcon color="#F87171" className="w-6 h-6" />,
  },
  {
    label: '글자수 세기',
    href: '/char-counter',
    icon: <TextIcon color="#F87171" className="w-6 h-6" />,
  },
]

export default function HomePage() {
  return (
    <div className="w-full text-center px-4">
      {/* Hero */}
      <section className="py-20">
        <h1 className="text-4xl font-bold mb-4">🛠 Toolverse</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          다양한 유틸리티 도구를 하나의 웹사이트에서 빠르게, 간편하게!
        </p>
        <Link
          href="/image-converter"
          className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          지금 시작하기 →
        </Link>
      </section>

      {/* 전체 도구 */}
      <section className="py-12 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {TOOLS.map(({ label, href, icon }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center justify-center space-y-2 p-5 border rounded-lg shadow-sm hover:-translate-y-1 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
          >
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </section>

      {/* 소개 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
        <div className="max-w-3xl mx-auto leading-relaxed px-4">
          모든 기능은 브라우저에서 처리되어 개인정보가 서버에 저장되지 않으며,
          빠르고 무료로 이용할 수 있습니다. 필요한 기능을 즐겨찾기로 저장해보세요!
        </div>
      </section>
    </div>
  )
}
