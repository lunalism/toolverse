'use client'

import { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { colord } from 'colord'
import ColorPickerTabs from '../tabs'

export default function ColorFromImage() {
    const [hex, setHex] = useState('#FF5733')
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [palette, setPalette] = useState<string[]>([])
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    // 이미지 업로드 핸들러
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setImageUrl(url)
    }

    // 이미지 클릭 → 색상 추출
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const pixel = ctx.getImageData(x, y, 1, 1).data
        const [r, g, b] = pixel
        const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
        setHex(hex)
    }

    // 이미지 로딩 → 캔버스에 그리기
    const drawImageToCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const img = imageRef.current
        if (!canvas || !ctx || !img) return
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)
    }

    // HEX → RGB
    const hexToRgb = (hex: string) => {
        const cleanHex = hex.replace('#', '')
        const bigint = parseInt(cleanHex, 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        return `rgb(${r}, ${g}, ${b})`
    }

    // RGB → HSL
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

    // 팔레트 생성
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

    // hex 변경될 때마다 팔레트 자동 생성
    useEffect(() => {
        setPalette(generatePalette(hex))
    }, [hex])

    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(
        parseInt(rgb.match(/\d+/g)?.[0] || '0'),
        parseInt(rgb.match(/\d+/g)?.[1] || '0'),
        parseInt(rgb.match(/\d+/g)?.[2] || '0')
    )

    return (
        <div className="max-w-md mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">🖼️ 사진에서 색상 선택</h1>
            <ColorPickerTabs />

            <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

            {imageUrl && (
                <>
                    {/* 숨겨진 이미지 */}
                    <img ref={imageRef} src={imageUrl} alt="Uploaded" onLoad={drawImageToCanvas} className="hidden" />

                    {/* 클릭 가능한 캔버스 */}
                    <canvas ref={canvasRef} onClick={handleCanvasClick} className="border mb-4 cursor-crosshair w-full" />
                </>
            )}

            {/* 선택된 색상 미리보기 */}
            <div className="w-full h-20 rounded mb-4 border" style={{ backgroundColor: hex }} />

            {/* HEX 코드 및 복사 */}
            <div className="flex items-center gap-2">
                <Input value={hex} readOnly />
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(hex)}>
                <Copy className="w-4 h-4" />
                </Button>
            </div>

            {/* 자동 생성된 팔레트 */}
            <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">🎨 컬러 팔레트</h3>
                <div className="grid grid-cols-5 gap-2">
                    {palette.map((color, i) => (
                        <div
                            key={`${color}-${i}`} // 고유한 key 보장
                            className="h-12 rounded cursor-pointer border"
                            style={{ backgroundColor: color }}
                            title={color}
                            onClick={() => {
                            navigator.clipboard.writeText(color)
                            alert(`복사됨: ${color}`)
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
