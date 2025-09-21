// src/app/productivity/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type UnsplashPhoto = { urls: { small: string; }; };

const tools = [
    {
        href: "/productivity/pomodoro-timer",
        title: "뽀모도로 타이머",
        description: "25분 집중 + 5분 휴식 사이클로 생산성을 극대화하세요. 할 일 관리, 통계 추적 기능을 제공합니다.",
    },
    {
        href: "/productivity/date-calculator",
        title: "시간/날짜 계산기",
        description: "D-day, 날짜 더하기/빼기, 업무일 계산 등 복잡한 시간 계산을 간편하게 처리합니다.",
    },
];

const keywords = ['focus', 'desk', 'coffee', 'study', 'relax'];

export default function ProductivityToolsPage() {
    // ... Unsplash 이미지 로딩 로직은 이전과 동일합니다 ...
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    useEffect(() => { const fetchImages = async () => { try { const response = await fetch(`https://api.unsplash.com/photos/random?query=${keywords.join(',')}&count=${tools.length}`, { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } }); if (!response.ok) throw new Error('Unsplash API Error'); const data: UnsplashPhoto[] = await response.json(); const urls = data.map(photo => photo.urls.small); setImageUrls(urls); } catch (error) { console.error(error); } }; if(tools.length > 0) fetchImages(); }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tighter">생산성 도구 모음</h1>
                <p className="text-lg text-gray-600 mt-2">당신의 시간과 집중력을 관리하여 최고의 효율을 이끌어내세요.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool, index) => (
                    <div key={tool.href} className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                        <div className="relative h-48 w-full">
                            {imageUrls[index] && ( 
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={imageUrls[index]} alt={tool.title} className="w-full h-full object-cover" /> 
                            )}
                        </div>
                        <div className="flex-grow p-6 flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{tool.title}</h2>
                            <p className="text-gray-600 mb-4 flex-grow">{tool.description}</p>
                            <div className="mt-auto">
                                <Link href={tool.href} className="inline-block w-full text-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                                    도구 사용
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}