// src/app/image/converter/page.tsx (최종 기능 구현)

"use client";

import { useState, ChangeEvent, DragEvent, useEffect } from 'react';

export default function ImageConverterPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFile = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setOriginalFile(file);
      const previewUrl = URL.createObjectURL(file);
      setOriginalPreviewUrl(previewUrl);
    } else {
      setOriginalFile(null);
      setOriginalPreviewUrl('');
      if (file) alert('이미지 파일만 업로드해주세요.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => { handleFile(e.target.files?.[0] || null); };
  const handleDragOver = (e: DragEvent<HTMLElement>) => { e.preventDefault(); };
  const handleDrop = (e: DragEvent<HTMLElement>) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0] || null); };

  // 👇 포맷 변환 및 다운로드 로직
  const handleConvert = () => {
    if (!originalPreviewUrl || !originalFile) return;

    setIsLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // 캔버스 크기를 원본 이미지와 동일하게 설정
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsLoading(false);
        return;
      }
      
      // 캔버스에 이미지를 그립니다.
      ctx.drawImage(img, 0, 0);
      
      // 캔버스의 내용을 원하는 포맷의 데이터 URL로 변환합니다.
      const dataUrl = canvas.toDataURL(`image/${targetFormat}`, 1.0);
      
      // 익숙한 다운로드 로직
      const a = document.createElement('a');
      a.href = dataUrl;
      const originalFileName = originalFile.name.replace(/\.[^/.]+$/, "");
      a.download = `${originalFileName}.${targetFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      setIsLoading(false);
    };
    img.src = originalPreviewUrl;
  };

  useEffect(() => {
    return () => { if (originalPreviewUrl) { URL.revokeObjectURL(originalPreviewUrl); } };
  }, [originalPreviewUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter">이미지 포맷 변환</h1>
        <p className="text-lg text-gray-600 mt-2">
          이미지를 JPG, PNG, WEBP 포맷으로 변환하세요.
        </p>
      </div>

      {!originalFile && (
        <div className="w-full max-w-2xl mx-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            {/* ... SVG 아이콘 등은 동일 ... */}
            <p>이미지 파일을 이곳에 드롭하거나 클릭하여 업로드하세요</p>
            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
      )}

      {originalFile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">원본 이미지</h2>
            <div className="border rounded-lg p-2 bg-gray-50 flex items-center justify-center min-h-[200px]">
              {originalPreviewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={originalPreviewUrl} alt="Original Preview" className="max-w-full max-h-96 rounded" />
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">변환 옵션</h2>
            <div className="border rounded-lg p-4 bg-white space-y-4 shadow-sm">
              <div>
                <label className="text-sm font-medium">변환할 포맷</label>
                <div className="flex items-center gap-6 mt-2">
                  <label className="flex items-center"><input type="radio" name="format" value="jpeg" checked={targetFormat === 'jpeg'} onChange={() => setTargetFormat('jpeg')} className="h-4 w-4 text-indigo-600 border-gray-300" /> <span className="ml-2">JPG</span></label>
                  <label className="flex items-center"><input type="radio" name="format" value="png" checked={targetFormat === 'png'} onChange={() => setTargetFormat('png')} className="h-4 w-4 text-indigo-600 border-gray-300" /> <span className="ml-2">PNG</span></label>
                  <label className="flex items-center"><input type="radio" name="format" value="webp" checked={targetFormat === 'webp'} onChange={() => setTargetFormat('webp')} className="h-4 w-4 text-indigo-600 border-gray-300" /> <span className="ml-2">WEBP</span></label>
                </div>
              </div>

              <button 
                onClick={handleConvert}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? '변환 중...' : '포맷 변환 & 다운로드'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}