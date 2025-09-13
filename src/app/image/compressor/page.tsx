// src/app/image/compressor/page.tsx (미리보기 기능 추가)

"use client";

import { useState, ChangeEvent, DragEvent, useEffect } from 'react';

// 바이트를 KB, MB 등으로 변환해주는 헬퍼 함수
function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 파일과 미리보기 URL을 함께 관리할 타입 정의
type ImageFile = {
    file: File;
    previewUrl: string;
};

export default function ImageCompressorPage() {
    // state의 타입을 ImageFile 배열로 변경합니다.
    const [files, setFiles] = useState<ImageFile[]>([]);
    const [quality, setQuality] = useState<number>(80);

    const handleFiles = (newFiles: FileList | null) => {
        if (newFiles) {
            const imageFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
            
            const newImageFiles: ImageFile[] = imageFiles.map(file => ({
                file: file,
                previewUrl: URL.createObjectURL(file), // 각 파일에 대한 미리보기 URL 생성
            }));

            setFiles(prevFiles => [...prevFiles, ...newImageFiles]);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => { handleFiles(e.target.files); };
    const handleDrop = (e: DragEvent<HTMLElement>) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };
    const handleDragOver = (e: DragEvent<HTMLElement>) => { e.preventDefault(); };

    const handleRemoveFile = (indexToRemove: number) => {
        // 파일을 지우기 전에, 메모리에서 미리보기 URL을 해제합니다.
        URL.revokeObjectURL(files[indexToRemove].previewUrl);
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    // 컴포넌트가 사라질 때 모든 미리보기 URL을 메모리에서 해제합니다.
    useEffect(() => {
        return () => {
            files.forEach(imageFile => URL.revokeObjectURL(imageFile.previewUrl));
        };
    }, [files]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ... 제목 UI는 동일 ... */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">이미지 압축</h1>
                <p className="text-lg text-gray-600 mt-2">품질 저하를 최소화하며 이미지 파일 용량을 줄여보세요.</p>
            </div>

            {files.length === 0 && (
                <div className="w-full max-w-2xl mx-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <p>압축할 이미지들을 이곳에 드롭하거나 클릭하여 업로드하세요</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} />
                    </label>
                </div>
            )}

            {files.length > 0 && (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="p-4 border rounded-lg bg-white shadow-sm mb-8">
                        <label htmlFor="quality" className="block font-semibold">압축 품질: {quality}</label>
                        <p className="text-sm text-gray-500 mb-2">숫자가 낮을수록 용량이 작아지고, 품질도 낮아집니다.</p>
                        <input id="quality" type="range" min="10" max="100" step="5" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="space-y-3 mb-8">
                        {files.map((imageFile, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm">
                            <div className="flex items-center gap-4">
                            {/* 👇 미리보기 이미지를 추가합니다. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageFile.previewUrl} alt={imageFile.file.name} className="w-16 h-16 object-cover rounded-md bg-gray-100" />
                            <div className="flex-grow">
                                <p className="text-sm text-gray-800 font-medium truncate">{imageFile.file.name}</p>
                                <p className="text-xs text-gray-500">{formatBytes(imageFile.file.size)}</p>
                            </div>
                            </div>
                            <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 font-bold text-2xl ml-4">&times;</button>
                        </div>
                        ))}
                    </div>

                    {/* 👇 파일을 추가로 올릴 수 있는 작은 버튼을 추가해 UX를 개선합니다. */}
                    <div className="text-center mb-8">
                        <label htmlFor="file-add" className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                        + 파일 추가하기
                        </label>
                        <input id="file-add" type="file" className="hidden" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} />
                    </div>

                    <div className="text-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90">
                        압축하기 & 다운로드 ({files.length}개)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}