// app/image-converter/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { FileImage, ImageIcon, ArrowRightIcon, XIcon } from 'lucide-react'

export default function ImageConverterPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [outputFormat, setOutputFormat] = useState<string>('PNG')

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles])
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true })

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearFiles = () => {
    setSelectedFiles([])
  }

  const handleConvertAll = () => {
    alert('변환 기능은 아직 구현되지 않았습니다.')
  }

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
                <Button onClick={handleConvertAll}>일괄 변환</Button>
              </div>
            </div>

            <div className="space-y-3">
              {selectedFiles.map((file, index) => {
                const ext = file.name.split('.').pop()?.toUpperCase() || '???'
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
                      <span className="ml-6 text-sm text-gray-800 font-medium truncate max-w-[250px]">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(index)}>
                      <XIcon className="w-5 h-5 text-red-500 hover:text-red-600 transition" />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
