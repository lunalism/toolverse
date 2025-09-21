// src/app/productivity/date-calculator/page.tsx

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 👇 분리된 컴포넌트들을 import 합니다.
import DifferenceCalculator from '@/components/date-calculator/DifferenceCalculator';
import AddSubtractCalculator from '@/components/date-calculator/AddSubtractCalculator';
import WorkdayCalculator from '@/components/date-calculator/WorkdayCalculator';
import MultiDifferenceCalculator from '@/components/date-calculator/MultiDifferenceCalculator';

type CalculatorMode = 'difference' | 'addSubtract' | 'workdays' | 'multi-difference';

export default function DateCalculatorPage() {
    const [mode, setMode] = useState<CalculatorMode>('difference');

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">시간/날짜 계산기</h1>
                <p className="text-lg text-gray-600 mt-2">복잡한 시간 계산, 여기서 한 번에 해결하세요.</p>
            </div>
            
            <div className="flex justify-center mb-8 p-1 bg-gray-200 rounded-lg">
                <Button onClick={() => setMode('difference')} variant={mode === 'difference' ? 'secondary' : 'ghost'} className="flex-1">날짜 차이</Button>
                <Button onClick={() => setMode('addSubtract')} variant={mode === 'addSubtract' ? 'secondary' : 'ghost'} className="flex-1">날짜 더하기/빼기</Button>
                <Button onClick={() => setMode('workdays')} variant={mode === 'workdays' ? 'secondary' : 'ghost'} className="flex-1">업무일 계산</Button>
                <Button onClick={() => setMode('multi-difference')} variant={mode === 'multi-difference' ? 'secondary' : 'ghost'} className="flex-1 text-xs sm:text-sm">여러 날짜 차이</Button>
            </div>

            <div className="p-8 border rounded-xl bg-white shadow-lg min-h-[300px]">
                {mode === 'difference' && <DifferenceCalculator />}
                {mode === 'addSubtract' && <AddSubtractCalculator />}
                {mode === 'workdays' && <WorkdayCalculator />}
                {mode === 'multi-difference' && <MultiDifferenceCalculator />}
            </div>
        </div>
    );
}