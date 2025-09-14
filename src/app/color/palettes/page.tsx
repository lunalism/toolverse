// src/app/color/palettes/page.tsx

"use client";

import { useState } from 'react';
// src/data 폴더에 있는 우리만의 데이터베이스를 불러옵니다.
import palettesData from '@/data/palettes.json';

// 팔레트 데이터의 타입을 정의합니다.
type Palette = {
  name: string;
  colors: string[];
  tags: string[];
};

// 각 팔레트 카드를 그리는 역할을 하는 작은 컴포넌트
function PaletteCard({ palette }: { palette: Palette }) {
  return (
    <div className="flex flex-col">
      <div className="flex h-24 rounded-lg overflow-hidden shadow-md">
        {palette.colors.map((color, index) => (
          <div key={index} style={{ backgroundColor: color }} className="flex-grow" />
        ))}
      </div>
      <div className="py-2 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">{palette.name}</span>
        {/* 여기에 '좋아요' 버튼이 들어갈 수 있습니다. */}
      </div>
    </div>
  );
}

export default function PalettesPage() {
  const [palettes, setPalettes] = useState<Palette[]>(palettesData);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter">컬러 팔레트 라이브러리</h1>
        <p className="text-lg text-gray-600 mt-2">
          엄선된 색상 팔레트들을 탐색하고 영감을 얻으세요.
        </p>
      </div>
      
      {/* 여기에 필터링/정렬 UI가 추가될 예정입니다. */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {palettes.map((palette, index) => (
          <PaletteCard key={index} palette={palette} />
        ))}
      </div>
    </div>
  );
}