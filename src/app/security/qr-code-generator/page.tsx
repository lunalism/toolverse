// src/app/security/qr-code-generator/page.tsx

"use client";

import { useState } from 'react';

export default function QrCodeGeneratorPage() {
    const [text, setText] = useState('https://github.com/lunalism/toolverse');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">QR코드 생성기</h1>
                <p className="text-lg text-gray-600 mt-2">
                    URL이나 텍스트를 입력하면 실시간으로 QR코드가 생성됩니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 컨트롤 패널 (왼쪽) */}
                <div className="space-y-4">
                    <label htmlFor="qr-text" className="block text-lg font-semibold">
                        데이터 (URL 또는 텍스트)
                    </label>
                    <textarea
                        id="qr-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="https://..."
                        className="w-full h-48 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {/* 여기에 색상, 크기 등 다른 옵션들이 추가될 수 있습니다. */}
                </div>

                {/* QR코드 미리보기 (오른쪽) */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-6 border rounded-lg bg-white shadow-sm">
                        {/* 여기에 qrcode.react 컴포넌트가 들어올 예정입니다. */}
                        <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-400">QR Code Preview</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700">
                        PNG로 다운로드
                    </button>
                </div>
            </div>
        </div>
    );
}