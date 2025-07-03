'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FilePlus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'

export default function PdfSplitPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isSplitting, setIsSplitting] = useState(false)
  const [splitFiles, setSplitFiles] = useState<{ name: string; blob: Blob }[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setPdfFile(acceptedFiles[0])
      setSplitFiles([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    multiple: false,
  })

  const handleSplitAll = async () => {
    if (!pdfFile) return
    setIsSplitting(true)
    try {
      const bytes = await pdfFile.arrayBuffer()
      const originalPdf = await PDFDocument.load(bytes)
      const totalPages = originalPdf.getPageCount()
      const results: { name: string; blob: Blob }[] = []

      for (let i = 0; i < totalPages; i++) {
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

          <Button onClick={handleSplitAll} disabled={isSplitting} className="mb-6">
            {isSplitting ? '분할 중...' : '전체 페이지로 분할하기'}
          </Button>

          {splitFiles.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">📂 분할된 파일 목록</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {splitFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
              <Button onClick={handleDownloadZip} className="mt-4">ZIP으로 다운로드</Button>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
