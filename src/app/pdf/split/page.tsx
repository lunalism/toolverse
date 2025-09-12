// src/app/pdf/split/page.tsx (최종)

"use client";

import { useState, ChangeEvent, DragEvent } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [range, setRange] = useState<string>('');
  const [rangeError, setRangeError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 state 추가

  const handleFileSelect = async (selectedFile: File | null) => { /* ... 이전과 동일 ... */ if (selectedFile && selectedFile.type === "application/pdf") { setFile(selectedFile); const arrayBuffer = await selectedFile.arrayBuffer(); const pdfDoc = await PDFDocument.load(arrayBuffer); setPageCount(pdfDoc.getPageCount()); } else { setFile(null); setPageCount(null); if (selectedFile) alert("PDF 파일만 업로드해주세요."); } };
  const validateRange = (value: string) => { /* ... 이전과 동일 ... */ if (splitMode === 'all') { setRangeError(''); return true; } if (!value) { setRangeError('페이지 범위를 입력해주세요.'); return false; } if (!/^[0-9,\s-]*$/.test(value)) { setRangeError("숫자, ',', '-'만 입력할 수 있습니다."); return false; } setRangeError(''); return true; };
  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => { const value = e.target.value; setRange(value); validateRange(value); };
  const handleModeChange = (mode: 'all' | 'range') => { setSplitMode(mode); if (mode === 'all') { validateRange(''); } else { validateRange(range); } };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { handleFileSelect(e.dataTransfer.files[0]); } };

  // 👇 분할하기 버튼 클릭 시 실행될 함수
  const handleSplit = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('splitMode', splitMode);
    if (splitMode === 'range') {
      formData.append('range', range);
    }

    try {
      const response = await fetch('/api/pdf/split', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || '서버에서 오류가 발생했습니다.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // 👇 백엔드 헤더를 해석하는 대신, 프론트엔드에서 직접 파일명을 생성합니다!
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
      const filename = `toolverse-split_${timestamp}.zip`;
      
      a.download = filename; // 여기서 파일명이 최종 결정됩니다.
      
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) { // any를 지우고, 타입을 추론하도록 둡니다.
        console.error(error);
        
        // 오류 메시지를 담을 변수를 준비합니다.
        let errorMessage = '파일을 분할하는 중 오류가 발생했습니다.';
        
        // error가 Error 클래스의 인스턴스인지 확인합니다.
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... 제목, 파일 업로드 영역은 이전과 동일 ... */}
      <div className="text-center mb-8"><h1 className="text-4xl font-black tracking-tighter">PDF 분할하기</h1><p className="text-lg text-gray-600 mt-2">하나의 PDF 파일을 여러 개의 개별 파일로 분할합니다.</p></div>
      {!file && (<div className="w-full max-w-2xl mx-auto" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}><label htmlFor="file-upload" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}><div className="flex flex-col items-center justify-center pt-5 pb-6"><svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg><p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그 앤 드롭하세요</p><p className="text-xs text-gray-500">하나의 PDF 파일만 가능</p></div><input id="file-upload" type="file" className="hidden" accept=".pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files ? e.target.files[0] : null)} /></label></div>)}
      {file && (
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div className="p-4 border rounded-md bg-white flex justify-between items-center shadow-sm"><div><p className="font-semibold truncate">{file.name}</p>{pageCount && <p className="text-sm text-gray-500">{pageCount} 페이지</p>}</div><button onClick={() => { setFile(null); setPageCount(null); setRange(''); setSplitMode('all'); }} className="text-red-500 hover:text-red-700 font-bold">&times;</button></div>
          <div className="p-4 border rounded-md bg-white space-y-4 shadow-sm">
            <h2 className="font-semibold">분할 옵션</h2>
            <div className="space-y-3">
              <div className="flex items-center"><input type="radio" id="split-all" name="split-mode" value="all" checked={splitMode === 'all'} onChange={() => handleModeChange('all')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" /><label htmlFor="split-all" className="ml-3 block text-sm font-medium text-gray-700">모든 페이지를 개별 파일로 분할</label></div>
              <div className="flex items-center"><input type="radio" id="split-range" name="split-mode" value="range" checked={splitMode === 'range'} onChange={() => handleModeChange('range')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" /><label htmlFor="split-range" className="ml-3 block text-sm font-medium text-gray-700">페이지 범위 지정 분할</label></div>
              {splitMode === 'range' && (<div className="pl-7"><input type="text" value={range} onChange={handleRangeChange} placeholder="예: 1-3, 5, 8-10" className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${rangeError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`} />{rangeError && <p className="mt-1 text-xs text-red-600">{rangeError}</p>}</div>)}
            </div>
          </div>
          <div className="text-center">
            <button onClick={handleSplit} disabled={isLoading || (splitMode === 'range' && (!range || !!rangeError))} className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300">
              {isLoading ? '파일을 분할하는 중...' : 'PDF 분할하기 & 다운로드'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}