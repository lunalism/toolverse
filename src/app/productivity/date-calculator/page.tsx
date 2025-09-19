// src/app/productivity/date-calculator/page.tsx

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 각 계산기 모드의 타입을 정의합니다.
type CalculatorMode = 'difference' | 'addSubtract' | 'workdays';

export default function DateCalculatorPage() {
    const [mode, setMode] = useState<CalculatorMode>('difference');

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">시간/날짜 계산기</h1>
                <p className="text-lg text-gray-600 mt-2">
                    복잡한 시간 계산, 여기서 한 번에 해결하세요.
                </p>
            </div>
            
            {/* 모드 전환 버튼 */}
            <div className="flex justify-center mb-8 p-1 bg-gray-100 rounded-lg">
                <Button onClick={() => setMode('difference')} variant={mode === 'difference' ? 'secondary' : 'ghost'} className="flex-1">날짜 차이</Button>
                <Button onClick={() => setMode('addSubtract')} variant={mode === 'addSubtract' ? 'secondary' : 'ghost'} className="flex-1">날짜 더하기/빼기</Button>
                <Button onClick={() => setMode('workdays')} variant={mode === 'workdays' ? 'secondary' : 'ghost'} className="flex-1">업무일 계산</Button>
            </div>

            {/* 선택된 모드에 따라 다른 UI를 보여줍니다. */}
            <div className="p-8 border rounded-xl bg-white shadow-lg">
                {mode === 'difference' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">두 날짜 사이의 차이 계산</h2>
                        {/* 여기에 '날짜 차이' 계산기 UI가 들어갑니다. */}
                        <p className="text-gray-500">날짜 1, 날짜 2 입력창 및 결과 표시 영역</p>
                    </div>
                )}
                {mode === 'addSubtract' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">특정 날짜에서 더하거나 빼기</h2>
                        {/* 여기에 '날짜 더하기/빼기' 계산기 UI가 들어갑니다. */}
                        <p className="text-gray-500">기준 날짜, 더할 기간 입력창 및 결과 표시 영역</p>
                    </div>
                )}
                {mode === 'workdays' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">업무일 기준 날짜 계산</h2>
                        {/* 여기에 '업무일 계산' 계산기 UI가 들어갑니다. */}
                        <p className="text-gray-500">기준 날짜, 더할 업무일 입력창 및 결과 표시 영역</p>
                    </div>
                )}
            </div>
        </div>
    );
}