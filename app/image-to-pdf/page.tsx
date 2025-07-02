// app/image-to-pdf/page.tsx
'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileImage, XIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import jsPDF from 'jspdf'

interface UploadedImage {
  id: string
  file: File
  preview: string
}

function SortableImage({ image, onRemove }: { image: UploadedImage; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative w-36 h-36 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-move group"
    >
      <Image
        src={image.preview}
        alt={image.file.name}
        fill
        sizes="144px"
        className="object-cover"
      />
      <button
        className="absolute top-1 right-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
        onClick={onRemove}
      >
        <XIcon className="w-4 h-4 text-red-500" />
      </button>
    </div>
  )
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filename, setFilename] = useState('converted')
  const [isConverting, setIsConverting] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages((prev) => [...prev, ...newImages])
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true })

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveId(null)
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      setImages((items) => arrayMove(items, oldIndex, newIndex))
    }
  }

  const activeImage = images.find((img) => img.id === activeId)

  const handleConvertToPdf = async () => {
    if (images.length === 0) return
    setIsConverting(true)
    const pdf = new jsPDF()

    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(img.file)
      })

      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      if (i > 0) pdf.addPage()
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight)
    }

    pdf.save(`${filename || 'converted'}.pdf`)
    setIsConverting(false)
  }

  return (
    <main className="max-w-screen-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-2">🖼️ 이미지 → PDF 변환기</h1>
      <p className="text-gray-600 mb-6">JPEG, PNG, WebP, GIF, BMP, TIFF 등 다양한 이미지 포맷 간 변환을 브라우저에서 직접 수행하세요.</p>

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

      {images.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">업로드된 이미지 ({images.length})</h2>

          <label className="block mb-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">PDF 파일 이름</span>
            <Input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="mt-1"
              placeholder="converted"
            />
          </label>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-wrap gap-4">
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onRemove={() => handleRemove(image.id)}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeImage ? (
                <div className="w-36 h-36 rounded-lg overflow-hidden border border-gray-200 shadow-md">
                  <Image src={activeImage.preview} alt={activeImage.file.name} fill sizes="144px" className="object-cover" />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <Button onClick={handleConvertToPdf} className="mt-6" disabled={isConverting}>
            {isConverting ? '변환 중...' : 'PDF로 저장'}
          </Button>
        </section>
      )}
    </main>
  )
}
