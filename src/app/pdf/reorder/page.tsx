// src/app/pdf/reorder/page.tsx (최종 수정본)

"use client";

import { useState, ChangeEvent } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type PageInfo = {
  id: string;
  imageDataUrl: string;
  originalIndex: number;
};

export default function PdfReorderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileSelect = async (selectedFile: File | null) => {
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      setFile(null);
      setPages([]);
      if (selectedFile) alert("PDF 파일만 업로드해주세요.");
      return;
    }
    
    setFile(selectedFile);
    setIsLoading(true);
    setPages([]);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;
      const renderedPages: PageInfo[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        renderedPages.push({
          id: `page-${i}`,
          imageDataUrl: canvas.toDataURL('image/jpeg'),
          originalIndex: i,
        });
      }
      setPages(renderedPages);
    } catch (error) {
      console.error("PDF 렌더링 오류:", error);
      alert("PDF 파일을 렌더링하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter">PDF 페이지 재구성</h1>
        <p className="text-lg text-gray-600 mt-2">
          페이지 순서를 바꾸거나 삭제하여 새로운 PDF를 만들어보세요.
        </p>
      </div>

      {!file && (
        <div className="w-full max-w-2xl mx-auto">
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
              {/* 👇 여기가 오타가 있었던 부분입니다! */}
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그 앤 드롭하세요
              </p>
              <p className="text-xs text-gray-500">하나의 PDF 파일만 가능</p>
            </div>
            <input id="file-upload" type="file" className="hidden" accept=".pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files ? e.target.files[0] : null)} />
          </label>
        </div>
      )}
      
      {isLoading && (
        <div className="text-center py-10">
          <p className="text-lg font-semibold">페이지를 불러오는 중입니다...</p>
          <p className="text-gray-500">파일 크기에 따라 시간이 걸릴 수 있습니다.</p>
        </div>
      )}

      {pages.length > 0 && !isLoading && (
        <div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {pages.map((page) => (
              <div key={page.id} className="relative border-2 border-gray-200 rounded-md overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.imageDataUrl} alt={`Page ${page.originalIndex}`} className="w-full h-full object-contain" />
                <div className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-tl-md">
                  {page.originalIndex}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
             <button className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90">
                새로운 PDF로 만들기
             </button>
          </div>
        </div>
      )}
    </div>
  );
}