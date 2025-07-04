'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy } from 'lucide-react'
import { colord } from 'colord'
import ColorPickerTabs from './tabs'

export default function ColorPickerPage() {
  const [hex, setHex] = useState('#FF5733')
  const [palette, setPalette] = useState<string[]>([])

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

  // 팔레트 생성 함수
  const generatePalette = (baseHex: string) => {
    const base = colord(baseHex)
    return [
      base.lighten(0.3).toHex(),
      base.lighten(0.15).toHex(),
      base.toHex(),
      base.darken(0.15).toHex(),
      base.darken(0.3).toHex(),
    ]
  }

  // hex가 바뀔 때마다 팔레트 생성
  useEffect(() => {
    setPalette(generatePalette(hex))
  }, [hex])

  // 복사
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    alert(`복사됨: ${text}`)
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">🎨 색상 선택기 도구</h1>
      <ColorPickerTabs />

      {/* 컬러 피커 */}
      <input
        type="color"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        className="w-full h-12 rounded mb-6 cursor-pointer"
      />

      {/* EyeDropper */}
      <Button
        className="mb-6 w-full"
        onClick={async () => {
          if (!('EyeDropper' in window)) {
            alert('이 브라우저는 EyeDropper API를 지원하지 않습니다.')
            return
          }

          try {
            const eyeDropper = new (window as any).EyeDropper()
            const result = await eyeDropper.open()
            setHex(result.sRGBHex)
          } catch (e) {
            console.log('색상 선택이 취소되었습니다.')
          }
        }}
      >
        🧲 화면에서 색상 선택
      </Button>

      {/* 미리보기 */}
      <div className="w-full h-24 rounded mb-6 border" style={{ backgroundColor: hex }} />

      {/* HEX / RGB / HSL */}
      {[hex, rgb, hsl].map((value, i) => (
        <div className="flex items-center gap-2 mb-2" key={i}>
          <Input value={value} readOnly />
          <Button variant="outline" onClick={() => copyToClipboard(value)}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {/* 팔레트 출력 */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">🎨 컬러 팔레트</h3>
        <div className="grid grid-cols-5 gap-2">
          {palette.map((color, i) => (
            <div
              key={`${color}-${i}`}
              className="h-12 rounded cursor-pointer border"
              style={{ backgroundColor: color }}
              title={color}
              onClick={() => copyToClipboard(color)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
