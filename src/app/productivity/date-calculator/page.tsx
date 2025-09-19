// src/app/productivity/date-calculator/page.tsx

"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
    format, 
    differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears,
    addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears,
    addBusinessDays
 } from 'date-fns';
 import { X } from 'lucide-react';


type CalculatorMode = 'difference' | 'addSubtract' | 'workdays' | 'multi-difference';

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

// 👇 '날짜 더하기/빼기'를 담당하는 새로운 컴포넌트
function AddSubtractCalculator() {
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
                    <p className="text-4xl font-bold text-blue-900">{format(resultDate, 'PPP')}</p>
                    <p className="text-md text-blue-700 mt-1">{format(resultDate, 'EEEE')}</p>
                </div>
            )}
        </div>
    );
}

// 👇 '업무일 계산'을 담당하는 새로운 컴포넌트
function WorkdayCalculator() {
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
                    <p className="text-4xl font-bold text-green-900">{format(resultDate, 'PPP')}</p>
                    <p className="text-md text-green-700 mt-1">{format(resultDate, 'EEEE')}</p>
                </div>
            )}
        </div>
    );
}

// 각 계산 라인의 타입을 정의합니다.
type DatePair = {
    id: string;
    startDate?: Date;
    endDate?: Date;
}

function MultiDifferenceCalculator() {
    // state를 DatePair의 배열로 변경합니다.
    const [datePairs, setDatePairs] = useState<DatePair[]>([
        { id: crypto.randomUUID(), startDate: new Date(), endDate: undefined }
    ]);
  
    // 날짜 변경 핸들러
    const handleDateChange = (id: string, dateType: 'startDate' | 'endDate', newDate: Date | undefined) => {
        setDatePairs(
            datePairs.map(pair => 
                pair.id === id ? { ...pair, [dateType]: newDate } : pair
            )
        );
    };
  
    // 계산 라인 추가 핸들러
    const handleAddRow = () => {
        setDatePairs([...datePairs, { id: crypto.randomUUID(), startDate: undefined, endDate: undefined }]);
    };
  
    // 계산 라인 삭제 핸들러
    const handleRemoveRow = (id: string) => {
        setDatePairs(datePairs.filter(pair => pair.id !== id));
    };
  
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">여러 날짜 사이의 차이 계산</h2>
            <p className="text-sm text-gray-500 mb-4">여러 개의 독립적인 날짜 구간의 차이를 한 번에 계산합니다.</p>
            
            {/* 👇 UI 레이아웃을 수정합니다. */}
            <div className="space-y-3 mb-6">
                {datePairs.map((pair) => {
                    const result = (pair.startDate && pair.endDate) 
                        ? differenceInDays(
                            pair.startDate > pair.endDate ? pair.startDate : pair.endDate, 
                            pair.startDate > pair.endDate ? pair.endDate : pair.startDate
                        ) 
                        : null;
            
                    return (
                        <div key={pair.id} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-grow min-w-[200px]">
                                <DatePicker date={pair.startDate} onDateChange={(newDate) => handleDateChange(pair.id, 'startDate', newDate)} placeholder="시작 날짜" />
                            </div>
                            <span className="text-gray-500">~</span>
                            <div className="flex-grow min-w-[200px]">
                                <DatePicker date={pair.endDate} onDateChange={(newDate) => handleDateChange(pair.id, 'endDate', newDate)} placeholder="종료 날짜" />
                            </div>
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <span className="hidden sm:inline">→</span>
                                <span>{result !== null ? `${result.toLocaleString()} 일` : `...`}</span>
                            </div>
                            
                            {datePairs.length > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(pair.id)} className="flex-shrink-0 text-gray-500 hover:text-red-500">
                                <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
            <Button onClick={handleAddRow} variant="outline" className="w-full">
                계산할 날짜 쌍 추가
            </Button>
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