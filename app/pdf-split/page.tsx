'use client'

import NextImage from 'next/image'
import { useCallback, useEffect, useState } from 'react'
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
  const [rangeSplitMode, setRangeSplitMode] = useState<'group' | 'each'>('group')
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [progressPercent, setProgressPercent] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setLoadingPreview(true)
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

  const parseRangeGroups = (range: string, max: number): number[][] => {
    const groups: number[][] = []
    const parts = range.split(',')
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number)
        const group: number[] = []
        for (let i = start; i <= Math.min(end, max); i++) {
          group.push(i - 1)
        }
        groups.push(group)
      } else {
        const page = Number(part)
        if (page >= 1 && page <= max) groups.push([page - 1])
      }
    }
    return groups
  }

  const handleSplit = async () => {
    if (!pdfFile) return
    if (splitMode === 'manual' && selectedPages.length === 0) {
      toast.warning('분할할 페이지를 선택해주세요.')
      return
    }

    setIsSplitting(true)
    setProgressPercent(0)
    try {
      const bytes = await pdfFile.arrayBuffer()
      const originalPdf = await PDFDocument.load(bytes)
      const totalPages = originalPdf.getPageCount()
      const results: { name: string; blob: Blob }[] = []

      const updateProgress = (index: number, total: number) => {
        const percent = Math.round((index / total) * 100)
        setProgressPercent(percent)
      }

      if (splitMode === 'range') {
        const groups = parseRangeGroups(range, totalPages)
        if (rangeSplitMode === 'group') {
          const allPages = groups.flat()
          const newPdf = await PDFDocument.create()
          const copiedPages = await newPdf.copyPages(originalPdf, allPages)
          copiedPages.forEach((page) => newPdf.addPage(page))
          const pdfBytes = await newPdf.save()
          results.push({
            name: `merged.pdf`,
            blob: new Blob([pdfBytes], { type: 'application/pdf' })
          })
          updateProgress(1, 1)
        } else {
          let total = groups.flat().length
          let current = 0
          for (let i = 0; i < groups.length; i++) {
            for (const pageIndex of groups[i]) {
              const newPdf = await PDFDocument.create()
              const [copiedPage] = await newPdf.copyPages(originalPdf, [pageIndex])
              newPdf.addPage(copiedPage)
              const pdfBytes = await newPdf.save()
              results.push({
                name: `page-${pageIndex + 1}.pdf`,
                blob: new Blob([pdfBytes], { type: 'application/pdf' })
              })
              current++
              updateProgress(current, total)
            }
          }
        }
      } else {
        const pagesToExtract =
          splitMode === 'manual'
            ? selectedPages
            : Array.from({ length: totalPages }, (_, i) => i)

        for (let i = 0; i < pagesToExtract.length; i++) {
          const pageIndex = pagesToExtract[i]
          const newPdf = await PDFDocument.create()
          const [copiedPage] = await newPdf.copyPages(originalPdf, [pageIndex])
          newPdf.addPage(copiedPage)
          const pdfBytes = await newPdf.save()
          results.push({
            name: `page-${pageIndex + 1}.pdf`,
            blob: new Blob([pdfBytes], { type: 'application/pdf' })
          })
          updateProgress(i + 1, pagesToExtract.length)
        }
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
      {/* 상단 제목 */}
      <h1 className="text-2xl font-bold mb-4">📄 PDF 분할 도구</h1>

      {/* 업로드 전 */}
      {!pdfFile && (
        <div {...getRootProps()} className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 transition">
          <input {...getInputProps()} />
          <FilePlus className="mx-auto w-12 h-12 text-muted-foreground" />
          <p className="text-xl font-semibold mt-2">PDF 파일을 여기에 드롭하세요</p>
          <p className="text-muted-foreground">또는 클릭하여 파일 선택</p>
          <p className="text-sm text-muted-foreground mt-2">최대 파일 크기: 50MB</p>
        </div>
      )}

      {/* 업로드 됐고 로딩 중일 때만 미리보기 진행 상태 출력 */}
      {pdfFile && loadingPreview && (
        <div className="mt-8">
          <p className="mb-2 text-sm text-muted-foreground">PDF를 로딩중입니다...</p>
          <Progress value={loadingPercent} />
          <p className="text-sm text-muted-foreground mt-1">{loadingPercent}% 완료</p>
        </div>
      )}

      {/* 로딩이 완료된 경우에만 본 UI 렌더링 */}
      {pdfFile && !loadingPreview && (
        <>
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm font-semibold">
              업로드된 파일: <span className="font-bold">{pdfFile.name}</span>
            </p>
            <Button variant="destructive" size="sm" onClick={() => setPdfFile(null)}>
              <Trash className="w-4 h-4 mr-1" /> 제거
            </Button>
          </div>

          {/* 분할 방식 선택 */}
          <div className="my-6">
            <h2 className="text-base font-medium mb-2">분할 방식 선택</h2>
            <RadioGroup defaultValue="all" className="flex gap-6" onValueChange={(val) => setSplitMode(val as 'all' | 'range' | 'manual')}>
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

          {/* 범위 분할 옵션 */}
          {splitMode === 'range' && (
            <>
              <div className="mb-4">
                <label htmlFor="range" className="block text-sm font-medium text-gray-700 mb-1">페이지 범위 입력</label>
                <Input id="range" placeholder="예: 1-3,5,8-9" value={range} onChange={(e) => setRange(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">범위 처리 방식</label>
                <RadioGroup defaultValue="group" className="flex space-x-4" onValueChange={(val) => setRangeSplitMode(val as 'group' | 'each')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="group" id="group" />
                    <label htmlFor="group" className="text-sm">묶음으로 분할</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="each" id="each" />
                    <label htmlFor="each" className="text-sm">각 페이지마다 분할</label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {/* 미리보기 분할 선택 */}
          {splitMode === 'manual' && previewUrls.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative border rounded shadow overflow-hidden">
                  <input
                    type="checkbox"
                    className="absolute top-2 left-2 w-4 h-4 z-10"
                    checked={selectedPages.includes(index)}
                    onChange={() =>
                      setSelectedPages((prev) =>
                        prev.includes(index) ? prev.filter((p) => p !== index) : [...prev, index]
                      )
                    }
                  />
                  <NextImage src={url} alt={`Page ${index + 1}`} width={400} height={600} className="w-full h-auto object-contain" />
                  <div className="text-sm text-center py-1 bg-gray-100">페이지 {index + 1}</div>
                </div>
              ))}
            </div>
          )}

          {/* 분할 실행 버튼 */}
          <Button onClick={handleSplit} disabled={isSplitting} className="mb-6">
            {isSplitting ? '분할 중...' : (splitMode === 'all' ? '전체 페이지로 분할하기' : splitMode === 'range' ? '선택한 범위로 분할하기' : '선택한 페이지로 분할하기')}
          </Button>

          {/* 분할 중 진행률 */}
          {isSplitting && (
            <div className="mt-4">
              <Progress value={progressPercent} />
              <p className="text-sm text-gray-500 mt-1">{progressPercent}% 완료</p>
            </div>
          )}

          {/* 결과 파일 목록 */}
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
        </>
      )}
    </main>
  )



}
