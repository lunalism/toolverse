// src/app/security/password-generator/page.tsx

"use client";

import { useState } from 'react';

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('P@$$w0rd!');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">비밀번호 생성기</h1>
                <p className="text-lg text-gray-600 mt-2">
                강력하고 안전한 비밀번호를 생성하여 당신의 계정을 보호하세요.
                </p>
            </div>

            <div className="max-w-xl mx-auto">
                {/* 결과 창 */}
                <div className="relative p-4 bg-gray-900 text-white rounded-lg flex items-center justify-between font-mono text-xl">
                    <span>{password}</span>
                    <button className="text-gray-400 hover:text-white">
                        {/* 복사 아이콘 */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>

                {/* 생성 버튼 */}
                <button className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                    새 비밀번호 생성
                </button>

                {/* 옵션 */}
                <div className="mt-6 p-6 border rounded-lg bg-white space-y-4">
                    <div>
                        <label htmlFor="length" className="flex justify-between text-sm font-medium">
                        <span>비밀번호 길이</span>
                        <span>{length}</span>
                        </label>
                        <input
                        id="length"
                        type="range"
                        min="8"
                        max="64"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center"><input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(p => !p)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" /> <span className="ml-2">대문자 (A-Z)</span></label>
                        <label className="flex items-center"><input type="checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(p => !p)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" /> <span className="ml-2">소문자 (a-z)</span></label>
                        <label className="flex items-center"><input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(p => !p)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" /> <span className="ml-2">숫자 (0-9)</span></label>
                        <label className="flex items-center"><input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(p => !p)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" /> <span className="ml-2">특수문자 (!@#$)</span></label>
                    </div>
                </div>
            </div>
        </div>
    );
}