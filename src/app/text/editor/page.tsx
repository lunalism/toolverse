// src/app/text/editor/page.tsx

"use client";

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function TextEditorPage() {
    const [text, setText] = useState('');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">만능 텍스트 편집기</h1>
                <p className="text-lg text-gray-600 mt-2">
                    간단한 텍스트 조작을 버튼 클릭 한 번으로 해결하세요.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* 액션 버튼 툴바 */}
                <div className="p-2 bg-gray-100 rounded-t-lg border-b border-gray-200 flex flex-wrap gap-2">
                    <Button className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">UPPERCASE</Button>
                    <Button className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">lowercase</Button>
                    <Button className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">Sentence case</Button>
                    <Button className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">Sort Lines A-Z</Button>
                    <Button className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">Remove Duplicates</Button>
                </div>

                {/* 텍스트 입력 영역 */}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
                    className="w-full h-160 p-4 border border-gray-300 rounded-b-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>
    );
}