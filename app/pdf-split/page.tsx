'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FilePlus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.entry'

export default function PdfSplitPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isSplitting, setIsSplitting] = useState(false)
  const [splitFiles, setSplitFiles] = useState<{ name: string; blob: Blob }[]>([])
  const [splitMode, setSplitMode] = useState<'all' | 'range' | 'manual'>('all')
  const [range, setRange] = useState('')
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [loadingPercent, setLoadingPercent] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setPdfFile(acceptedFiles[0])
      setSplitFiles([])
      setPreviewUrls([])
      setSelectedPages([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    multiple: false,
  })

  const parsePageRange = (range: string, max: number): number[] => {
    const pages = new Set<number>()
    const parts = range.split(',')
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number)
        for (let i = start; i <= Math.min(end, max); i++) pages.add(i - 1)
      } else {
        const page = Number(part)
        if (page >= 1 && page <= max) pages.add(page - 1)
      }
    }
    return [...pages].sort((a, b) => a - b)
  }

  const handleSplit = async () => {
    if (!pdfFile) return
    if (splitMode === 'manual' && selectedPages.length === 0) {
      toast.warning('분할할 페이지를 선택해주세요.')
      return
    }

    setIsSplitting(true)
    try {
      const bytes = await pdfFile.arrayBuffer()
      const originalPdf = await PDFDocument.load(bytes)
      const totalPages = originalPdf.getPageCount()
      const results: { name: string; blob: Blob }[] = []

      const pagesToExtract =
        splitMode === 'range'
          ? parsePageRange(range, totalPages)
          : splitMode === 'manual'
          ? selectedPages
          : Array.from({ length: totalPages }, (_, i) => i)

      for (const i of pagesToExtract) {
        const newPdf = await PDFDocument.create()
        const [copiedPage] = await newPdf.copyPages(originalPdf, [i])
        newPdf.addPage(copiedPage)

        const pdfBytes = await newPdf.save()
        results.push({
          name: `page-${i + 1}.pdf`,
          blob: new Blob([pdfBytes], { type: 'application/pdf' })
        })
      }

      setSplitFiles(results)
      toast.success('PDF가 성공적으로 분할되었습니다.')
    } catch (err) {
      toast.error('PDF 분할 중 오류가 발생했습니다.')
    } finally {
      setIsSplitting(false)
    }
  }

  const handleDownloadZip = async () => {
    const zip = new JSZip()
    splitFiles.forEach((file) => {
      zip.file(file.name, file.blob)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'split-pages.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (!pdfFile) return

    const renderPreview = async () => {
      const fileReader = new FileReader()
      fileReader.onload = async () => {
        setLoadingPreview(true)
        setLoadingPercent(0)

        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer)
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise
        const pages: string[] = []

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 0.5 })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')!
          canvas.width = viewport.width
          canvas.height = viewport.height
          await page.render({ canvasContext: context, viewport }).promise
          pages.push(canvas.toDataURL())
          setLoadingPercent(Math.round((i / pdf.numPages) * 100))
        }

        setPreviewUrls(pages)
        setLoadingPreview(false)
      }
      fileReader.readAsArrayBuffer(pdfFile)
    }

    renderPreview()
  }, [pdfFile])

  return (
    <main className="max-w-screen-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-4">📄 PDF 분할 도구</h1>

      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 rounded-md cursor-pointer transition-all duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 border-dashed bg-blue-50' : 'border-gray-300 border-dashed hover:border-blue-500 hover:bg-blue-50'}`}
      >
        <input {...getInputProps()} />
        <FilePlus className="w-10 h-10 mb-3 text-gray-400" />
        <p className="text-lg font-medium text-gray-700">PDF 파일을 여기에 드롭하세요</p>
        <p className="text-sm text-gray-500">또는 클릭하여 파일 선택</p>
        <p className="mt-2 text-xs text-gray-400">최대 파일 크기: 50MB</p>
      </div>

      {pdfFile && (
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-700">업로드된 파일: <strong>{pdfFile.name}</strong></p>
            <Button size="sm" variant="destructive" onClick={() => setPdfFile(null)}>
              <Trash className="w-4 h-4 mr-1" /> 제거
            </Button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">분할 방식 선택</label>
            <RadioGroup defaultValue="all" className="flex space-x-6" onValueChange={(val) => setSplitMode(val as 'all' | 'range' | 'manual')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="mode-all" />
                <label htmlFor="mode-all" className="text-sm">전체 분할</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="mode-range" />
                <label htmlFor="mode-range" className="text-sm">범위 입력</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="mode-manual" />
                <label htmlFor="mode-manual" className="text-sm">미리보기 선택</label>
              </div>
            </RadioGroup>
          </div>

          {splitMode === 'range' && (
            <div className="mb-4">
              <label htmlFor="range" className="block text-sm font-medium text-gray-700 mb-1">페이지 범위 입력</label>
              <Input id="range" placeholder="예: 1,3-5,8" value={range} onChange={(e) => setRange(e.target.value)} />
            </div>
          )}

          {loadingPreview && splitMode === 'manual' && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">PDF 미리보기를 불러오는 중입니다... ({loadingPercent}%)</p>
              <Progress value={loadingPercent} />
            </div>
          )}

          <Button onClick={handleSplit} disabled={isSplitting} className="mb-6">
            {isSplitting ? '분할 중...' : (splitMode === 'all' ? '전체 페이지로 분할하기' : splitMode === 'range' ? '선택한 범위로 분할하기' : '선택한 페이지로 분할하기')}
          </Button>

          {splitFiles.length > 0 && (
            <div className="mb-6 space-y-2">
              <h2 className="text-lg font-semibold">📂 분할된 파일 목록</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {splitFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
              <Button onClick={handleDownloadZip} className="mt-4">ZIP으로 다운로드</Button>
            </div>
          )}

          {previewUrls.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="border rounded shadow overflow-hidden relative">
                  {splitMode === 'manual' && (
                    <input
                      type="checkbox"
                      className="absolute top-2 left-2 w-4 h-4 z-10"
                      checked={selectedPages.includes(index)}
                      onChange={() => {
                        setSelectedPages((prev) =>
                          prev.includes(index) ? prev.filter((p) => p !== index) : [...prev, index]
                        )
                      }}
                    />
                  )}
                  <img src={url} alt={`Page ${index + 1}`} className="w-full" />
                  <div className="text-sm text-center py-1 bg-gray-100">페이지 {index + 1}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
