// src/app/color/css-gradient-generator/page.tsx (레이아웃 최종 수정)

"use client";

import { useState, useEffect } from 'react';

export default function GradientGeneratorPage() {
  const [colors, setColors] = useState(['#ff0000', '#0000ff']);
  const [cssCode, setCssCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const gradient = `linear-gradient(to right, ${colors.join(', ')})`;
    setCssCode(`background-image: ${gradient};`);
  }, [colors]);

  const handleColorChange = (indexToChange: number, newColor: string) => {
    setColors(
      colors.map((color, index) =>
        index === indexToChange ? newColor : color
      )
    );
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(cssCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    // 👇 최상위 div에 h-full 대신 flex-grow를 추가합니다.
    <div className="flex flex-col flex-grow w-full">
      {/* 실시간 미리보기 (상단) */}
      <div 
        className="flex-grow"
        style={{ backgroundImage: `linear-gradient(to right, ${colors.join(', ')})` }}
      >
      </div>

      {/* 컨트롤 패널 (하단) */}
      <div className="w-full p-6 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="font-semibold">Colors:</label>
            <div className="flex gap-2">
              {colors.map((color, index) => (
                <input 
                  key={index}
                  type="color" 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <code className="p-3 bg-gray-100 rounded-md font-mono text-sm text-gray-700">
              {cssCode}
            </code>
            <button 
              onClick={handleCopyCss}
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}