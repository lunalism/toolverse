// src/app/text/counter/page.tsx

"use client";

import { useState, useMemo } from 'react';

export default function CounterPage() {
    const [text, setText] = useState('');

    // text state가 바뀔 때마다 자동으로 재계산됩니다.
    const stats = useMemo(() => {
        const trimmedText = text.trim();
        const characters = text.length;
        const charactersWithoutSpaces = text.replace(/\s/g, '').length;
        // 정규식을 사용해 더 정확하게 단어를 셉니다.
        const words = trimmedText ? (trimmedText.match(/[\w'-]+/g)?.length ?? 0) : 0;
        const lines = text.length > 0 ? text.split('\n').length : 0;
        const paragraphs = trimmedText ? trimmedText.split(/\n\s*\n/).filter(p => p.trim() !== '').length : 0;
        
        return { characters, charactersWithoutSpaces, words, lines, paragraphs };
    }, [text]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">글자 수 / 단어 수 세기</h1>
                <p className="text-lg text-gray-600 mt-2">
                    텍스트를 입력하면 실시간으로 분석 결과를 알려드립니다.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                
                {/* 분석 결과 */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 text-center">
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <div className="text-3xl font-bold">{stats.characters}</div>
                        <div className="text-sm text-gray-600">글자 (공백 포함)</div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <div className="text-3xl font-bold">{stats.charactersWithoutSpaces}</div>
                        <div className="text-sm text-gray-600">글자 (공백 제외)</div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <div className="text-3xl font-bold">{stats.words}</div>
                        <div className="text-sm text-gray-600">단어</div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <div className="text-3xl font-bold">{stats.lines}</div>
                        <div className="text-sm text-gray-600">줄</div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <div className="text-3xl font-bold">{stats.paragraphs}</div>
                        <div className="text-sm text-gray-600">문단</div>
                    </div>
                </div>
            </div>
        </div>
    );
}