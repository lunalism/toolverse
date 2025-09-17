// src/app/image/favicon-generator/page.tsx (최종 완성)

"use client";

import { useState, ChangeEvent } from 'react';
// import JSZip from 'jszip';

const FAVICON_SIZES = [
    { size: 32, name: 'favicon-32x32.png', type: 'icon' },
    { size: 16, name: 'favicon-16x16.png', type: 'icon' },
    { size: 180, name: 'apple-touch-icon.png', type: 'apple' },
    { size: 192, name: 'android-chrome-192x192.png', type: 'android' },
    { size: 512, name: 'android-chrome-512x512.png', type: 'android' },
];

type GeneratedFavicon = { name: string; url: string; size: number; };

// 캔버스 Blob을 File 객체로 변환하는 헬퍼 함수
async function blobToFile(blob: Blob, fileName: string): Promise<File> {
    return new File([blob], fileName, { type: blob.type });
}

export default function FaviconGeneratorPage() {
    const [sourceImageUrl, setSourceImageUrl] = useState<string>('');
    const [generatedFavicons, setGeneratedFavicons] = useState<GeneratedFavicon[]>([]);
    const [htmlCode, setHtmlCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setSourceImageUrl(url);
        setGeneratedFavicons([]);
        setHtmlCode('');
        }
    };

    const handleGenerate = async () => {
        if (!sourceImageUrl) return;
        setIsLoading(true);
        setLoadingMessage('PNG 이미지 생성 중...');

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = sourceImageUrl;

        img.onload = async () => {
        const generatedItems: GeneratedFavicon[] = [];
        const formData = new FormData();

        // 1. 프론트엔드에서 모든 PNG 이미지 생성
        for (const item of FAVICON_SIZES) {
            const canvas = document.createElement('canvas');
            canvas.width = item.size;
            canvas.height = item.size;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, item.size, item.size);
            
            const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            if (blob) {
                generatedItems.push({ 
                    name: item.name, 
                    url: URL.createObjectURL(blob), 
                    size: item.size 
                });
                const pngFile = await blobToFile(blob, item.name);
                formData.append('pngFiles', pngFile);
            }
        }
        setGeneratedFavicons(generatedItems);

        // 2. HTML 코드 생성
        setHtmlCode(`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
            <link rel="manifest" href="/site.webmanifest">
        `);

        // 3. 백엔드로 PNG 파일들을 보내 최종 조립 요청
        setLoadingMessage('.ico 생성 및 ZIP 압축 중...');
        try {
            const response = await fetch('/api/image/favicon-generator', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('서버 처리 실패');

            const zipBlob = await response.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(zipBlob);
            a.download = 'favicons.zip';
            a.click();
            URL.revokeObjectURL(a.href);

        } catch (error) {
            console.error(error);
            alert('파비콘 생성에 실패했습니다.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
        };
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ... 제목 및 파일 업로드 UI는 이전과 동일 ... */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">파비콘 생성기</h1>
                <p className="text-lg text-gray-600 mt-2">하나의 이미지로 모든 곳에 필요한 파비콘을 만드세요.</p>
            </div>

            {!sourceImageUrl && (
                <div className="w-full max-w-2xl mx-auto">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <p>원본 이미지를 업로드하세요 (512x512 이상, 정사각형 추천)</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={handleFileChange} />
                    </label>
                </div>
            )}

            {sourceImageUrl && (
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center mb-8">
                        <div className="lg:col-span-1">
                            <h2 className="text-lg font-semibold mb-2">원본 이미지</h2>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={sourceImageUrl} alt="Source" className="w-full max-w-xs mx-auto rounded-lg shadow-md" />
                        </div>
                        <div className="lg:col-span-2 text-center">
                            <button onClick={handleGenerate} disabled={isLoading} className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90 disabled:bg-gray-400">
                                {isLoading ? loadingMessage : '파비콘 생성 & ZIP으로 다운로드'}
                            </button>
                        </div>
                    </div>

                    {generatedFavicons.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">미리보기</h2>
                                    <div className="p-4 border rounded-lg bg-white shadow-sm grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {generatedFavicons.map(favicon => (
                                            <div key={favicon.name} className="text-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={favicon.url} alt={favicon.name} className="w-16 h-16 mx-auto border p-1 rounded-md" />
                                                <p className="text-xs mt-1 text-gray-600">{favicon.size}x{favicon.size}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">HTML 코드</h2>
                                    <div className="relative p-4 border rounded-lg bg-gray-900 text-white font-mono text-xs shadow-sm overflow-x-auto">
                                    <pre><code>{htmlCode}</code></pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}