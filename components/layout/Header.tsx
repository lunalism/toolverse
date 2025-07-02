'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { MoonIcon, SunIcon, ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { LanguageSelector } from '@/components/layout/LanguageSelector'

const MENU = [
    {
        label: '이미지 도구',
        items: [
            { label: '이미지 포맷 변환기', href: '/image-converter' },
            { label: '이미지 → PDF', href: '/image-to-pdf' },
        ],
    },
    {
        label: 'PDF 도구',
        items: [
            { label: 'PDF 병합', href: '/pdf-merge' },
            { label: 'PDF 분할', href: '/pdf-split' },
        ],
    },
    {
        label: '색상 도구',
        items: [{ label: '색상 선택기', href: '/color-picker' }],
    },
    {
        label: '보안 도구',
        items: [{ label: '비밀번호 생성기', href: '/password-generator' }],
    },
    {
        label: '네트워크 도구',
        items: [{ label: 'IP 확인', href: '/ip-check' }],
    },
    {
        label: '날짜/시간 도구',
        badge: 'NEW',
        items: [
            { label: '나이 계산기', href: '/age-calculator' },
            { label: '날짜 차이 계산기', href: '/date-diff' },
        ],
    },
    {
        label: '텍스트 도구',
        items: [
            { label: '텍스트 비교', href: '/text-compare' },
            { label: '글자수 세기', href: '/char-counter' },
        ],
    },
]

export default function Header() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const handleMouseEnter = (label: string) => {
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
        }
        setActiveMenu(label)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
        setActiveMenu(null)
        }, 200)
    }

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white">
            <div className="max-w-screen-xl mx-auto px-6 py-5 flex items-center justify-between">
                {/* 로고 */}
                <div className="flex items-center">
                    <Image src="/logo.png" alt="Toolverse Logo" width={120} height={36} />
                </div>

                {/* 중앙 메뉴 */}
                <nav className="hidden md:flex space-x-6 text-sm font-medium">
                    {MENU.map(({ label, items, badge }) => {
                        const isOpen = activeMenu === label
                        return (
                        <div key={label} className="relative">
                            {/* 대분류 메뉴 */}
                            <div
                            className="flex items-center space-x-1 hover:text-black dark:hover:text-gray-200 transition cursor-pointer py-2"
                            onMouseEnter={() => handleMouseEnter(label)}
                            onMouseLeave={handleMouseLeave}
                            >
                                <span>{label}</span>
                                {badge && (
                                    <span className="text-[10px] font-bold text-red-500 ml-1">{badge}</span>
                                )}
                                {isOpen ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </div>

                            {/* 드롭다운 메뉴 */}
                            {isOpen && (
                                <div className="absolute top-full left-0 pt-2">
                                    {/* 삼각형 화살표 */}
                                    <div className="absolute top-2 left-4 w-3 h-3 bg-white dark:bg-gray-900 rotate-45 border-l border-t border-gray-200 dark:border-gray-700 z-20"></div>

                                    {/* 드롭다운 콘텐츠 */}
                                    <div
                                    className={`bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-md min-w-[180px] z-10 overflow-hidden mt-2
                                                transition-all duration-200 ease-out
                                                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                                    onMouseEnter={() => handleMouseEnter(label)}
                                    onMouseLeave={handleMouseLeave}
                                    >
                                        {items.map(({ label: itemLabel, href }) => (
                                            <Link
                                            key={itemLabel}
                                            href={href}
                                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm whitespace-nowrap transition-colors"
                                            onClick={() => setActiveMenu(null)}
                                            >
                                                {itemLabel}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        )
                    })}
                </nav>

                {/* 오른쪽 기능 */}
                <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm">
                    {theme === 'dark' ? (
                        <SunIcon
                        className="w-5 h-5 cursor-pointer hover:text-yellow-400 transition"
                        onClick={toggleTheme}
                        />
                    ) : (
                        <MoonIcon
                        className="w-5 h-5 cursor-pointer hover:text-gray-700 transition"
                        onClick={toggleTheme}
                        />
                    )}
                    <LanguageSelector
                        current="ko"
                        onSelect={(lang) => {
                            // TODO: 언어 변경 처리
                            console.log('언어 변경됨:', lang)
                        }}
                    />
                </div>
            </div>
        </header>
    )
}
