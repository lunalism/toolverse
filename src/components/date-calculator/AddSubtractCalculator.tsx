// src/components/date-calculator/AddSubtractCalculator.tsx

"use client";

import { useState, useMemo } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { ko } from 'date-fns/locale';

// 👇 '날짜 더하기/빼기'를 담당하는 새로운 컴포넌트
export default function AddSubtractCalculator() {
    const [baseDate, setBaseDate] = useState<Date | undefined>(new Date());
    const [amount, setAmount] = useState<number>(10);
    const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
    const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  
    const resultDate = useMemo(() => {
        if (!baseDate || isNaN(amount)) return null;
        
        const operations = {
            add: { days: addDays, weeks: addWeeks, months: addMonths, years: addYears },
            subtract: { days: subDays, weeks: subWeeks, months: subMonths, years: subYears },
        };
    
        return operations[operation][unit](baseDate, amount);
    }, [baseDate, amount, unit, operation]);
  
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">특정 날짜에서 더하거나 빼기</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 items-end">
                <div className="space-y-1">
                    <Label>기준 날짜</Label>
                    <DatePicker date={baseDate} onDateChange={setBaseDate} placeholder="기준 날짜 선택" />
                </div>
                <div className="flex items-end gap-2">
                    <div className="flex-grow space-y-1">
                        <Label>기간</Label>
                        <Input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)} />
                    </div>
                    {/* 👇 Select의 onValueChange에서 any를 제거하고 정확한 타입을 명시합니다. */}
                    <Select value={unit} onValueChange={(value: 'days' | 'weeks' | 'months' | 'years') => setUnit(value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="days">일</SelectItem>
                            <SelectItem value="weeks">주</SelectItem>
                            <SelectItem value="months">개월</SelectItem>
                            <SelectItem value="years">년</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* 👇 ToggleGroup의 onValueChange에서 any를 제거하고 정확한 타입을 명시합니다. */}
                    <ToggleGroup type="single" value={operation} onValueChange={(value: 'add' | 'subtract') => { if (value) setOperation(value); }} variant="outline">
                        <ToggleGroupItem value="add">+</ToggleGroupItem>
                        <ToggleGroupItem value="subtract">-</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
            {resultDate && (
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                    <h3 className="font-semibold mb-2 text-lg text-blue-800">계산 결과:</h3>
                    <p className="text-4xl font-bold text-blue-900">{format(resultDate, 'PPP', { locale: ko })}</p>
                    <p className="text-md text-blue-700 mt-1">{format(resultDate, 'EEEE', { locale: ko })}</p>
                </div>
            )}
        </div>
    );
}