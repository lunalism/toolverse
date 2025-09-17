// src/app/security/hash-generator/page.tsx (레이아웃 변경 및 버튼 교체)

"use client";

import { useState, useMemo } from 'react';
import { MD5, SHA1, SHA256, SHA512 } from 'crypto-js';
// shadcn/ui의 Button을 import 합니다.
import { Button } from '@/components/ui/button';
// shadcn/ui의 Textarea와 Select도 함께 사용하면 디자인 통일성이 더 좋아집니다.
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function HashGeneratorPage() {
    const [inputText, setInputText] = useState('hello world');
    const [algorithm, setAlgorithm] = useState('SHA256');
    const [copied, setCopied] = useState(false);

    const hashOutput = useMemo(() => { 
        /* ... 이전과 동일 ... */ 
        if (!inputText) return ''; 
        
        switch (algorithm) { 
            case 'MD5': 
                return MD5(inputText).toString(); 
            case 'SHA1': 
                return SHA1(inputText).toString(); 
            case 'SHA256': 
                return SHA256(inputText).toString(); 
            case 'SHA512': 
                return SHA512(inputText).toString(); 
            default: 
                return ''; 
        } 
    }, [inputText, algorithm]);

    const handleCopy = () => { 
        if (!hashOutput) return; 
        
        navigator.clipboard.writeText(hashOutput).then(() => { 
            setCopied(true); setTimeout(() => setCopied(false), 2000); 
        }); 
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">해시 생성기</h1>
                <p className="text-lg text-gray-600 mt-2">
                    텍스트를 MD5, SHA-1, SHA-256, SHA-512 해시로 변환합니다.
                </p>
            </div>

            {/* 👇 레이아웃을 2단 그리드로 변경합니다. */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1열: 원본 텍스트 */}
                <div className="space-y-2">
                    <label htmlFor="input-text" className="text-lg font-semibold">
                        원본 텍스트
                    </label>
                    <Textarea
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="해시로 변환할 텍스트를 입력하세요..."
                        className="w-full h-60 font-mono"
                    />
                </div>

                {/* 2열: 옵션 및 결과 */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="algorithm" className="text-lg font-semibold">
                            해시 알고리즘
                        </label>
                        {/* shadcn/ui Select 컴포넌트로 교체 */}
                        <Select value={algorithm} onValueChange={setAlgorithm}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="알고리즘 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MD5">MD5</SelectItem>
                                <SelectItem value="SHA1">SHA1</SelectItem>
                                <SelectItem value="SHA256">SHA256</SelectItem>
                                <SelectItem value="SHA512">SHA512</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="output-hash" className="text-lg font-semibold">
                            결과 해시
                        </label>
                        <div className="relative">
                            <div className="w-full min-h-[42px] p-3 pr-12 border border-gray-200 rounded-lg bg-gray-50 font-mono text-gray-700 text-sm break-all flex items-center">
                                {hashOutput || <span className="text-gray-400">해시 결과가 여기에 표시됩니다.</span>}
                            </div>
                            {/* 👇 shadcn/ui Button 컴포넌트로 교체 */}
                            <Button onClick={handleCopy} variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" title="Copy to clipboard">
                                {copied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}