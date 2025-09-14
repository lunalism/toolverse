// src/app/color/palette-generator/page.tsx (최종 레이아웃 수정)

"use client";

import { useState } from 'react';

type Color = { hex: string; isLocked: boolean; };

const initialPalette: Color[] = [
  { hex: '#e5e7eb', isLocked: false },
  { hex: '#d1d5db', isLocked: false },
  { hex: ' #9ca3af', isLocked: false },
  { hex: '#4b5563', isLocked: false },
  { hex: '#1f2937', isLocked: false },
];

export default function PaletteGeneratorPage() {
  const [palette, setPalette] = useState<Color[]>(initialPalette);

  // 👇 최상위 태그를 div로 바꾸고, flex-grow를 추가합니다.
  return (
    <div className="flex w-full flex-grow">
      {/* 5개의 색상 컬럼 */}
      {palette.map((color, index) => (
        <div 
          key={index} 
          style={{ backgroundColor: color.hex }}
          className="relative flex flex-grow items-center justify-center"
        >
          <div className="text-center p-4 bg-gray-800 bg-opacity-50 rounded-lg">
            <h2 className="text-2xl font-mono font-bold text-white tracking-widest">
              {color.hex}
            </h2>
          </div>
        </div>
      ))}

      {/* 하단 액션 바 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center bg-white/10 backdrop-blur-sm">
        <button className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg shadow-lg">
          Generate Palette
        </button>
        <p className="absolute bottom-5 right-5 text-gray-500 bg-white/50 px-2 py-1 rounded-md text-sm">
          or just press the spacebar
        </p>
      </div>
    </div>
  );
}