'use client'
import Image from 'next/image'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trash2 } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

type UploadedPDF = {
  file: File
  url: string
  pages: string[]
  progress: number
}

export default function PDFMergePage() {
  const [pdfList, setPdfList] = useState<UploadedPDF[]>([])
  const [outputFileName, setOutputFileName] = useState<string>('')

  const renderPdfPages = async (file: File, onProgress: (p: number) => void) => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
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
      onProgress(Math.round((i / pdf.numPages) * 100))
    }

    return pages
  }

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

  const handleMerge = async () => {
    if (pdfList.length < 2) return

    const mergedPdf = await PDFDocument.create()

    for (const pdfFile of pdfList) {
      const arrayBuffer = await pdfFile.file.arrayBuffer()
      const currentPdf = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedPdf.copyPages(currentPdf, currentPdf.getPageIndices())

      copiedPages.forEach(page => mergedPdf.addPage(page))
    }

    const mergedBytes = await mergedPdf.save()
    const blob = new Blob([mergedBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = outputFileName.endsWith('.pdf') ? outputFileName : `${outputFileName}.pdf`
    a.click()

    URL.revokeObjectURL(url)
  }

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

      {pdfList.length > 0 && (
        <div className="mt-6">
          {/* 병합 제목 입력 + 버튼 */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="이 곳에 병합될 PDF 파일 이름을 입력하세요"
              value={outputFileName}
              onChange={(e) => setOutputFileName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <Button onClick={handleMerge} disabled={pdfList.length < 2}>
              병합하기
            </Button>
          </div>

          {/* 썸네일 카드 그리드 */}
          <div className="border rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
              {pdfList.map((pdf, index) => (
                <div key={index} className="relative border rounded-lg bg-gray-50 p-4 shadow-sm flex flex-col items-center">
                  <div className="flex justify-between items-center w-full mb-2">
                    <span className="text-sm font-medium truncate">{pdf.file.name}</span>
                    <Button variant="ghost" size="icon" onClick={() => removePDF(index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  {pdf.progress < 100 ? (
                    <Progress value={pdf.progress} className="h-2 w-full mt-2" />
                  ) : (
                    <Image
                      src={pdf.pages[0]}
                      alt={`Preview of ${pdf.file.name}`}
                      width={260}
                      height={370}
                      className="object-cover border rounded-lg shadow"
                    />
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
