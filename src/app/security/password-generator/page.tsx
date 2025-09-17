"use client";

import { useState, useEffect, useCallback } from 'react';
// 👇 필요한 모든 shadcn/ui 컴포넌트들을 import 합니다.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
    const [mode, setMode] = useState<'password' | 'pin'>('password');

    const generate = useCallback(() => {
        let charset = '';
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

        let newPassword = '';
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            newPassword += charset[randomValues[i] % charset.length];
        }
        
        setPassword(newPassword);
        setCopied(false);
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, mode]);

    const handleCopy = () => {
        if (password && password !== '옵션을 선택해주세요!') {
            navigator.clipboard.writeText(password).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

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
                <div className="relative flex items-center">
                    <Input readOnly value={password} className="pr-12 font-mono text-xl h-14" />
                    <Button 
                        onClick={handleCopy} 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1/2 right-1 -translate-y-1/2 h-10 w-10 text-gray-400 hover:text-gray-700"
                    >
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        )}
                    </Button>
                </div>
                
                <Button onClick={generate} size="lg" className="w-full mt-4">
                    새 {mode === 'password' ? '비밀번호' : 'PIN'} 생성
                </Button>

                <div className="mt-6 p-6 border rounded-lg bg-white space-y-6 shadow-sm">
                    <div className="flex justify-end">
                        <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                            <Button onClick={() => setMode('password')} variant={mode === 'password' ? 'secondary' : 'ghost'} size="sm">비밀번호</Button>
                            <Button onClick={() => setMode('pin')} variant={mode === 'pin' ? 'secondary' : 'ghost'} size="sm">PIN</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="length" className="flex justify-between">
                        <span>{mode === 'password' ? '비밀번호' : 'PIN'} 길이</span>
                        <span className="font-bold">{length}</span>
                        </Label>
                        <Slider
                        id="length"
                        min={mode === 'password' ? 8 : 4}
                        max={mode === 'password' ? 64 : 12}
                        step={1}
                        value={[length]}
                        onValueChange={(value) => setLength(value[0])}
                        />
                    </div>

                    {mode === 'password' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))} />
                            <Label htmlFor="uppercase" className="cursor-pointer">대문자 (A-Z)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))} />
                            <Label htmlFor="lowercase" className="cursor-pointer">소문자 (a-z)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))} />
                            <Label htmlFor="numbers" className="cursor-pointer">숫자 (0-9)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))} />
                            <Label htmlFor="symbols" className="cursor-pointer">특수문자 (!@#$)</Label>
                        </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}