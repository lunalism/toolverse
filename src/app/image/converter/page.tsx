"use client";

import { Button } from '@/components/ui/button';
import { useState, ChangeEvent, DragEvent, useEffect } from 'react';

export default function ImageConverterPage() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('');
    const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [heicConversionErrorFile, setHeicConversionErrorFile] = useState<File | null>(null);

    const handleFile = async (file: File | null) => {
        if (!file) {
            setOriginalFile(null);
            setOriginalPreviewUrl('');
            setHeicConversionErrorFile(null);
            return;
        }

        const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
        let processedFile = file;

        if (isHeic) {
            setLoadingMessage('HEIC 파일을 변환 중입니다 (브라우저)...');
            setIsLoading(true);
            try {
                const heic2any = (await import('heic2any')).default;
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.9,
                }) as Blob;
                
                const fileName = file.name.replace(/\.[^/.]+$/, ".jpg");
                processedFile = new File([convertedBlob], fileName, { type: 'image/jpeg' });
                
            } catch (error) {
                console.error("클라이언트 HEIC 변환 오류:", error);
                setHeicConversionErrorFile(file);
                setIsLoading(false);
                setLoadingMessage('');
                return;
            } finally {
                setIsLoading(false);
                setLoadingMessage('');
            }
        }
        
        if (processedFile.type.startsWith('image/')) {
            setOriginalFile(processedFile);
            setHeicConversionErrorFile(null);
            const previewUrl = URL.createObjectURL(processedFile);
            setOriginalPreviewUrl(previewUrl);
        } else {
            alert('이미지 파일만 업로드해주세요.');
        }
    };

    const handleServerRetry = async () => {
        if (!heicConversionErrorFile) return;

        setLoadingMessage('서버에서 변환을 재시도합니다...');
        setIsLoading(true);
        setHeicConversionErrorFile(null);

        const formData = new FormData();
        formData.append('file', heicConversionErrorFile);

        try {
            const response = await fetch('/api/image/convert-heic', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('서버 변환 실패');

            const convertedBlob = await response.blob();
            const fileName = heicConversionErrorFile.name.replace(/\.[^/.]+$/, ".jpeg");
            const convertedFile = new File([convertedBlob], fileName, { type: 'image/jpeg' });
            
            handleFile(convertedFile);
        } catch (error) {
            console.error('서버 HEIC 변환 오류:', error);
            alert('서버에서도 파일 변환에 실패했습니다. 다른 파일을 이용해주세요.');
            setOriginalFile(null);
            setOriginalPreviewUrl('');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
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

            {isLoading && (
                <div className="text-center py-10">
                    <p className="text-lg font-semibold">{loadingMessage || '처리 중...'}</p>
                </div>
            )}

            {!originalFile && !isLoading && !heicConversionErrorFile && (
                <div className="w-full max-w-2xl mx-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p>이미지 파일(HEIC 포함)을 드롭하거나 클릭하여 업로드하세요</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/*,.heic,.heif" onChange={handleFileChange} />
                    </label>
                </div>
            )}

            {heicConversionErrorFile && !isLoading && (
                <div className="w-full max-w-2xl mx-auto text-center p-8 border rounded-lg bg-yellow-50 border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800">브라우저에서 변환 실패</h3>
                    <p className="text-yellow-700 my-2">이 HEIC 파일은 브라우저에서 직접 변환할 수 없는 형식입니다.</p>
                    <p className="text-sm text-yellow-600 mb-4">파일명: {heicConversionErrorFile.name}</p>
                    <Button onClick={handleServerRetry} className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600">
                        더 강력한 서버에서 재시도
                    </Button>
                </div>
            )}

            {(originalFile && !isLoading && !heicConversionErrorFile) && (
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
                        <div className="border rounded-lg p-4 bg-white space-y-4 shadow-sm">
                            <div>
                                <label className="text-sm font-medium">변환할 포맷</label>
                                <div className="flex items-center gap-6 mt-2">
                                    <label className="flex items-center">
                                        <input type="radio" name="format" value="jpeg" checked={targetFormat === 'jpeg'} onChange={() => setTargetFormat('jpeg')} className="h-4 w-4 text-indigo-600 border-gray-300" />
                                        <span className="ml-2">JPG</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="format" value="png" checked={targetFormat === 'png'} onChange={() => setTargetFormat('png')} className="h-4 w-4 text-indigo-600 border-gray-300" />
                                        <span className="ml-2">PNG</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="format" value="webp" checked={targetFormat === 'webp'} onChange={() => setTargetFormat('webp')} className="h-4 w-4 text-indigo-600 border-gray-300" />
                                        <span className="ml-2">WEBP</span>
                                    </label>
                                </div>
                            </div>
                            <Button onClick={handleConvert} disabled={isLoading} className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400">
                                {isLoading ? loadingMessage : '포맷 변환 & 다운로드'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}