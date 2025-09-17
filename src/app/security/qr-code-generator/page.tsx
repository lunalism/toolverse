// src/app/security/qr-code-generator/page.tsx (최종 로직 구현)

"use client";

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // 라이브러리에서 QRCodeCanvas를 import

export default function QrCodeGeneratorPage() {
  const [text, setText] = useState('https://github.com/lunalism/toolverse');
  
  // QR코드 커스터마이징을 위한 state들
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');

  // 다운로드를 위해 QR코드 canvas를 참조할 ref
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = qrCodeRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter">QR코드 생성기</h1>
        <p className="text-lg text-gray-600 mt-2">
          URL이나 텍스트를 입력하면 실시간으로 QR코드가 생성됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 p-6 border rounded-lg bg-white shadow-sm">
          <div>
            <label htmlFor="qr-text" className="block text-lg font-semibold mb-2">
              데이터 (URL 또는 텍스트)
            </label>
            <textarea
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="size" className="flex justify-between text-sm font-medium mb-2">
              <span>크기 (Size)</span>
              <span className="font-bold">{size} px</span>
            </label>
            <input id="size" type="range" min="128" max="1024" step="64" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="bgColor" className="text-sm font-medium">배경색</label>
              <input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="mt-1 w-full h-10 rounded-md border" />
            </div>
            <div className="w-1/2">
              <label htmlFor="fgColor" className="text-sm font-medium">전경색</label>
              <input id="fgColor" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="mt-1 w-full h-10 rounded-md border" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-6 border rounded-lg bg-white shadow-sm" ref={qrCodeRef}>
            {/* 👇 qrcode.react 컴포넌트가 QR코드를 렌더링합니다. */}
            <QRCodeCanvas
              value={text}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level={"H"} // 오류 복원 레벨 (높을수록 안정적)
              includeMargin={true}
            />
          </div>
          <button onClick={handleDownload} className="w-full max-w-xs px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md">
            PNG로 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}