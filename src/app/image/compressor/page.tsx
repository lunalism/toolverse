// src/app/image/compressor/page.tsx

"use client";

import { useState } from 'react';

export default function ImageCompressorPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [quality, setQuality] = useState<number>(80); // 압축 품질 state (기본값 80)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">이미지 압축</h1>
                <p className="text-lg text-gray-600 mt-2">
                    품질 저하를 최소화하며 이미지 파일 용량을 줄여보세요.
                </p>
            </div>

            {files.length === 0 && (
                <div className="w-full max-w-2xl mx-auto">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <p>압축할 이미지들을 이곳에 드롭하거나 클릭하여 업로드하세요</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/jpeg,image/png,image/webp" multiple />
                    </label>
                </div>
            )}

            {files.length > 0 && (
                <div className="w-full max-w-4xl mx-auto">
                    {/* 압축 옵션 */}
                    <div className="p-4 border rounded-lg bg-white shadow-sm mb-8">
                        <label htmlFor="quality" className="block font-semibold">압축 품질: {quality}</label>
                        <p className="text-sm text-gray-500 mb-2">숫자가 낮을수록 용량이 작아지고, 품질도 낮아집니다.</p>
                        <input id="quality" type="range" min="10" max="100" step="5" value={quality} onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* 파일 목록 */}
                    <div className="space-y-2 mb-8">
                        {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-white">
                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            {/* 여기에 원본 파일 크기를 표시할 예정입니다. */}
                        </div>
                        ))}
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