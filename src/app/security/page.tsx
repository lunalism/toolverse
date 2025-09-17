// src/app/security/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type UnsplashPhoto = { urls: { small: string; }; };

// 👇 아직 만들 도구를 정하지 않았으니, tools 배열은 비워둡니다.
const tools = [
    {
        href: "/security/password-generator",
        title: "비밀번호 생성기",
        description: "암호학적으로 안전한 강력한 비밀번호를 생성하여 보안을 강화하세요.",
    },
    {
        href: "/security/qr-code-generator",
        title: "QR코드 생성기",
        description: "텍스트나 URL을 즉시 QR코드로 변환하고 이미지로 다운로드합니다.",
    },
    {
        href: "/security/hash-generator",
        title: "해시 생성기",
        description: "텍스트를 MD5, SHA-256 등 표준 해시 알고리즘으로 변환합니다.",
    },
];

const keywords = ['security', 'lock', 'code', 'abstract', 'technology'];

export default function SecurityToolsPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 👇 Unsplash 로직의 주석을 해제하고 활성화합니다.
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`https://api.unsplash.com/photos/random?query=${keywords.join(',')}&count=${tools.length}`, { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } });
                if (!response.ok) throw new Error('Unsplash API Error');
                const data: UnsplashPhoto[] = await response.json();
                const urls = data.map(photo => photo.urls.small);
                setImageUrls(urls);
            } catch (error) { 
                console.error(error); 
            } finally { 
                setIsLoading(false); 
            }
        };
        if (tools.length > 0) fetchImages(); else setIsLoading(false);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tighter">보안 도구 모음</h1>
                <p className="text-lg text-gray-600 mt-2">안전한 웹 생활을 위한 필수 도구들.</p>
            </div>
            
            {/* 이제 tools 배열에 내용이 있으므로, 이 UI가 렌더링됩니다. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool, index) => (
                    <div key={tool.href} className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                        <div className="relative h-48 w-full">
                            {isLoading ? 
                                <div className="w-full h-full bg-gray-200 animate-pulse"></div> : 
                            (imageUrls[index] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={imageUrls[index]} alt={tool.title} className="w-full h-full object-cover" />
                            ))}
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