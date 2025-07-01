// components/layout/Header.tsx

'use client'

import Image from 'next/image'
import { MoonIcon } from 'lucide-react'

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm text-gray-800">
            <div className="max-w-screen-xl mx-auto px-6 py-5 flex items-center justify-between">
                {/* 로고 */}
                <div className="flex items-center space-x-2">
                    <Image src="/logo.png" alt="Toolverse Logo" width={120} height={36} />
                </div>

                {/* 중앙 메뉴 */}
                <nav className="hidden md:flex space-x-6 text-sm font-medium">
                    {[
                        { label: '이미지 도구' },
                        { label: 'PDF 도구' },
                        { label: '색상 도구' },
                        { label: '보안 도구' },
                        { label: '네트워크 도구' },
                        {
                            label: '날짜/시간 도구',
                            badge: 'NEW',
                        },
                        { label: '텍스트 도구' },
                    ].map(({ label, badge }) => (
                        <div key={label} className="relative group cursor-pointer">
                            <span className="hover:text-black transition">{label}</span>
                            {badge && (
                                <span className="absolute -top-2 -right-5 text-[10px] font-bold text-red-500">
                                    {badge}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>

                {/* 오른쪽 기능 */}
                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <MoonIcon className="w-5 h-5 cursor-pointer" />
                    <select className="bg-transparent outline-none">
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                    </select>
                </div>
            </div>
        </header>
    )
}
