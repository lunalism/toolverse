// src/app/pdf/merge/page.tsx

"use client";

import { useState, ChangeEvent, DragEvent } from 'react';
// dnd-kit 라이브러리에서 필요한 것들을 가져옵니다.
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// [중요] dnd-kit은 각 항목에 고유 ID가 필요합니다. File 객체와 고유 ID를 함께 저장할 타입을 정의합니다.
type SortableFile = {
  id: string;
  file: File;
};

// 드래그 가능한 각 파일 아이템을 위한 별도의 컴포넌트입니다.
function SortableFileItem({ item, onRemove }: { item: SortableFile, onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-2 border rounded-md bg-white touch-none"
    >
      <span className="text-sm text-gray-700 truncate">{item.file.name}</span>
      <button 
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 font-bold z-10"
      >
        &times;
      </button>
    </li>
  );
}


export default function PdfMergePage() {
  // state를 SortableFile 타입의 배열로 변경합니다.
  const [files, setFiles] = useState<SortableFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileChange = (newFiles: FileList | null) => {
    if (newFiles) {
      const pdfFiles = Array.from(newFiles).filter(file => file.type === "application/pdf");
      // 파일과 함께 고유 ID를 생성해서 state에 저장합니다.
      const newSortableFiles: SortableFile[] = pdfFiles.map(file => ({
        id: crypto.randomUUID(),
        file,
      }));
      setFiles(prevFiles => [...prevFiles, ...newSortableFiles]);
    }
  };

  const handleRemoveFile = (idToRemove: string) => {
    setFiles(prevFiles => prevFiles.filter(item => item.id !== idToRemove));
  };

  // 드래그가 끝났을 때 순서를 바꿔주는 함수
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... 페이지 헤더 부분은 동일 ... */}
      <div className="text-center mb-8"><h1 className="text-4xl font-black tracking-tighter">PDF 합치기</h1><p className="text-lg text-gray-600 mt-2">여러 개의 PDF 파일을 드래그 앤 드롭하여 간편하게 하나로 합치세요.</p></div>

      {/* ... 파일 업로드 영역은 동일 ... */}
      <div className="w-full max-w-2xl mx-auto"><label htmlFor="file-upload" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}><div className="flex flex-col items-center justify-center pt-5 pb-6"><svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg><p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그 앤 드롭하세요</p><p className="text-xs text-gray-500">PDF 파일만 가능</p></div><input id="file-upload" type="file" className="hidden" multiple accept=".pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}/></label></div>
      
      {files.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mt-8">
          <h2 className="text-lg font-semibold mb-2">선택된 파일 목록 (드래그해서 순서를 바꾸세요):</h2>
          {/* 👇 DndContext와 SortableContext로 파일 목록을 감싸줍니다. */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {files.map((item) => (
                  <SortableFileItem key={item.id} item={item} onRemove={() => handleRemoveFile(item.id)} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}