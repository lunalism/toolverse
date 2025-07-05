'use client'

import { useState } from 'react'
import { CalendarIcon, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, differenceInDays, differenceInHours, differenceInMinutes, intervalToDuration, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function DateDiffCalculator() {
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())

    const totalDays = startDate && endDate ? differenceInDays(endDate, startDate) : null
    const totalHours = totalDays !== null ? differenceInHours(endDate!, startDate!) : null
    const totalMinutes = totalHours !== null ? differenceInMinutes(endDate!, startDate!) : null

    const duration = startDate && endDate ? intervalToDuration({ start: startDate, end: endDate }) : null

    const years = duration?.years || 0
    const months = duration?.months || 0
    const days = duration?.days || 0

    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const startDayName = startDate ? dayNames[getDay(startDate)] : ''
    const endDayName = endDate ? dayNames[getDay(endDate)] : ''

    const dDayText = totalDays !== null ? (totalDays > 0 ? `D+${totalDays}` : totalDays < 0 ? `D${totalDays}` : 'D-DAY') : ''

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">📅 날짜 차이 계산기</h1>
                <p className="text-muted-foreground mt-2">두 날짜를 선택하면 전체 기간 차이를 계산해드려요.</p>
            </div>

            <div className="flex justify-center gap-4 mb-8 flex-col sm:flex-row">
                <div>
                    <p className="text-sm font-medium mb-1">시작 날짜</p>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, 'yyyy. MM. dd.') : <span>날짜 선택</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear() + 10}
                                locale={ko}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <p className="text-sm font-medium mb-1">종료 날짜</p>
                    <Popover>
                        <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, 'yyyy. MM. dd.') : <span>날짜 선택</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) => date && setEndDate(date)}
                                    captionLayout="dropdown"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear() + 10}
                                    locale={ko}
                                />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {startDate && endDate && (
                <div className="space-y-8">
                    {/* ➕ 설명 문구 추가 */}
                    <div className="text-start text-base font-medium text-muted-foreground">
                        {`📌 기준일로부터 종료일까지는 다음과 같습니다:`}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#E0F2FE] p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-[#2563EB]">{years}</div>
                            <div className="mt-1 text-sm">년</div>
                        </div>
                        <div className="bg-[#D1FAE5] p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-[#059669]">{months}</div>
                            <div className="mt-1 text-sm">개월</div>
                        </div>
                        <div className="bg-[#F3E8FF] p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-[#9333EA]">{days}</div>
                            <div className="mt-1 text-sm">일</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 bg-[#FEF9C3]">
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

                    <div className="rounded-xl bg-[#FDF2F8] p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-[#BE185D] mb-2">요일 정보</h2>
                            <p className="text-sm text-muted-foreground mb-1">시작 요일</p>
                            <div className="text-xl font-bold mb-2">{startDayName}</div>
                            <p className="text-sm text-muted-foreground mb-1">종료 요일</p>
                            <div className="text-xl font-bold mb-2">{endDayName}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground mb-1">D-Day 계산</p>
                            <p className="text-3xl font-bold text-[#8B5CF6]">{dDayText}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
