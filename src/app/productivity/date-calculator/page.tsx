// src/app/productivity/date-calculator/page.tsx

"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
// 👇 date-fns와 우리가 만든 DatePicker를 import 합니다.
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';

type CalculatorMode = 'difference' | 'addSubtract' | 'workdays';

// '날짜 차이' 계산을 담당하는 컴포넌트
function DifferenceCalculator() {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>();

    const result = useMemo(() => {
        if (!startDate || !endDate) {
            return null;
        }
        // 날짜 순서가 바뀌어도 양수로 계산되도록 합니다.
        const start = startDate > endDate ? endDate : startDate;
        const end = startDate > endDate ? startDate : endDate;

        return {
            days: differenceInDays(end, start),
            weeks: differenceInWeeks(end, start),
            months: differenceInMonths(end, start),
            years: differenceInYears(end, start),
        };
    }, [startDate, endDate]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">두 날짜 사이의 차이 계산</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <DatePicker date={startDate} onDateChange={setStartDate} placeholder="시작 날짜를 선택하세요" />
                <DatePicker date={endDate} onDateChange={setEndDate} placeholder="종료 날짜를 선택하세요" />
            </div>
            {result && (
                <div>
                    <h3 className="font-semibold mb-4 text-lg">계산 결과:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-green-100 rounded-lg">
                            <div className="text-4xl font-bold text-green-800">{result.days.toLocaleString()}</div>
                            <div className="text-sm text-green-700">총 일수</div>
                        </div>
                        <div className="p-4 bg-blue-100 rounded-lg">
                            <div className="text-4xl font-bold text-blue-800">{result.weeks.toLocaleString()}</div>
                            <div className="text-sm text-blue-700">총 주</div>
                        </div>
                        <div className="p-4 bg-yellow-100 rounded-lg col-span-2 md:col-span-1">
                            <div className="text-4xl font-bold text-yellow-800">{result.years}년 {result.months % 12}개월</div>
                            <div className="text-sm text-yellow-700">년/개월</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DateCalculatorPage() {
    const [mode, setMode] = useState<CalculatorMode>('difference');

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">시간/날짜 계산기</h1>
                <p className="text-lg text-gray-600 mt-2">복잡한 시간 계산, 여기서 한 번에 해결하세요.</p>
            </div>
            
            <div className="flex justify-center mb-8 p-1 bg-gray-100 rounded-lg">
                <Button onClick={() => setMode('difference')} variant={mode === 'difference' ? 'secondary' : 'ghost'} className="flex-1">날짜 차이</Button>
                <Button onClick={() => setMode('addSubtract')} variant={mode === 'addSubtract' ? 'secondary' : 'ghost'} className="flex-1">날짜 더하기/빼기</Button>
                <Button onClick={() => setMode('workdays')} variant={mode === 'workdays' ? 'secondary' : 'ghost'} className="flex-1">업무일 계산</Button>
            </div>

            <div className="p-8 border rounded-xl bg-white shadow-lg min-h-[300px]">
                {mode === 'difference' && <DifferenceCalculator />}
                {mode === 'addSubtract' && <p className="text-gray-500">곧 추가될 기능입니다.</p>}
                {mode === 'workdays' && <p className="text-gray-500">곧 추가될 기능입니다.</p>}
            </div>
        </div>
    );
}