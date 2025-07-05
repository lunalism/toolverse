'use client'

import { useState } from 'react'
import { CalendarIcon, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, differenceInYears, differenceInDays, differenceInMonths, differenceInCalendarDays, isBefore, addYears } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function AgeCalculator() {
    const [birthDate, setBirthDate] = useState<Date | undefined>()
    const [targetDate, setTargetDate] = useState<Date>(new Date())

    const years = birthDate ? differenceInYears(targetDate, birthDate) : null
    const months = birthDate ? differenceInMonths(targetDate, birthDate) % 12 : null
    const days = birthDate ? differenceInCalendarDays(targetDate, addYears(birthDate, years ?? 0)) % 30 : null
    const totalDays = birthDate ? differenceInDays(targetDate, birthDate) : null
    const totalHours = totalDays !== null ? totalDays * 24 : null
    const totalMinutes = totalHours !== null ? totalHours * 60 : null

    const nextBirthday =
        birthDate && years !== null
        ? addYears(birthDate, years + (isBefore(targetDate, addYears(birthDate, years)) ? 0 : 1))
        : null

    const daysUntilBirthday =
        nextBirthday !== null ? differenceInDays(nextBirthday, targetDate) : null

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">🎂 나이 계산기</h1>
                <p className="text-muted-foreground mt-2">
                    생년월일과 기준일을 선택하면 만 나이, 생일 요일, D-Day를 계산해드려요.
                </p>
            </div>

            <div className="flex justify-center gap-4 mb-8 flex-col sm:flex-row">
                <div>
                    <p className="text-sm font-medium mb-1">내 생일</p>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {birthDate ? format(birthDate, 'yyyy. MM. dd.') : <span>생년월일 선택</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear()} locale={ko} />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <p className="text-sm font-medium mb-1">기준 일자</p>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {targetDate ? format(targetDate, 'yyyy. MM. dd.') : <span>기준 날짜 선택</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={targetDate} onSelect={(date) => date && setTargetDate(date)} captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear() + 10} locale={ko} />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {birthDate && (
                <div className="space-y-8">
                    <div className="rounded-xl bg-[#F3F4F6] p-6">
                        <h2 className="text-lg font-semibold text-[#2563EB] mb-4">당신의 나이</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#E0F2FE] p-4 rounded-lg shadow text-center">
                            <div className="text-3xl font-bold text-[#2563EB]">{years}</div>
                            <div className="mt-1 text-sm">년</div>
                        </div>
                        <div className="bg-[#D1FAE5] p-4 rounded-lg shadow text-center">
                            <div className="text-3xl font-bold text-[#059669]">{months}</div>
                            <div className="mt-1 text-sm">개월</div>
                        </div>
                        <div className="bg-[#F3E8FF] p-4 rounded-lg shadow text-center">
                            <div className="text-3xl font-bold text-[#9333EA]">{days}</div>
                            <div className="mt-1 text-sm">일</div>
                        </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 bg-[#FEF9C3]">
                            <p className="text-sm text-gray-600">총 일수</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-2xl font-bold">{totalDays?.toLocaleString()}</p>
                                <Button size="icon" variant="ghost"><Copy className="w-4 h-4" /></Button>
                            </div>
                        </div>
                        <div className="border rounded-lg p-4 bg-[#E0E7FF]">
                            <p className="text-sm text-gray-600">총 시간</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-2xl font-bold">{totalHours?.toLocaleString()}</p>
                                <Button size="icon" variant="ghost"><Copy className="w-4 h-4" /></Button>
                            </div>
                        </div>
                        <div className="border rounded-lg p-4 bg-[#FFE4E6]">
                            <p className="text-sm text-gray-600">총 분</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-2xl font-bold">{totalMinutes?.toLocaleString()}</p>
                                <Button size="icon" variant="ghost"><Copy className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#F5EDED] p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-[#BE185D] mb-2">다음 생일</h2>
                            <p className="text-sm text-muted-foreground mb-1">다음 생일 날짜</p>
                            <div className="text-xl font-bold mb-2">{nextBirthday ? format(nextBirthday, 'yyyy. MM. dd.') : '-'}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground mb-1">남은 일수</p>
                            <p className="text-3xl font-bold text-[#8B5CF6]">
                                {daysUntilBirthday !== null && daysUntilBirthday >= 0 ? `${daysUntilBirthday}` : ''}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
