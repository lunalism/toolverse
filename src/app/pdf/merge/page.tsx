// src/app/pdf/merge/page.tsx

"use client";

import { useState, ChangeEvent, DragEvent } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableFile = { id: string; file: File; };

function SortableFileItem({ item, onRemove }: { item: SortableFile, onRemove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center justify-between p-2 border rounded-md bg-white touch-none">
            <span className="text-sm text-gray-700 truncate">{item.file.name}</span>
            <button onClick={onRemove} className="text-red-500 hover:text-red-700 font-bold z-10">&times;</button>
        </li>
    );
}

export default function PdfMergePage() {
    const [files, setFiles] = useState<SortableFile[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    // 👇 로딩 상태를 관리할 state를 추가합니다.
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const handleFileChange = (newFiles: FileList | null) => { /* ... 이전과 동일 ... */ if (newFiles) { const pdfFiles = Array.from(newFiles).filter(file => file.type === "application/pdf"); const newSortableFiles: SortableFile[] = pdfFiles.map(file => ({ id: crypto.randomUUID(), file, })); setFiles(prevFiles => [...prevFiles, ...newSortableFiles]); } };
    const handleRemoveFile = (idToRemove: string) => { setFiles(prevFiles => prevFiles.filter(item => item.id !== idToRemove)); };
    const handleDragEnd = (event: DragEndEvent) => { const { active, over } = event; if (over && active.id !== over.id) { setFiles((items) => { const oldIndex = items.findIndex((item) => item.id === active.id); const newIndex = items.findIndex((item) => item.id === over.id); return arrayMove(items, oldIndex, newIndex); }); } };
    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files); };

    // 👇 합치기 버튼을 눌렀을 때 실행될 함수입니다.
    const handleMerge = async () => {
        if (files.length < 2) {
            alert('합치려면 최소 2개 이상의 PDF 파일이 필요합니다.');
            return;
        }
        setIsLoading(true);
    
        const formData = new FormData();
        files.forEach(item => {
            formData.append('files', item.file);
        });
    
        try {
            const response = await fetch('/api/pdf/merge', {
                method: 'POST',
                body: formData,
            });
        
            if (!response.ok) {
                throw new Error('서버에서 오류가 발생했습니다.');
            }
        
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
        
            // 👇 파일명을 위한 타임스탬프 생성 로직 추가 (프론트엔드)
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
            const filename = `toolverse-merged_${timestamp}.pdf`;
            
            // 👇 a.download 속성에 동적으로 생성된 파일명을 적용합니다.
            a.download = filename;
            
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error(error);
            alert('파일을 합치는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            {/* ... 페이지 헤더, 파일 업로드 영역은 동일 ... */}
            <div className="text-center mb-8"><h1 className="text-4xl font-black tracking-tighter">PDF 합치기</h1><p className="text-lg text-gray-600 mt-2">여러 개의 PDF 파일을 드래그 앤 드롭하여 간편하게 하나로 합치세요.</p></div>
            <div className="w-full max-w-2xl mx-auto"><label htmlFor="file-upload" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}><div className="flex flex-col items-center justify-center pt-5 pb-6"><svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg><p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그 앤 드롭하세요</p><p className="text-xs text-gray-500">PDF 파일만 가능</p></div><input id="file-upload" type="file" className="hidden" multiple accept=".pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}/></label></div>
            
            {/* 👇 파일 목록 아래에 합치기 버튼과 로딩 UI를 추가합니다. */}
            {files.length > 0 && (
                <div className="w-full max-w-2xl mx-auto mt-8">
                    <h2 className="text-lg font-semibold mb-2">선택된 파일 목록 (드래그해서 순서를 바꾸세요):</h2>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={files} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-2">
                            {files.map((item) => (<SortableFileItem key={item.id} item={item} onRemove={() => handleRemoveFile(item.id)} />))}
                        </ul>
                        </SortableContext>
                    </DndContext>

                    {/* 👇 합치기 버튼과 로딩 표시 UI */}
                    <div className="mt-8 text-center">
                        <button
                        onClick={handleMerge}
                        disabled={isLoading || files.length < 2}
                        className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                        >
                        {isLoading ? '파일을 합치는 중...' : `PDF 합치기 & 다운로드 (${files.length}개)`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}