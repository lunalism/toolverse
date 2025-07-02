// app/image-converter/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { FileImage, ImageIcon, ArrowRightIcon, XIcon, DownloadIcon, Loader2Icon, FileArchiveIcon } from 'lucide-react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { Progress } from '@/components/ui/progress'

interface ConvertedFile {
  file: File
  status: 'pending' | 'converting' | 'done' | 'error'
  blob?: Blob
}

export default function ImageConverterPage() {
  const [selectedFiles, setSelectedFiles] = useState<ConvertedFile[]>([])
  const [outputFormat, setOutputFormat] = useState<string>('PNG')
  const [isConverting, setIsConverting] = useState<boolean>(false)

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({ file, status: 'pending' as const }))
    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true })

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearFiles = () => {
    setSelectedFiles([])
  }

  const convertImage = (file: File, outputFormat: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0)

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error('이미지 변환 실패'))
            },
            `image/${outputFormat.toLowerCase()}`
          )
        }
        img.onerror = reject
        img.src = reader.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleConvertAll = async () => {
    setIsConverting(true)
    const updatedFiles = [...selectedFiles]

    for (let i = 0; i < updatedFiles.length; i++) {
      updatedFiles[i].status = 'converting'
      setSelectedFiles([...updatedFiles])
      try {
        const blob = await convertImage(updatedFiles[i].file, outputFormat)
        updatedFiles[i].status = 'done'
        updatedFiles[i].blob = blob
      } catch {
        updatedFiles[i].status = 'error'
      }
      setSelectedFiles([...updatedFiles])
    }

    setIsConverting(false)
  }

  const handleDownloadZip = async () => {
    const zip = new JSZip()
    selectedFiles.forEach((item) => {
      if (item.status === 'done' && item.blob) {
        const name = item.file.name.replace(/\.[^/.]+$/, '') + '.' + outputFormat.toLowerCase()
        zip.file(name, item.blob)
      }
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'converted_images.zip')
  }

  const allDone = selectedFiles.length > 1 && selectedFiles.every((file) => file.status === 'done')

  return (
    <main className="max-w-screen-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-2">🖼️ 이미지 포맷 변환기</h1>
      <p className="text-gray-600 mb-6">
        JPEG, PNG, WebP, GIF, BMP, TIFF 등 다양한 이미지 포맷 간 변환을 브라우저에서 직접 수행하세요.
      </p>

      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 rounded-md cursor-pointer transition-all duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 border-dashed bg-blue-50' : 'border-gray-300 border-dashed hover:border-gray-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <FileImage className="w-10 h-10 mb-3 text-gray-400" />
        <p className="text-lg font-medium text-gray-700">이미지를 여기에 드롭하세요</p>
        <p className="text-sm text-gray-500">또는 클릭하여 파일 선택</p>
        <p className="mt-2 text-xs text-gray-400">
          지원 포맷: JPEG, PNG, WebP, GIF, BMP, TIFF, SVG<br />
          최대 파일 크기: 50MB
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <>
          {/* 출력 포맷 선택 섹션 */}
          <section className="mt-10 border rounded-xl p-6 bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-4">출력 포맷 선택</h2>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-40 p-2 border border-gray-300 rounded-md text-sm"
            >
              {['PNG', 'JPEG', 'WEBP', 'GIF', 'BMP', 'TIFF', 'SVG'].map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </section>

          {/* 일괄 변환 섹션 */}
          <section className="mt-10 border rounded-xl p-6 bg-white shadow-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">일괄 변환 ({selectedFiles.length})</h2>
              <div className="space-x-2">
                <Button variant="outline" onClick={clearFiles}>초기화</Button>
                <Button onClick={handleConvertAll} disabled={isConverting}>일괄 변환</Button>
              </div>
            </div>

            <div className="space-y-3">
              {selectedFiles.map((item, index) => {
                const ext = item.file.name.split('.').pop()?.toUpperCase() || '???'
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{ext}</span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{outputFormat}</span>
                      </div>
                      <span className="text-sm text-gray-800 font-medium truncate max-w-[200px]">{item.file.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.status === 'converting' && (
                        <Progress value={100} className="w-32 h-2" />
                      )}

                      {item.status === 'done' && item.blob && (
                        <button
                          onClick={() => saveAs(item.blob!, item.file.name.replace(/\.[^/.]+$/, '') + '.' + outputFormat.toLowerCase())}
                        >
                          <DownloadIcon className="w-5 h-5 text-green-600 hover:text-green-700" />
                        </button>
                      )}
                      <button onClick={() => removeFile(index)}>
                        <XIcon className="w-5 h-5 text-red-500 hover:text-red-600 transition" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {allDone && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleDownloadZip} className="flex items-center gap-2">
                  <FileArchiveIcon className="w-5 h-5" /> ZIP 다운로드
                </Button>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}
