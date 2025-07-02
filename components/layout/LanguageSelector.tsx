'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export function LanguageSelector({ current = 'ko', onSelect }: {
  current?: string
  onSelect?: (lang: string) => void
}) {
    const LANGS = [
        { code: 'ko', label: '한국어' },
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="px-2 py-1 text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                    🌐 {LANGS.find((l) => l.code === current)?.label ?? '언어'}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                {LANGS.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => onSelect?.(lang.code)}
                        className={`text-sm ${
                        lang.code === current ? 'font-bold text-blue-500' : ''
                        }`}
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
