// src/app/security/hash-generator/page.tsx

"use client";

import { useState } from 'react';

export default function HashGeneratorPage() {
    const [inputText, setInputText] = useState('');
    const [algorithm, setAlgorithm] = useState('SHA256');
    const [hashOutput, setHashOutput] = useState('');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">해시 생성기</h1>
                <p className="text-lg text-gray-600 mt-2">
                    텍스트를 MD5, SHA-1, SHA-256, SHA-512 해시로 변환합니다.
                </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                {/* 입력 영역 */}
                <div>
                    <label htmlFor="input-text" className="block text-lg font-semibold mb-2">
                        원본 텍스트
                    </label>
                    <textarea
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="해시로 변환할 텍스트를 입력하세요..."
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                </div>

                {/* 알고리즘 선택 */}
                <div>
                    <label htmlFor="algorithm" className="block text-lg font-semibold mb-2">
                        해시 알고리즘
                    </label>
                    <select
                        id="algorithm"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="MD5">MD5</option>
                        <option value="SHA1">SHA1</option>
                        <option value="SHA256">SHA256</option>
                        <option value="SHA512">SHA512</option>
                    </select>
                </div>

                {/* 결과 영역 */}
                <div>
                    <label htmlFor="output-hash" className="block text-lg font-semibold mb-2">
                        결과 해시
                    </label>
                    <div className="relative">
                        <input
                            id="output-hash"
                            type="text"
                            readOnly
                            value={hashOutput}
                            placeholder="해시 결과가 여기에 표시됩니다."
                            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-gray-700"
                        />
                        <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                            {/* 복사 아이콘 */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}