// components/layout/MainMenu.tsx
'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import {
  ChevronDown,
  ChevronRight,
  ImageIcon,
  FileImage,
  FilePlus2,
  FileMinus2,
  Palette,
  Shield,
  Globe,
  CalendarClock,
  CalendarRange,
  FileDiff,
  Type,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const MENU = [
  {
    label: '이미지 도구',
    items: [
      { label: '이미지 포맷 변환기', href: '/image-converter', icon: ImageIcon },
      { label: '이미지 → PDF', href: '/image-to-pdf', icon: FileImage },
    ],
  },
  {
    label: 'PDF 도구',
    items: [
      { label: 'PDF 병합', href: '/pdf-merge', icon: FilePlus2 },
      { label: 'PDF 분할', href: '/pdf-split', icon: FileMinus2 },
    ],
  },
  {
    label: '색상 도구',
    items: [
      { label: '색상 선택기', href: '/color-picker', icon: Palette },
    ],
  },
  {
    label: '보안 도구',
    items: [
      { label: '비밀번호 생성기', href: '/password-generator', icon: Shield },
    ],
  },
  {
    label: '네트워크 도구',
    items: [
      { label: 'IP 확인', href: '/ip-check', icon: Globe },
    ],
  },
  {
    label: '날짜/시간 도구',
    badge: 'NEW',
    items: [
      { label: '나이 계산기', href: '/age-calculator', icon: CalendarClock },
      { label: '날짜 차이 계산기', href: '/date-diff', icon: CalendarRange },
    ],
  },
  {
    label: '텍스트 도구',
    items: [
      { label: '텍스트 비교', href: '/text-compare', icon: FileDiff },
      { label: '글자수 세기', href: '/char-counter', icon: Type },
    ],
  },
]

export function MainMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenMenu(label)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null)
    }, 200)
  }

  return (
    <nav className="hidden md:flex space-x-6 text-sm font-medium">
      {MENU.map(({ label, items, badge }) => {
        const isOpen = openMenu === label

        return (
          <div
            key={label}
            className="relative"
            onMouseEnter={() => handleMouseEnter(label)}
            onMouseLeave={handleMouseLeave}
          >
            <DropdownMenu open={isOpen} onOpenChange={() => {}}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 px-2 py-1 hover:text-black dark:hover:text-gray-200"
                >
                  {label}
                  {badge && (
                    <span className="text-[10px] font-bold text-red-500 ml-1">
                      {badge}
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                {items.map(({ label: itemLabel, href, icon: Icon }) => (
                  <DropdownMenuItem key={itemLabel} asChild>
                    <Link
                      href={href}
                      className="flex items-center gap-2 w-full text-sm text-gray-700 dark:text-gray-200"
                    >
                      <Icon className="w-4 h-4" />
                      {itemLabel}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      })}
    </nav>
  )
}
