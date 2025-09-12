// src/app/image/resizer/page.tsx (최종 기능 완성)

"use client";

import { Button } from '@/components/ui/button';
import { useState, ChangeEvent, DragEvent, useEffect } from 'react';

export default function ImageResizerPage() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('');
    const [originalWidth, setOriginalWidth] = useState<number>(0);
    const [originalHeight, setOriginalHeight] = useState<number>(0);
    
    const [newWidth, setNewWidth] = useState<number>(0);
    const [newHeight, setNewHeight] = useState<number>(0);
    const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true); // 비율 유지 state
    
    const [resizedImageUrl, setResizedImageUrl] = useState<string>(''); // 변환된 이미지 URL state

    const handleFile = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setOriginalFile(file);
            setResizedImageUrl(''); // 새 파일이 오면 이전 결과물은 초기화
            const previewUrl = URL.createObjectURL(file);
            setOriginalPreviewUrl(previewUrl);

            const img = new Image();
            img.onload = () => {
                setOriginalWidth(img.width);
                setOriginalHeight(img.height);
                setNewWidth(img.width);
                setNewHeight(img.height);
            };

            img.src = previewUrl;
        } else { 
            /* ... 초기화 로직 ... */ 
            // 👇 유효하지 않은 파일이거나, 파일 선택을 취소했을 때 모든 상태를 초기화합니다.
            setOriginalFile(null);
            setOriginalPreviewUrl('');
            setOriginalWidth(0);
            setOriginalHeight(0);
            setNewWidth(0);
            setNewHeight(0);
            setResizedImageUrl('');
            
            // 사용자가 파일을 선택했다가 취소한 게 아니라, '잘못된' 파일을 올렸을 때만 알림
            if (file) {
                alert('이미지 파일만 업로드해주세요.');
            }
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => { handleFile(e.target.files?.[0] || null); };
    const handleDragOver = (e: DragEvent<HTMLElement>) => { e.preventDefault(); };
    const handleDrop = (e: DragEvent<HTMLElement>) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0] || null); };

    // 가로 크기 변경 시, 비율 유지 옵션이 켜져있으면 세로 크기 자동 계산
    const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
        const width = Number(e.target.value);
        setNewWidth(width);
        if (keepAspectRatio && originalWidth > 0) {
            const aspectRatio = originalHeight / originalWidth;
            setNewHeight(Math.round(width * aspectRatio));
        }
    };
    
    // 세로 크기 변경 시, 비율 유지 옵션이 켜져있으면 가로 크기 자동 계산
    const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
        const height = Number(e.target.value);
        setNewHeight(height);
        if (keepAspectRatio && originalHeight > 0) {
            const aspectRatio = originalWidth / originalHeight;
            setNewWidth(Math.round(height * aspectRatio));
        }
    };

    // '사이즈 변환' 버튼 클릭 시 실행될 핵심 함수
    const handleResize = () => {
        if (!originalPreviewUrl || newWidth <= 0 || newHeight <= 0) return;

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            // originalFile.type을 사용해 원본 포맷(jpg, png 등)을 유지합니다.
            const resizedUrl = canvas.toDataURL(originalFile?.type || 'image/jpeg', 0.9);
            setResizedImageUrl(resizedUrl);
        };
        img.src = originalPreviewUrl;
    };
    
    // 다운로드 함수
    const handleDownload = () => {
        if (!resizedImageUrl || !originalFile) return;
        
        const a = document.createElement('a');
        a.href = resizedImageUrl;
        
        // 원본 파일의 이름과 확장자를 분리합니다.
        const fileExtension = originalFile.name.split('.').pop() || 'png';
        const originalFileName = originalFile.name.replace(/\.[^/.]+$/, "");
        
        // 👇 파일명 생성 로직을 새로운 크기 정보가 포함되도록 수정합니다.
        a.download = `${originalFileName}_${newWidth}x${newHeight}.${fileExtension}`;
        
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    useEffect(() => { 
        /* ... 메모리 클린업 ... */ 
        return () => { 
            if (originalPreviewUrl) { 
                URL.revokeObjectURL(originalPreviewUrl); 
            }
            
            if (resizedImageUrl) { 
                URL.revokeObjectURL(resizedImageUrl); 
            }
        }; 
    }, [originalPreviewUrl, resizedImageUrl]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ... 제목, 파일 업로드 UI는 동일 ... */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">이미지 사이즈 변환</h1>
                <p className="text-lg text-gray-600 mt-2">이미지 크기를 조절하여 원하는 사이즈로 저장하세요.</p>
            </div>

            {!originalFile && ( /* ... */ 
                <div className="w-full max-w-2xl mx-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p>이미지 파일을 이곳에 드롭하거나 클릭하여 업로드하세요</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
            )}

            {originalFile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">원본 이미지</h2>
                        <div className="border rounded-lg p-2 bg-gray-50 flex items-center justify-center min-h-[200px]">
                            {originalPreviewUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={originalPreviewUrl} alt="Original Preview" className="max-w-full max-h-96 rounded" />
                            )}
                        </div>
                        <p className="text-sm text-center text-gray-500">원본 크기: {originalWidth} x {originalHeight} px</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">리사이징 옵션</h2>
                        <div className="border rounded-lg p-4 bg-white space-y-4 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div>
                                    <label htmlFor="width" className="text-sm font-medium">가로 (Width)</label>
                                    <input type="number" id="width" value={newWidth} onChange={handleWidthChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="height" className="text-sm font-medium">세로 (Height)</label>
                                    <input type="number" id="height" value={newHeight} onChange={handleHeightChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input id="aspect-ratio" type="checkbox" checked={keepAspectRatio} onChange={(e) => setKeepAspectRatio(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /><label htmlFor="aspect-ratio" className="ml-2 block text-sm text-gray-900">비율 유지</label></div>
                            <Button onClick={handleResize} className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">사이즈 변환</Button>
                        </div>
                        {resizedImageUrl && (
                            <>
                                <h2 className="text-lg font-semibold mt-6">변환된 이미지</h2>
                                <div className="border rounded-lg p-2 bg-gray-50 flex items-center justify-center min-h-[200px]">
                                    {
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={resizedImageUrl} alt="Resized Preview" className="max-w-full max-h-96 rounded" />
                                    }
                                </div>
                                <Button onClick={handleDownload} className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90">다운로드</Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}