// src/app/text/page.tsx

"use client"; // Unsplash API 연동을 위해 클라이언트 컴포넌트로 유지

import { useState, useEffect } from "react";
import Link from "next/link";

type UnsplashPhoto = { urls: { small: string; }; };

const tools = [
    {
        href: "/text/counter",
        title: "글자 수 / 단어 수 세기",
        description: "텍스트의 글자, 단어, 줄, 문단 수를 실시간으로 분석하고 계산합니다.",
    },
    {
        href: "/text/diff-checker",
        title: "텍스트 비교",
        description: "두 개의 텍스트를 비교하여 추가, 삭제된 부분을 시각적으로 보여줍니다.",
    },
    {
        href: "/text/editor",
        title: "만능 텍스트 편집기",
        description: "대소문자 변환, 줄 정렬, 중복 제거 등 다양한 텍스트 조작을 한 곳에서 처리합니다.",
    },
];

const keywords = ['writing', 'keyboard', 'library', 'code'];

export default function TextToolsPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    
    useEffect(() => { 
        const fetchImages = async () => { 
            try { 
                const response = await fetch(`https://api.unsplash.com/photos/random?query=${keywords.join(',')}&count=${tools.length}`, { 
                    headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } 
                }); 
                
                if (!response.ok) throw new Error('Unsplash API Error'); 
                
                const data: UnsplashPhoto[] = await response.json(); 
                const urls = data.map(photo => photo.urls.small); 
                setImageUrls(urls); 
            } catch (error) { 
                console.error(error); 
            } 
        }; fetchImages(); 
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tighter">텍스트 도구 모음</h1>
                <p className="text-lg text-gray-600 mt-2">쓰고, 편집하고, 분석하는 모든 작업을 위한 도구들.</p>
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