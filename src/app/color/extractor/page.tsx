// src/app/color/extractor/page.tsx

"use client";

import { useState } from 'react';

export default function ColorExtractorPage() {
    const [imageUrl, setImageUrl] = useState<string>('');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">이미지 색상 팔레트 추출</h1>
                <p className="text-lg text-gray-600 mt-2">
                    이미지를 업로드하면 주요 색상들을 분석해 알려드립니다.
                </p>
            </div>

            {!imageUrl && (
                <div className="w-full max-w-2xl mx-auto">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <p>색상을 추출할 이미지를 드롭하거나 클릭하여 업로드하세요</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/*" />
                    </label>
                </div>
            )}

            {imageUrl && (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* 이미지 미리보기 */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2">업로드된 이미지</h2>
                            <div className="border rounded-lg overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageUrl} alt="Uploaded preview" className="w-full object-contain" />
                            </div>
                            </div>
                        {/* 추출된 색상 팔레트 */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2">추출된 색상 팔레트</h2>
                            <div className="p-4 border rounded-lg bg-white space-y-2">
                                {/* 여기에 추출된 색상들이 표시될 예정입니다. */}
                                <p className="text-gray-400">이곳에 색상 팔레트가 표시됩니다.</p>
                            </div>
                            <button className="mt-4 w-full text-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700">
                                다시 선택
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}