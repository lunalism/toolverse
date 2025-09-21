"use client";

import { useState, ChangeEvent, DragEvent, useEffect } from 'react';
// shadcn/ui 컴포넌트들을 import 합니다.
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ImageConverterPage() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('');
    const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    const handleFile = (file: File | null) => {
        if (!file) {
            setOriginalFile(null);
            setOriginalPreviewUrl('');
            return;
        }
    
        const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    
        if (isHeic) {
            alert('HEIC 변환 기능은 현재 준비 중입니다. 곧 더 강력한 모습으로 찾아뵙겠습니다!');
            return;
        }
        
        if (file.type.startsWith('image/')) {
            setOriginalFile(file);
            const previewUrl = URL.createObjectURL(file);
            setOriginalPreviewUrl(previewUrl);
        } else {
            alert('이미지 파일만 업로드해주세요.');
        }
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => { handleFile(e.target.files?.[0] || null); };
    const handleDragOver = (e: DragEvent<HTMLElement>) => { e.preventDefault(); };
    const handleDrop = (e: DragEvent<HTMLElement>) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0] || null); };

    const handleConvert = () => {
        if (!originalPreviewUrl || !originalFile) return;
        setIsLoading(true);
        setLoadingMessage('포맷 변환 중...');
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsLoading(false);
                return;
            }
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL(`image/${targetFormat}`, 1.0);
            const a = document.createElement('a');
            a.href = dataUrl;
            const originalFileName = originalFile.name.replace(/\.[^/.]+$/, "");
            a.download = `${originalFileName}.${targetFormat}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setIsLoading(false);
            setLoadingMessage('');
        };
        img.src = originalPreviewUrl;
    };

    useEffect(() => {
        return () => { if (originalPreviewUrl) { URL.revokeObjectURL(originalPreviewUrl); } };
    }, [originalPreviewUrl]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">이미지 포맷 변환</h1>
                <p className="text-lg text-gray-600 mt-2">
                    이미지를 JPG, PNG, WEBP 포맷으로 변환하세요.
                </p>
            </div>

            <div className="w-full max-w-2xl mx-auto">
                {!originalFile ? (
                    <div onDragOver={handleDragOver} onDrop={handleDrop}>
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그 앤 드롭하세요</p>
                            <p className="text-xs text-gray-500">이미지 파일(HEIC 포함)을 지원합니다.</p>
                        </label>
                        <input id="file-upload" type="file" className="hidden" accept="image/*,.heic,.heif" onChange={handleFileChange} />
                        
                        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                            <h3 className="font-bold">HEIC 변환 기능 안내</h3>
                            <p className="text-sm">현재 일부 HEIC 파일 변환이 불안정하여, 더 강력한 서버 로직으로 개선될 예정입니다. 일반 이미지 파일(JPG, PNG 등)은 정상적으로 작동합니다.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">원본 이미지</h2>
                            <div className="border rounded-lg p-2 bg-gray-50 flex items-center justify-center h-96">
                                {originalPreviewUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={originalPreviewUrl} alt="Original Preview" className="max-w-full max-h-96 rounded" />
                                )}
                            </div>
                        </div>
                    
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">변환 옵션</h2>
                            <div className="border rounded-lg p-6 bg-white space-y-6 shadow-sm">
                                <RadioGroup value={targetFormat} onValueChange={(value: 'jpeg' | 'png' | 'webp') => setTargetFormat(value)}>
                                    <Label className="text-base">변환할 포맷</Label>
                                    <div className="flex items-center space-x-6 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="jpeg" id="jpeg" />
                                            <Label htmlFor="jpeg">JPG</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="png" id="png" />
                                            <Label htmlFor="png">PNG</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="webp" id="webp" />
                                            <Label htmlFor="webp">WEBP</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                                <Button onClick={handleConvert} disabled={isLoading} className="w-full" size="lg">
                                    {isLoading ? loadingMessage : '포맷 변환 & 다운로드'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}