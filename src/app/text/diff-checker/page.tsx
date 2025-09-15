// src/app/text/diff-checker/page.tsx (단어 단위 하이라이트)

"use client";

import { useState, useMemo } from 'react';
// 👇 diffWords를 import 합니다.
import { diffWords } from 'diff';

export default function DiffCheckerPage() {
    const [textA, setTextA] = useState('');
    const [textB, setTextB] = useState('');

    const differences = useMemo(() => {
        // 👇 diffLines 대신 diffWords를 사용합니다.
        return diffWords(textA, textB);
    }, [textA, textB]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">텍스트 비교</h1>
                <p className="text-lg text-gray-600 mt-2">
                    두 개의 텍스트를 비교하여 차이점을 확인하세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                    value={textA}
                    onChange={(e) => setTextA(e.target.value)}
                    placeholder="원본 텍스트를 여기에 붙여넣으세요..."
                    className="w-full h-70 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                placeholder="새로운 텍스트를 여기에 붙여넣으세요..."
                className="w-full h-70 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">차이점 결과:</h2>
                <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                    {/* 👇 결과를 렌더링하는 방식을 단어 조각에 맞게 수정합니다. */}
                    <pre className="p-4 text-base whitespace-pre-wrap font-mono leading-relaxed">
                        {differences.map((part, index) => {
                            const style = part.added ? { backgroundColor: '#dbfadc', color: '#256333' } :
                                            part.removed ? { backgroundColor: '#fde2e2', color: '#991b1b', textDecoration: 'line-through' } :
                                            { color: '#6b7280' };
                            
                            return (
                                <span key={index} style={style}>
                                    {part.value}
                                </span>
                            );
                        })}
                    </pre>
                </div>
            </div>
        </div>
    );
}