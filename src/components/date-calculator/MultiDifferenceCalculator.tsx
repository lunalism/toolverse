// src/components/date-calculator/MultiDifferenceCalculator.tsx
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { format, differenceInDays } from 'date-fns';
import { X } from 'lucide-react';
import { ko } from 'date-fns/locale';

// 각 계산 라인의 타입을 정의합니다. (color 속성 추가)
type CalculationRow = {
    id: string;
    startDate?: Date;
    endDate?: Date;
    color: string;
}

const ROW_COLORS = [
    '#ef4444', '#f97316', '#eab308', '#84cc16',
    '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
];

export default function MultiDifferenceCalculator() {
    const [rows, setRows] = useState<CalculationRow[]>([
        { id: crypto.randomUUID(), startDate: new Date(), endDate: undefined, color: ROW_COLORS[0] }
    ]);
  
    const handleDateChange = (id: string, dateType: 'startDate' | 'endDate', newDate: Date | undefined) => {
        setRows(rows.map(row => row.id === id ? { ...row, [dateType]: newDate } : row));
    };
  
    const handleAddRow = () => {
        if (rows.length >= 8) return; // 8개 제한
        setRows([...rows, {
            id: crypto.randomUUID(),
            startDate: undefined,
            endDate: undefined,
            color: ROW_COLORS[rows.length % ROW_COLORS.length]
        }]);
    };
  
    const handleRemoveRow = (id: string) => {
        setRows(rows.filter(row => row.id !== id));
    };
    
    const results = useMemo(() => {
        return rows.map(row => {
            if (row.startDate && row.endDate) {
                const start = row.startDate > row.endDate ? row.endDate : row.startDate;
                const end = row.startDate > row.endDate ? row.startDate : row.endDate;
                return {
                    id: row.id,
                    color: row.color,
                    days: differenceInDays(end, start),
                    from: format(start, 'PPP', { locale: ko }),
                    to: format(start, 'PPP', { locale: ko }),
                };
            }
            return { id: row.id, color: row.color, days: null, from: '', to: '' };
        }).filter(res => res.days !== null);
    }, [rows]);
  
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">여러 날짜 사이의 차이 계산</h2>
            
            {/* 입력 영역 */}
            <div className="space-y-3 mb-6">
                {rows.map((row, index) => (
                    <div key={row.id} className="flex items-center gap-2 p-2 pr-1 border-l-4" style={{ borderColor: row.color }}>
                        <div className="flex-grow">
                            <DatePicker date={row.startDate} onDateChange={(newDate) => handleDateChange(row.id, 'startDate', newDate)} placeholder={`시작 날짜 ${index + 1}`} />
                        </div>
                        <span className="text-gray-500">~</span>
                        <div className="flex-grow">
                            <DatePicker date={row.endDate} onDateChange={(newDate) => handleDateChange(row.id, 'endDate', newDate)} placeholder={`종료 날짜 ${index + 1}`} />
                        </div>
                        {rows.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(row.id)} className="flex-shrink-0 text-gray-500 hover:text-red-500">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            <Button onClick={handleAddRow} variant="outline" className="w-full" disabled={rows.length >= 8}>
                계산할 날짜 쌍 추가 ({rows.length}/8)
            </Button>
            
            {/* 결과 영역 */}
            {results.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-semibold mb-4 text-lg">계산 결과:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {results.map((res) => (
                            <div key={res.id} className="flex flex-col p-4 rounded-lg" style={{ backgroundColor: `${res.color}20` }}>
                                <span className="text-xs font-mono" style={{ color: res.color }}>{res.from}</span>
                                <span className="text-xs font-mono mb-2" style={{ color: res.color }}>→ {res.to}</span>
                                <span className="text-3xl font-bold" style={{ color: res.color }}>{res.days?.toLocaleString()} 일</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}