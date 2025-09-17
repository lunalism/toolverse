// src/app/productivity/pomodoro-timer/page.tsx

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PomodoroTimerPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">뽀모도로 타이머</h1>
                <p className="text-lg text-gray-600 mt-2">
                    집중과 휴식의 사이클로 최고의 생산성을 경험하세요.
                </p>
            </div>
            
            <div className="p-8 border rounded-xl bg-white shadow-lg space-y-8">
                {/* 타이머 디스플레이 */}
                <div className="flex flex-col items-center justify-center">
                    <div className="w-64 h-64 rounded-full border-8 border-gray-200 flex flex-col items-center justify-center">
                        <div className="text-6xl font-bold font-mono text-gray-800">
                            25:00
                        </div>
                        <div className="text-lg text-gray-500 mt-2">
                            집중할 시간
                        </div>
                    </div>
                </div>
                
                {/* 진행 상황 */}
                <div className="text-center">
                    <p className="text-gray-600">완료한 뽀모도로: 0 / 4</p>
                    {/* 여기에 동그라미 인디케이터를 추가할 수 있습니다. */}
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-center gap-4">
                    <Button size="lg" className="bg-red-500 hover:bg-red-600">시작</Button>
                    <Button size="lg" variant="secondary">일시정지</Button>
                    <Button size="lg" variant="outline">리셋</Button>
                </div>
            </div>

            {/* 설정 패널 */}
            <div className="mt-8 p-8 border rounded-xl bg-white shadow-lg">
                <h2 className="text-xl font-bold text-center mb-6">설정</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="focusTime">집중 시간 (분)</Label>
                        <Input id="focusTime" type="number" defaultValue={25} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="shortBreak">짧은 휴식 (분)</Label>
                        <Input id="shortBreak" type="number" defaultValue={5} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="longBreak">긴 휴식 (분)</Label>
                        <Input id="longBreak" type="number" defaultValue={15} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="longBreakInterval">긴 휴식 주기</Label>
                        <Input id="longBreakInterval" type="number" defaultValue={4} />
                    </div>
                </div>
            </div>
        </div>
    );
}