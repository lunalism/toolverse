// src/app/pdf/merge/page.tsx

"use client";

import { useState, ChangeEvent, DragEvent } from 'react';

export default function PdfMergePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false); // 드래그 상태를 추적할 state 추가

    // 파일이 선택되거나 드롭되었을 때 호출될 함수
    const handleFileChange = (newFiles: FileList | null) => {
        if (newFiles) {
            const pdfFiles = Array.from(newFiles).filter(file => file.type === "application/pdf");
            setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
        }
    };

    // 파일 삭제 함수
    const handleRemoveFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    
    // 드래그 앤 드롭 관련 이벤트 핸들러들
    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">PDF 합치기</h1>
                <p className="text-lg text-gray-600 mt-2">
                    여러 개의 PDF 파일을 드래그 앤 드롭하여 간편하게 하나로 합치세요.
                </p>
            </div>

            <div className="w-full max-w-2xl mx-auto">
                {/* 👇 드래그 앤 드롭 이벤트를 처리하기 위해 label에 핸들러들을 추가합니다. */}
                <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* ... SVG 아이콘 및 텍스트는 동일 ... */}
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그 앤 드롭하세요</p>
                        <p className="text-xs text-gray-500">PDF 파일만 가능</p>
                    </div>
                    {/* 👇 input 태그에는 onChange 핸들러를 추가합니다. */}
                    <input  id="file-upload" type="file" className="hidden" multiple accept=".pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)} />
                </label>
            </div>

            {/* 👇 업로드된 파일 목록을 표시하는 로직을 추가합니다. */}
            {files.length > 0 && (
                <div className="w-full max-w-2xl mx-auto mt-8">
                    <h2 className="text-lg font-semibold mb-2">선택된 파일 목록:</h2>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 border rounded-md bg-white">
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <button  onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 font-bold">
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}