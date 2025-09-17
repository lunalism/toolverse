"use client";

import { useState, ChangeEvent, DragEvent, useEffect } from 'react';
// shadcn/ui 컴포넌트들을 모두 import 합니다.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function ImageResizerPage() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('');
    const [originalWidth, setOriginalWidth] = useState<number>(0);
    const [originalHeight, setOriginalHeight] = useState<number>(0);
    
    const [newWidth, setNewWidth] = useState<number>(0);
    const [newHeight, setNewHeight] = useState<number>(0);
    const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
    
    const [resizedImageUrl, setResizedImageUrl] = useState<string>('');

    const handleFile = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setOriginalFile(file);
            setResizedImageUrl('');
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
            setOriginalFile(null);
            setOriginalPreviewUrl('');
            setOriginalWidth(0);
            setOriginalHeight(0);
            setNewWidth(0);
            setNewHeight(0);
            setResizedImageUrl('');
            if (file) {
                alert('이미지 파일만 업로드해주세요.');
            }
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => { 
        handleFile(e.target.files?.[0] || null); 
    };

    const handleDragOver = (e: DragEvent<HTMLElement>) => { 
        e.preventDefault(); 
    };

    const handleDrop = (e: DragEvent<HTMLElement>) => { 
        e.preventDefault(); handleFile(e.dataTransfer.files?.[0] || null); 
    };

    const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
        const width = Number(e.target.value);
        setNewWidth(width);
        if (keepAspectRatio && originalWidth > 0) {
            const aspectRatio = originalHeight / originalWidth;
            setNewHeight(Math.round(width * aspectRatio));
        }
    };
    
    const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
        const height = Number(e.target.value);
        setNewHeight(height);
        if (keepAspectRatio && originalHeight > 0) {
            const aspectRatio = originalWidth / originalHeight;
            setNewWidth(Math.round(height * aspectRatio));
        }
    };

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
            const resizedUrl = canvas.toDataURL(originalFile?.type || 'image/jpeg', 0.9);
            setResizedImageUrl(resizedUrl);
        };
        img.src = originalPreviewUrl;
    };
    
    const handleDownload = () => {
        if (!resizedImageUrl || !originalFile) return;
        const a = document.createElement('a');
        a.href = resizedImageUrl;
        const fileExtension = originalFile.name.split('.').pop() || 'png';
        const originalFileName = originalFile.name.replace(/\.[^/.]+$/, "");
        a.download = `${originalFileName}_${newWidth}x${newHeight}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    useEffect(() => {
        return () => {
            if (originalPreviewUrl) { URL.revokeObjectURL(originalPreviewUrl); }
            if (resizedImageUrl) { URL.revokeObjectURL(resizedImageUrl); }
        };
    }, [originalPreviewUrl, resizedImageUrl]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">이미지 사이즈 변환</h1>
                <p className="text-lg text-gray-600 mt-2">이미지 크기를 조절하고 원하는 포맷으로 저장하세요.</p>
            </div>

            {!originalFile && (
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
                        <div className="border rounded-lg p-2 bg-gray-50 flex items-center justify-center h-96">
                            {originalPreviewUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={originalPreviewUrl} alt="Original Preview" className="max-w-full max-h-full rounded" />
                            )}
                        </div>
                        <p className="text-sm text-center text-gray-500">원본 크기: {originalWidth} x {originalHeight} px</p>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">리사이징 옵션</h2>
                        <div className="border rounded-lg p-6 bg-white space-y-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-full space-y-2">
                                    <Label htmlFor="width">가로 (Width)</Label>
                                    <Input type="number" id="width" value={newWidth} onChange={handleWidthChange} />
                                </div>
                                <div className="w-full space-y-2">
                                    <Label htmlFor="height">세로 (Height)</Label>
                                    <Input type="number" id="height" value={newHeight} onChange={handleHeightChange} />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="aspect-ratio" checked={keepAspectRatio} onCheckedChange={(checked) => setKeepAspectRatio(Boolean(checked))} />
                                <Label htmlFor="aspect-ratio" className="cursor-pointer">비율 유지</Label>
                            </div>
                            <Button onClick={handleResize} className="w-full">사이즈 변환</Button>
                        </div>
                        
                        {resizedImageUrl && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">변환된 이미지</h2>
                                <div className="border rounded-lg p-2 bg-gray-50 flex items-center justify-center min-h-[200px]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={resizedImageUrl} alt="Resized Preview" className="max-w-full max-h-96 rounded" />
                                </div>
                                <Button onClick={handleDownload} className="w-full">다운로드</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}