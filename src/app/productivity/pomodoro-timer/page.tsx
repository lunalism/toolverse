"use client";

import { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Mode = 'focus' | 'shortBreak' | 'longBreak';

export default function PomodoroTimerPage() {
    const [settings, setSettings] = useState({
        focus: 25,
        shortBreak: 5,
        longBreak: 15,
        longBreakInterval: 4,
    });

    const [mode, setMode] = useState<Mode>('focus');
    const [timeRemaining, setTimeRemaining] = useState(settings.focus * 60);
    const [isActive, setIsActive] = useState(false);
    const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };
    
    const switchMode = useCallback((currentMode: Mode, completedPomodoros: number) => {
        let nextMode: Mode;
        let newCompleted = completedPomodoros;

        if (currentMode === 'focus') {
            newCompleted = completedPomodoros + 1;
            if (newCompleted % settings.longBreakInterval === 0) {
                nextMode = 'longBreak';
            } else {
                nextMode = 'shortBreak';
            }
            setPomodorosCompleted(newCompleted);
        } else {
            nextMode = 'focus';
        }
        setMode(nextMode);
        setTimeRemaining(settings[nextMode] * 60);
    }, [settings]);


    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        if (audioRef.current) {
                            audioRef.current.play();
                        }
                        clearInterval(intervalRef.current!);
                        switchMode(mode, pomodorosCompleted);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, mode, pomodorosCompleted, switchMode]);

    useEffect(() => {
        document.title = `${formatTime(timeRemaining)} - ${mode === 'focus' ? 'Focus' : 'Break'}`;
    }, [timeRemaining, mode]);

    const handleStartPause = () => setIsActive(!isActive);

    const handleReset = () => {
        setIsActive(false);
        setMode('focus');
        setTimeRemaining(settings.focus * 60);
        setPomodorosCompleted(0);
    };
    
    const handleSettingsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newTime = parseInt(value, 10);
        if (newTime > 0 && newTime <= 180) { // 3시간 이상은 무리겠죠?
            setSettings(prev => {
                const newSettings = { ...prev, [name]: newTime };
                // 현재 모드의 시간이 변경되었다면, 타이머를 리셋하고 새 시간으로 업데이트합니다.
                if (name === mode) {
                    setIsActive(false);
                    setTimeRemaining(newTime * 60);
                }
                return newSettings;
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter">뽀모도로 타이머</h1>
                <p className="text-lg text-gray-600 mt-2">
                    집중과 휴식의 사이클로 최고의 생산성을 경험해보세요.
                </p>
            </div>
            
            <div className="p-8 border rounded-xl bg-white shadow-lg space-y-8">
                <div className="flex flex-col items-center justify-center">
                    <div className={`w-64 h-64 rounded-full border-8 flex flex-col items-center justify-center transition-colors ${
                        mode === 'focus' ? 'border-red-200' : 'border-green-200'
                        }`}>
                        <div className="text-6xl font-bold font-mono text-gray-800">
                            {formatTime(timeRemaining)}
                        </div>
                        <div className="text-lg text-gray-500 mt-2">
                            {mode === 'focus' ? '집중할 시간' : '휴식 시간'}
                        </div>
                    </div>
                </div>
                
                <div className="text-center">
                    <p className="text-gray-600">완료한 뽀모도로: {pomodorosCompleted} / {settings.longBreakInterval}</p>
                </div>

                <div className="flex justify-center gap-4">
                    <Button onClick={handleStartPause} size="lg" className="bg-red-500 hover:bg-red-600 w-28">
                        {isActive ? '일시정지' : '시작'}
                    </Button>
                    <Button onClick={() => switchMode(mode, pomodorosCompleted)} size="lg" variant="secondary">건너뛰기</Button>
                    <Button onClick={handleReset} size="lg" variant="outline">리셋</Button>
                </div>
            </div>

            <div className="mt-8 p-8 border rounded-xl bg-white shadow-lg">
                <h2 className="text-xl font-bold text-center mb-6">설정</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="focus">집중 시간 (분)</Label>
                        <Input id="focus" name="focus" type="number" value={settings.focus} onChange={handleSettingsChange} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="shortBreak">짧은 휴식 (분)</Label>
                        <Input id="shortBreak" name="shortBreak" type="number" value={settings.shortBreak} onChange={handleSettingsChange} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="longBreak">긴 휴식 (분)</Label>
                        <Input id="longBreak" name="longBreak" type="number" value={settings.longBreak} onChange={handleSettingsChange} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="longBreakInterval">긴 휴식 주기</Label>
                        <Input id="longBreakInterval" name="longBreakInterval" type="number" value={settings.longBreakInterval} onChange={handleSettingsChange} />
                    </div>
                </div>
            </div>
            <audio ref={audioRef} src="/bell.mp3" preload="auto" />
        </div>
    );
}