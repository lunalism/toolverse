// src/app/security/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type UnsplashPhoto = { urls: { small: string; }; };

// 👇 아직 만들 도구를 정하지 않았으니, tools 배열은 비워둡니다.
const tools: any[] = [
  // 여기에 '비밀번호 생성기' 같은 도구들이 추가될 예정입니다.
];

const keywords = ['security', 'lock', 'code', 'abstract', 'technology'];

export default function SecurityToolsPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    
    // tools 배열이 비어있으므로, 지금은 이미지를 불러오지 않습니다.

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tighter">보안 도구 모음</h1>
                <p className="text-lg text-gray-600 mt-2">
                    안전한 웹 생활을 위한 필수 도구들.
                </p>
            </div>
            
            {/* 👇 tools 배열이 비어있으므로, 안내 메시지를 보여줍니다. */}
            {tools.length === 0 && (
                <div className="text-center text-gray-500">
                    <p>🔧 곧 새로운 보안 도구들이 추가될 예정입니다. 🔧</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 여기에 카드들이 렌더링될 겁니다. */}
            </div>
        </div>
    );
}