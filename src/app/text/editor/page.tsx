// src/app/text/editor/page.tsx (최종 로직 구현)

"use client";

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function TextEditorPage() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    // 각 버튼에 연결될 핸들러 함수들
    const handleUppercase = () => setText(text.toUpperCase());
    const handleLowercase = () => setText(text.toLowerCase());
    
    const handleSentenceCase = () => {
        setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()));
    };

    const handleSortLines = () => {
        setText(text.split('\n').sort().join('\n'));
    };

    const handleRemoveDuplicates = () => {
        // new Set을 사용해 중복을 간단히 제거합니다.
        setText([...new Set(text.split('\n'))].join('\n'));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleClear = () => setText('');


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">만능 텍스트 편집기</h1>
                <p className="text-lg text-gray-600 mt-2">
                간단한 텍스트 조작을 버튼 클릭 한 번으로 해결하세요.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="p-2 bg-gray-100 rounded-t-lg border-b border-gray-200 flex flex-wrap items-center gap-2">
                    {/* 👇 각 버튼에 onClick 이벤트를 연결합니다. */}
                    <Button onClick={handleUppercase} className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">UPPERCASE</Button>
                    <Button onClick={handleLowercase} className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">lowercase</Button>
                    <Button onClick={handleSentenceCase} className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">Sentence case</Button>
                    <Button onClick={handleSortLines} className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">Sort Lines A-Z</Button>
                    <Button onClick={handleRemoveDuplicates} className="px-3 py-1 text-sm bg-white rounded shadow-sm hover:bg-gray-50 border text-gray-800">Remove Duplicates</Button>
                    
                    {/* 👇 복사하기, 지우기 버튼을 추가하고 공간을 분리합니다. */}
                    <div className="flex-grow">
                        
                    </div>
                        <Button onClick={handleCopy} className="px-3 py-1 text-sm bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 border border-blue-600">{copied ? 'Copied!' : 'Copy'}</Button>
                        <Button onClick={handleClear} className="px-3 py-1 text-sm bg-red-500 text-white rounded shadow-sm hover:bg-red-600 border border-red-600">Clear</Button>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
                    className="w-full h-160 p-4 border-x border-b border-gray-300 rounded-b-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>
    );
}