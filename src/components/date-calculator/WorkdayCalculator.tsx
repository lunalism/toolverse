// src/components/date-calculator/WorkdayCalculator.tsx

"use client";

import { useState, useMemo } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, addBusinessDays } from 'date-fns';
import { ko } from 'date-fns/locale';

// 👇 '업무일 계산'을 담당하는 새로운 컴포넌트
export default function WorkdayCalculator() {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [businessDays, setBusinessDays] = useState<number>(5);
  
    const resultDate = useMemo(() => {
        if (!startDate || isNaN(businessDays)) return null;
        return addBusinessDays(startDate, businessDays);
    }, [startDate, businessDays]);
  
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">업무일 기준 날짜 계산</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 items-end">
                <div className="space-y-1">
                    <Label>시작 날짜</Label>
                    <DatePicker date={startDate} onDateChange={setStartDate} placeholder="시작 날짜 선택" />
                </div>
                <div className="space-y-1">
                    <Label>더할 업무일</Label>
                    <Input type="number" value={businessDays} onChange={(e) => setBusinessDays(parseInt(e.target.value, 10) || 0)} />
                </div>
            </div>
            {resultDate && (
                <div className="p-6 bg-green-100 rounded-lg text-center">
                    <h3 className="font-semibold mb-2 text-lg text-green-800">계산 결과 (주말 제외):</h3>
                    <p className="text-4xl font-bold text-green-900">{format(resultDate, 'PPP', { locale: ko })}</p>
                    <p className="text-md text-green-700 mt-1">{format(resultDate, 'EEEE', { locale: ko })}</p>
                </div>
            )}
        </div>
    );
}