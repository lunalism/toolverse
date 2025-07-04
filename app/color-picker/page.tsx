'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy } from 'lucide-react'
import ColorPickerTabs from './tabs'

interface PantoneColor {
  name: string
  hex: string
}

export default function ColorPickerPage() {
  const [hex, setHex] = useState('#367aff')
  const [palette, setPalette] = useState<string[]>([])
  const [pantoneList, setPantoneList] = useState<PantoneColor[]>([])
  const [nearestPantone, setNearestPantone] = useState<PantoneColor | null>(null)

  // 팬톤 JSON 로딩
  useEffect(() => {
    fetch('/data/pantone.json')
      .then((res) => res.json())
      .then((data) => setPantoneList(data))
  }, [])

  // HEX → RGB 거리 계산
  const rgbDistance = (a: string, b: string) => {
    const ca = parseInt(a.slice(1), 16)
    const cb = parseInt(b.slice(1), 16)
    const ar = (ca >> 16) & 255
    const ag = (ca >> 8) & 255
    const ab = ca & 255
    const br = (cb >> 16) & 255
    const bg = (cb >> 8) & 255
    const bb = cb & 255
    return Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2)
  }

  const findNearestPantone = (targetHex: string) => {
    let nearest = pantoneList[0]
    let minDist = rgbDistance(targetHex, nearest.hex)

    for (const p of pantoneList.slice(1)) {
      const dist = rgbDistance(targetHex, p.hex)
      if (dist < minDist) {
        minDist = dist
        nearest = p
      }
    }

    return nearest
  }

  useEffect(() => {
    if (pantoneList.length > 0) {
      const nearest = findNearestPantone(hex)
      setNearestPantone(nearest)
    }
  }, [hex, pantoneList])

  // HEX → RGB → HSL 변환
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '')
    const bigint = parseInt(cleanHex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  }

  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(
    parseInt(rgb.match(/\d+/g)?.[0] || '0'),
    parseInt(rgb.match(/\d+/g)?.[1] || '0'),
    parseInt(rgb.match(/\d+/g)?.[2] || '0')
  )

  // 팔레트 생성 (밝기 변화)
  const generatePalette = (baseHex: string) => {
    const base = parseInt(baseHex.slice(1), 16)
    const r = (base >> 16) & 255
    const g = (base >> 8) & 255
    const b = base & 255
    const toHex = (r: number, g: number, b: number) =>
      `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`

    return [
      toHex(r + 50, g + 50, b + 50),
      toHex(r + 25, g + 25, b + 25),
      toHex(r, g, b),
      toHex(r - 25, g - 25, b - 25),
      toHex(r - 50, g - 50, b - 50),
    ]
  }

  useEffect(() => {
    setPalette(generatePalette(hex))
  }, [hex])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    alert(`복사됨: ${text}`)
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">🎨 색상 선택기 도구</h1>
      <ColorPickerTabs />

      {/* 기본 컬러 인풋 */}
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

      {/* 팬톤 근접 색상 (오버레이 박스) */}
      {nearestPantone && (
        <div
          className="relative w-full h-24 rounded border overflow-hidden mb-4"
          style={{ backgroundColor: nearestPantone.hex }}
        >
          <div className="absolute top-1 left-1 bg-black/50 text-white text-xs p-2 rounded">
            <div className="font-semibold">{nearestPantone.name}</div>
            <div>{nearestPantone.hex.toUpperCase()}</div>
            <div>{hexToRgb(nearestPantone.hex)}</div>
          </div>
        </div>
      )}

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
