'use client'
import Image from 'next/image'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trash2 } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

// PDF.js에 Web Worker 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// 업로드된 PDF 상태 타입
type UploadedPDF = {
    file: File
    url: string
    pages: string[] // base64 이미지들
    progress: number // 0~100
}

export default function PDFMergePage() {
    const [pdfList, setPdfList] = useState<UploadedPDF[]>([])

    // PDF 렌더링 함수
    const renderPdfPages = async (file: File, onProgress: (p: number) => void) => {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const pages: string[] = []

        for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 0.5 }) // 썸네일 크기 조정
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: context, viewport }).promise
        pages.push(canvas.toDataURL())

        onProgress(Math.round((i / pdf.numPages) * 100))
        }

        return pages
    }

    // DropZone 설정
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
        const url = URL.createObjectURL(file)
        const newPDF: UploadedPDF = {
            file,
            url,
            pages: [],
            progress: 0,
        }

        setPdfList(prev => [...prev, newPDF])

        renderPdfPages(file, progress => {
            setPdfList(prev =>
            prev.map(p =>
                p.file === file ? { ...p, progress } : p
            )
            )
        }).then(pages => {
            setPdfList(prev =>
            prev.map(p =>
                p.file === file ? { ...p, pages, progress: 100 } : p
            )
            )
        })
        })
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': [] },
        multiple: true,
    })

    const removePDF = (index: number) => {
        setPdfList(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">📎 PDF 병합 도구</h1>

            {/* 업로드 영역 */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-600">
                {isDragActive ? '여기에 PDF 파일을 놓으세요' : 'PDF 파일을 드래그하거나 클릭하여 업로드하세요'}
                </p>
            </div>

            {/* 썸네일 영역 */}
            {pdfList.length > 0 && (
                <div className="mt-6 relative">
                    {/* 병합 버튼: 우측 상단 */}
                    <div className="absolute right-0 top-0 z-10">
                        <Button disabled>병합하기 (다음 단계 예정)</Button>
                    </div>

                    {/* 썸네일 카드 그리드 */}
                    <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                            {pdfList.map((pdf, index) => (
                                <div
                                    key={index}
                                    className="relative border rounded-lg bg-gray-50 p-4 shadow-sm flex flex-col items-center"
                                >
                                    {/* 파일명 + 삭제 버튼 */}
                                    <div className="flex justify-between items-center w-full mb-2">
                                        <span className="text-sm font-medium truncate">{pdf.file.name}</span>
                                        <Button variant="ghost" size="icon" onClick={() => removePDF(index)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>

                                    {/* 진행률 표시 or 썸네일 */}
                                    {pdf.progress < 100 ? (
                                        <Progress value={pdf.progress} className="h-2 w-full mt-2" />
                                    ) : (
                                        <Image src={pdf.pages[0]} alt={`Preview of ${pdf.file.name}`} width={260} height={370} className="object-cover border rounded-lg shadow" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
