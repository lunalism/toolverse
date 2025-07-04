'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy } from 'lucide-react'

export default function ColorPickerPage() {
  const [hex, setHex] = useState('#FF5733')

  // HEX → RGB 변환
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '')
    const bigint = parseInt(cleanHex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
  }

  // RGB → HSL 변환
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`
  }

  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(
    parseInt(rgb.match(/\d+/g)?.[0] || '0'),
    parseInt(rgb.match(/\d+/g)?.[1] || '0'),
    parseInt(rgb.match(/\d+/g)?.[2] || '0')
  )

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    alert(`Copied: ${text}`)
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🎨 색상 선택기 도구</h1>

      {/* 컬러 피커 */}
      <input
        type="color"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        className="w-full h-12 rounded mb-6 cursor-pointer"
      />

      {/* 색상 미리보기 */}
      <div
        className="w-full h-24 rounded mb-6 border"
        style={{ backgroundColor: hex }}
      />

      {/* HEX */}
      <div className="flex items-center gap-2 mb-4">
        <Input value={hex} readOnly />
        <Button
          variant="outline"
          onClick={() => copyToClipboard(hex)}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      {/* RGB */}
      <div className="flex items-center gap-2 mb-4">
        <Input value={rgb} readOnly />
        <Button
          variant="outline"
          onClick={() => copyToClipboard(rgb)}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      {/* HSL */}
      <div className="flex items-center gap-2">
        <Input value={hsl} readOnly />
        <Button
          variant="outline"
          onClick={() => copyToClipboard(hsl)}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
