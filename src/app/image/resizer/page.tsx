// src/app/image/resizer/page.tsx

"use client";

import { useState } from 'react';

export default function ImageResizerPage() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">이미지 사이즈 변환</h1>
                <p className="text-lg text-gray-600 mt-2">
                이미지 크기를 조절하고 원하는 포맷으로 저장하세요.
                </p>
            </div>

            {/* 파일 업로드 UI */}
            {!originalFile && (
                <div className="w-full max-w-2xl mx-auto">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <p>이미지 파일을 이곳에 드롭하거나 클릭하여 업로드하세요</p>
                        <input id="file-upload" type="file" className="hidden" accept="image/*" />
                    </label>
                </div>
            )}

            {/* 이미지 리사이징 작업 UI */}
            {originalFile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 원본 이미지 미리보기 */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">원본 이미지</h2>
                        <div className="border rounded-lg p-4 bg-gray-50">
                            {/* 여기에 원본 이미지가 표시될 예정입니다. */}
                            <p>{originalFile.name}</p>
                        </div>
                    </div>
                
                    {/* 리사이징 옵션 및 결과 미리보기 */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">리사이징 옵션</h2>
                        <div className="border rounded-lg p-4 bg-white space-y-4">
                            {/* 여기에 가로/세로 입력창, 비율 유지 옵션 등이 들어갈 예정입니다. */}
                            <p>옵션 영역</p>
                            <button className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                                사이즈 변환
                            </button>
                        </div>
                        
                        <h2 className="text-lg font-semibold mt-6">변환된 이미지</h2>
                        <div className="border rounded-lg p-4 bg-gray-50">
                            {/* 여기에 변환된 이미지가 표시될 예정입니다. */}
                            <p>결과 미리보기 영역</p>
                            <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90">
                                다운로드
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}