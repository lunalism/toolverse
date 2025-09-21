// src/components/date-calculator/DifferenceCalculator.tsx
"use client";

import { useState, useMemo } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

// '날짜 차이' 계산을 담당하는 컴포넌트
export default function DifferenceCalculator() {
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