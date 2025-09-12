// src/app/pdf/page.tsx (Unsplash API 정식 연동)

"use client"; // API 요청 및 상태 관리를 위해 클라이언트 컴포넌트로 지정합니다.

import { useState, useEffect } from "react";
import Link from "next/link";

// Unsplash API가 보내주는 사진 객체의 데이터 구조를 정의합니다.
// 우리는 urls.small만 필요하므로, 딱 그 부분만 정의해주면 됩니다.
type UnsplashPhoto = {
    urls: {
        small: string;
    };
};
  

const tools = [
    { href: "/pdf/merge", title: "PDF 합치기", description: "여러 PDF를 원하는 순서대로 합쳐 하나의 파일로 만듭니다." },
    { href: "/pdf/split", title: "PDF 분할하기", description: "하나의 PDF에서 원하는 페이지만 추출하거나, 모든 페이지를 분할합니다." },
    { href: "/pdf/reorder", title: "PDF 페이지 재구성", description: "페이지 순서를 바꾸거나, 필요 없는 페이지를 삭제하여 새 PDF를 만듭니다." },
    { href: "/pdf/to-image", title: "PDF를 이미지로 변환", description: "PDF 파일의 각 페이지를 JPG 또는 PNG 이미지 파일로 변환합니다.",},
];

export default function PdfToolsPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImages = async () => {
        try {
            const response = await fetch(
            `https://api.unsplash.com/photos/random?query=abstract,gradient&count=${tools.length}`,
            {
                headers: {
                Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
                }
            }
            );
            if (!response.ok) {
            throw new Error('Unsplash API에서 이미지를 불러오는데 실패했습니다.');
            }
            // 👇 API 응답 데이터에 우리가 만든 UnsplashPhoto 타입을 적용합니다.
            const data: UnsplashPhoto[] = await response.json();
            
            // 👇 이제 photo 변수는 더 이상 any가 아니며, 타입스크립트가 구조를 완벽히 이해합니다.
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
                <h1 className="text-4xl font-black tracking-tighter">PDF 도구 모음</h1>
                <p className="text-lg text-gray-600 mt-2">
                    필요한 모든 PDF 도구를 여기서 만나보세요.
                </p>
            </div>

            {isLoading ? (
                // 이미지를 불러오는 동안 보여줄 로딩 스켈레톤 UI
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map(tool => (
                        <div key={tool.href} className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
                            <div className="p-6">
                                <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse mb-4"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // 이미지를 모두 불러온 후 보여줄 카드 UI
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool, index) => (
                        <div key={tool.href} className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="relative h-48 w-full">
                                {imageUrls[index] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={imageUrls[index]} alt={tool.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100"></div> // 이미지 로드 실패 시 대체 회색 배경
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