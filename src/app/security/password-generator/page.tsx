// src/app/security/password-generator/page.tsx (기본값 수정)

"use client";

import { useState, useEffect, useCallback } from 'react';

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(false);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // 👇 'password' 또는 'pin' 모드를 관리할 state 추가
    const [mode, setMode] = useState<'password' | 'pin'>('password');

    const generate = useCallback(() => {
        let charset = '';
        let newPassword = '';

        if (mode === 'password') {
            if (includeUppercase) charset += CHARSETS.uppercase;
            if (includeLowercase) charset += CHARSETS.lowercase;
            if (includeNumbers) charset += CHARSETS.numbers;
            if (includeSymbols) charset += CHARSETS.symbols;
            if (charset === '') {
                setPassword('옵션을 선택해주세요!');
                return;
            }
        } else { // mode === 'pin'
            charset = CHARSETS.numbers;
        }

        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            newPassword += charset[randomValues[i] % charset.length];
        }
        
        setPassword(newPassword);
        setCopied(false);
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, mode]);


    const handleCopy = () => { 
        /* ... 이전과 동일 ... */ 
        if (password && password !== '옵션을 선택해주세요!') { 
            navigator.clipboard.writeText(password).then(() => { 
                setCopied(true); setTimeout(() => setCopied(false), 2000); 
            }); 
        } 
    };

    // mode가 바뀔 때마다, 그리고 처음 로드될 때 비밀번호/PIN을 생성합니다.
    useEffect(() => {
        generate();
    }, [generate]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">
                    {mode === 'password' ? '비밀번호 생성기' : 'PIN 번호 생성기'}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    강력하고 안전한 비밀번호 또는 PIN 번호를 생성하세요.
                </p>
            </div>
        
            <div className="max-w-xl mx-auto">
                <div className="relative p-4 bg-gray-900 text-white rounded-lg flex items-center justify-between font-mono text-xl break-all">
                    <span>{password}</span>
                    <button onClick={handleCopy} className="text-gray-400 hover:text-white flex-shrink-0 ml-4">
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        )}
                    </button>
                </div>
                
                <button onClick={generate} className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                    새 {mode === 'password' ? '비밀번호' : 'PIN'} 생성
                </button>
        
                <div className="mt-6 p-6 border rounded-lg bg-white space-y-4 shadow-sm">
                    {/* 👇 모드 선택 UI 추가 */}
                    <div className="flex justify-end">
                        <div className="flex items-center p-1 bg-gray-200 rounded-lg">
                            <button onClick={() => setMode('password')} className={`px-4 py-1 rounded-md text-sm font-semibold ${mode === 'password' ? 'bg-white shadow' : 'text-gray-600'}`}>비밀번호</button>
                            <button onClick={() => setMode('pin')} className={`px-4 py-1 rounded-md text-sm font-semibold ${mode === 'pin' ? 'bg-white shadow' : 'text-gray-600'}`}>PIN</button>
                        </div>
                    </div>
        
                    <div>
                        <label htmlFor="length" className="flex justify-between text-sm font-medium">
                            <span>{mode === 'password' ? '비밀번호' : 'PIN'} 길이</span>
                            <span className="font-bold">{length}</span>
                        </label>
                        <input id="length" type="range" min={mode === 'password' ? 8 : 4} max={mode === 'password' ? 64 : 12} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2" />
                    </div>
            
                    {/* 👇 비밀번호 모드일 때만 옵션들을 보여줍니다. */}
                    {mode === 'password' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <label className="flex items-center">
                                <input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(p => !p)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2">대문자 (A-Z)</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(p => !p)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2">소문자 (a-z)</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(p => !p)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2">숫자 (0-9)</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(p => !p)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2">특수문자 (!@#$)</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}