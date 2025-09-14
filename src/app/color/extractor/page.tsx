// src/app/color/extractor/page.tsx (colorthief 직접 사용)

"use client";

import { useState, ChangeEvent } from 'react';
import ColorThief from 'colorthief'; // 훅 대신 원본 라이브러리를 import

// RGB 배열을 HEX 코드로 변환하는 헬퍼 함수
function rgbToHex(rgb: number[]): string {
    return "#" + rgb.map(value => {
        const hex = value.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join('');
}

export default function ColorExtractorPage() {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [palette, setPalette] = useState<number[][] | null>(null); // 팔레트를 RGB 배열로 저장
    const [copiedColor, setCopiedColor] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            const url = URL.createObjectURL(selectedFile);
            setImageUrl(url);
            setPalette(null); // 새 이미지가 오면 팔레트 초기화
            setIsLoading(true);

            const img = new Image();
            img.onload = () => {
                const colorThief = new ColorThief();
                // 이미지가 로드된 후, img 객체를 직접 넘겨서 팔레트를 추출합니다.
                const colorPalette = colorThief.getPalette(img, 6);
                setPalette(colorPalette);
                setIsLoading(false);
            };
            img.src = url;
        } else {
        // ... 초기화 로직
        }
    };

    const handleReset = () => { 
        /* ... 이전과 동일 ... */ 
        setImageUrl(''); setPalette(null); setCopiedColor(''); 
    };

    const handleCopy = (color: string) => { 
        /* ... 이전과 동일 ... */ 
        navigator.clipboard.writeText(color).then(() => { 
            setCopiedColor(color); setTimeout(() => setCopiedColor(''), 1500); 
        }); 
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ... 제목, 파일 업로드 UI는 이전과 동일 ... */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">이미지 색상 팔레트 추출</h1>
                <p className="text-lg text-gray-600 mt-2">이미지를 업로드하면 주요 색상들을 분석해 알려드립니다.</p>
            </div>

            {!imageUrl && (
                <div className="w-full max-w-2xl mx-auto">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <p>색상을 추출할 이미지를 드롭하거나 클릭하여 업로드하세요</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
            )}

            {imageUrl && (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">업로드된 이미지</h2>
                            <div className="border rounded-lg overflow-hidden shadow-sm flex justify-center items-center h-130 bg-gray-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageUrl} alt="Uploaded preview" className="w-full object-contain" /></div></div>
                            <div>
                            <h2 className="text-lg font-semibold mb-2">추출된 색상 팔레트</h2>
                            <div className="p-4 border rounded-lg bg-white space-y-2 shadow-sm min-h-[200px]">
                                {isLoading && <p>색상을 분석 중입니다...</p>}
                                {palette && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {palette.map((rgb, index) => {
                                            const hex = rgbToHex(rgb);
                                            return (
                                                <div key={index} className="text-center">
                                                    <div style={{ backgroundColor: `rgb(${rgb.join(',')})` }} className="w-full h-20 rounded-md border" />
                                                    <button onClick={() => handleCopy(hex)} className="mt-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 w-full">
                                                        {copiedColor === hex ? '복사됨!' : hex}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <button onClick={handleReset} className="mt-4 w-full text-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700">다른 이미지 선택</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}