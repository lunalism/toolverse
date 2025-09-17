// src/app/image/favicon-generator/page.tsx

"use client";

import { useState } from 'react';

export default function FaviconGeneratorPage() {
    const [sourceImage, setSourceImage] = useState<File | null>(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">파비콘 생성기</h1>
                <p className="text-lg text-gray-600 mt-2">
                    하나의 이미지로 모든 곳에 필요한 파비콘을 만드세요.
                </p>
            </div>

            {!sourceImage && (
                <div className="w-full max-w-2xl mx-auto">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <p>원본 이미지를 업로드하세요 (정사각형 추천)</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" />
                    </label>
                </div>
            )}

            {sourceImage && (
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <button className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90">
                            파비콘 생성 & ZIP으로 다운로드
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 왼쪽: 미리보기 */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">미리보기</h2>
                            <div className="p-4 border rounded-lg bg-white shadow-sm">
                                <p className="text-gray-500">여기에 생성된 파비콘들의 미리보기가 표시됩니다.</p>
                            </div>
                        </div>
                        {/* 오른쪽: HTML 코드 */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">HTML 코드</h2>
                            <div className="p-4 border rounded-lg bg-gray-900 text-white font-mono text-sm shadow-sm">
                                <p>여기에 HTML 코드가 표시됩니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}