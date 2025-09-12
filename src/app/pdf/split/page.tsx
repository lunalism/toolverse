// src/app/pdf/split/page.tsx

"use client";

import { useState } from 'react';

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter">PDF 분할하기</h1>
        <p className="text-lg text-gray-600 mt-2">
          하나의 PDF 파일을 여러 개의 개별 파일로 분할합니다.
        </p>
      </div>

      {/* 파일이 아직 없을 때 보여주는 업로드 영역 */}
      {!file && (
        <div className="w-full max-w-2xl mx-auto">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그 앤 드롭하세요</p>
              <p className="text-xs text-gray-500">하나의 PDF 파일만 가능</p>
            </div>
            <input id="file-upload" type="file" className="hidden" accept=".pdf" />
          </label>
        </div>
      )}

      {/* 파일이 업로드된 후 보여주는 영역 */}
      {file && (
        <div className="w-full max-w-2xl mx-auto">
          {/* 여기에 파일 정보와 분할 옵션이 표시될 예정입니다. */}
          <div className="p-4 border rounded-md bg-white text-center">
            <p className="font-semibold">{file.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}