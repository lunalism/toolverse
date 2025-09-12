// src/app/pdf/to-image/page.tsx (최종 기능 구현)

"use client";

import { useState, ChangeEvent, DragEvent } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');
  
  // 👇 이미지 포맷 선택을 위한 state 추가
  const [imageFormat, setImageFormat] = useState<'jpeg' | 'png'>('jpeg');

  const handleFileSelect = async (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      // pdf.js는 ArrayBuffer가 필요합니다.
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      setPageCount(pdf.numPages);
    } else {
      setFile(null);
      setPageCount(null);
      if (selectedFile) alert("PDF 파일만 업로드해주세요.");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // 👇 PDF를 이미지로 변환하고 ZIP으로 압축하는 핵심 함수
  const handleConvertToImage = async () => {
    if (!file || !pageCount) return;

    setIsLoading(true);
    setProgressMessage('PDF 파일을 읽는 중...');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const zip = new JSZip();
      const originalFileName = file.name.replace(/\.pdf$/i, '');

      for (let i = 1; i <= pageCount; i++) {
        setProgressMessage(`${pageCount} 페이지 중 ${i}번째 페이지 변환 중...`);
        const page = await pdf.getPage(i);
        // 고해상도 이미지를 위해 scale을 2로 설정합니다.
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        // Canvas를 Blob 데이터로 변환합니다. toDataURL보다 효율적입니다.
        const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, `image/${imageFormat}`, 0.9));

        if (blob) {
          zip.file(`${originalFileName}_page_${i}.${imageFormat}`, blob);
        }
      }

      setProgressMessage('ZIP 파일 압축 중...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const zipFilename = `toolverse-converted_${timestamp}.zip`;

      // 다운로드 실행
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
a.href = url;
      a.download = zipFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("PDF to Image 변환 오류:", error);
      alert("파일을 변환하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter">PDF를 이미지로 변환</h1>
        <p className="text-lg text-gray-600 mt-2">PDF 파일의 모든 페이지를 고품질 이미지 파일로 변환합니다.</p>
      </div>

      {!file && (
        <div className="w-full max-w-2xl mx-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            {/* ... SVG 아이콘 및 텍스트는 동일 ... */}
            <div className="flex flex-col items-center justify-center pt-5 pb-6"><svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg><p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그 앤 드롭하세요</p><p className="text-xs text-gray-500">하나의 PDF 파일만 가능</p></div>
            <input id="file-upload" type="file" className="hidden" accept=".pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files ? e.target.files[0] : null)} />
          </label>
        </div>
      )}

      {file && (
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div className="p-4 border rounded-md bg-white flex justify-between items-center shadow-sm">
            <div>
              <p className="font-semibold truncate">{file.name}</p>
              {pageCount && <p className="text-sm text-gray-500">{pageCount} 페이지</p>}
            </div>
            <button onClick={() => { setFile(null); setPageCount(null); }} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
          
          <div className="p-4 border rounded-md bg-white space-y-4 shadow-sm">
            <h2 className="font-semibold">변환 옵션</h2>
            <div className="flex items-center gap-6">
              <label className="flex items-center"><input type="radio" name="format" value="jpeg" checked={imageFormat === 'jpeg'} onChange={() => setImageFormat('jpeg')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" /> <span className="ml-2">JPG</span></label>
              <label className="flex items-center"><input type="radio" name="format" value="png" checked={imageFormat === 'png'} onChange={() => setImageFormat('png')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" /> <span className="ml-2">PNG</span></label>
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleConvertToImage} disabled={isLoading} className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:opacity-90 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300">
              {isLoading ? progressMessage : '이미지로 변환 & 다운로드'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}