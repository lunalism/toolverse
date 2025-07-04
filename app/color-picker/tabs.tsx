'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const tabs = [
    { label: '기본 색상 선택', href: '/color-picker' },
    { label: '이미지에서 색상 선택', href: '/color-picker/image-picker' },
]

export default function ColorPickerTabs() {
    const pathname = usePathname()

    return (
        <div className="flex mb-6 gap-2 border-b">
            {tabs.map((tab) => (
                <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                    'px-4 py-2 font-medium border-b-2',
                    pathname === tab.href
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                )}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    )
}
