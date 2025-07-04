'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import ColorPickerTabs from '../tabs'

export default function ColorFromImage() {
    const [hex, setHex] = useState('#ffffff')
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setImageUrl(url)
    }

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

    const drawImageToCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const img = imageRef.current
        if (!canvas || !ctx || !img) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)
    }

    return (
        <div className="max-w-md mx-auto py-10 px-4">
            <h1 className="text-xl font-bold mb-4">🖼️ 사진에서 색상 선택</h1>
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
        </div>
    )
}
