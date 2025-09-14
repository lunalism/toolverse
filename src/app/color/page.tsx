// src/app/color/page.tsx (오타 및 경고 수정 최종본)

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type UnsplashPhoto = { urls: { small: string; }; };

const tools = [
  {
    href: "/color/extractor",
    title: "이미지 색상 추출",
    description: "이미지에서 가장 많이 사용된 색상들을 분석하여 아름다운 색상 팔레트를 만듭니다.",
  },
  {
    href: "/color/palette-generator",
    title: "랜덤 색상 팔레트 생성기",
    description: "스페이스바를 누를 때마다 서로 조화롭게 어울리는 아름다운 색상 팔레트를 만듭니다.",
  },
  {
    href: "/color/css-gradient-generator",
    title: "CSS 그라데이션 생성기",
    description: "두 가지 이상의 색상을 조합하여 아름다운 CSS 그라데이션 코드를 만듭니다.",
  },
  {
    href: "/color/palettes",
    title: "컬러 팔레트 라이브러리",
    description: "엄선된 아름다운 색상 팔레트들을 탐색하고 영감을 얻으세요.",
  },
];

const keywords = ['color', 'palette', 'vibrant', 'art', 'painting'];

export default function ColorToolsPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // "=" 기호 하나로 수정!

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=${keywords.join(',')}&count=${tools.length}`, { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } });
        if (!response.ok) throw new Error('Unsplash API Error');
        const data: UnsplashPhoto[] = await response.json();
        const urls = data.map(photo => photo.urls.small);
        setImageUrls(urls);
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter">색상 도구 모음</h1>
        <p className="text-lg text-gray-600 mt-2">색상과 관련된 모든 창의적인 도구들.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <div key={tool.href} className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="relative h-48 w-full">
              {isLoading ? <div className="w-full h-full bg-gray-200 animate-pulse"></div> : (imageUrls[index] && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrls[index]} alt={tool.title} className="w-full h-full object-cover" />
                </>
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