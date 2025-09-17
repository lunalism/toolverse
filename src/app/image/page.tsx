// src/app/image/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type UnsplashPhoto = { urls: { small: string; }; };

const tools = [
    {
        href: "/image/resizer",
        title: "이미지 사이즈 변환",
        description: "이미지의 가로/세로 크기를 원하는 대로 조절하고, 파일 용량을 최적화합니다.",
    },
    {
        href: "/image/converter",
        title: "이미지 포맷 변환",
        description: "이미지 파일을 JPG, PNG, WEBP 등 다른 포맷으로 변환합니다.",
    },
    {
        href: "/image/compressor",
        title: "이미지 압축",
        description: "이미지 품질을 최대한 유지하며 파일 크기를 획기적으로 줄입니다.",
    },
    {
        href: "/image/favicon-generator",
        title: "파비콘 생성기",
        description: "하나의 이미지로 모든 플랫폼에 필요한 파비콘과 HTML 코드를 한번에 생성합니다.",
    },
];

const keywords = ['photo', 'art', 'camera', 'colorful'];

export default function ImageToolsPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch( `https://api.unsplash.com/photos/random?query=${keywords.join(',')}&count=${tools.length}`, { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } });
                if (!response.ok) throw new Error('Unsplash API Error');
                const data: UnsplashPhoto[] = await response.json();
                const urls = data.map(photo => photo.urls.small);
                setImageUrls(urls);
            } catch (error) {
                console.error(error);
                setImageUrls([]); 
            } finally {
                setIsLoading(false);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tighter">이미지 도구 모음</h1>
                <p className="text-lg text-gray-600 mt-2">간단하고 강력한 이미지 편집 도구들.</p>
            </div>

            {isLoading ? (/* Loading UI */ <div/>) : (
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
            )}
        </div>
    );
}