// src/app/api/pdf/split/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

// 사용자가 입력한 "1-3, 5" 같은 문자열을 숫자 배열 [0, 1, 2, 4] (0-based index)로 바꿔주는 함수
function parsePageRanges(rangeStr: string, maxPage: number): number[] {
    const pages = new Set<number>();
    const parts = rangeStr.split(',');

    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(s => parseInt(s.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= maxPage) {
                        pages.add(i - 1); // 0-based index로 변환
                    }
                }
            }
        } else {
        const page = parseInt(part.trim(), 10);
            if (!isNaN(page) && page > 0 && page <= maxPage) {
                pages.add(page - 1); // 0-based index로 변환
            }
        }
    }
    return Array.from(pages).sort((a, b) => a - b);
}


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const splitMode = formData.get('splitMode') as 'all' | 'range';
        const range = formData.get('range') as string | null;

        if (!file) {
            return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
        }

        const originalPdfBytes = await file.arrayBuffer();
        const originalPdf = await PDFDocument.load(originalPdfBytes);
        const totalPages = originalPdf.getPageCount();

        let pagesToSplit: number[] = [];

        if (splitMode === 'all') {
            pagesToSplit = Array.from({ length: totalPages }, (_, i) => i);
        } else if (splitMode === 'range' && range) {
            pagesToSplit = parsePageRanges(range, totalPages);
        } else {
            return NextResponse.json({ error: '잘못된 분할 옵션입니다.' }, { status: 400 });
        }
        
        if (pagesToSplit.length === 0) {
            return NextResponse.json({ error: '분할할 페이지가 선택되지 않았습니다.' }, { status: 400 });
        }

        const zip = new JSZip();
        const originalFileName = file.name.replace(/\.pdf$/i, '');

        for (const pageIndex of pagesToSplit) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(originalPdf, [pageIndex]);
            newPdf.addPage(copiedPage);
            
            const newPdfBytes = await newPdf.save();
            zip.file(`${originalFileName}_page_${pageIndex + 1}.pdf`, newPdfBytes);
        }

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        // 👇 이 부분을 합치기 도구와 동일한 방식으로 변경합니다.
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
        const zipFilename = `toolverse-split_${timestamp}.zip`;

        return new NextResponse(zipBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${zipFilename}"`,
            },
        });

    } catch (error) {
        console.error('PDF 분할 오류:', error);
        return NextResponse.json({ error: 'PDF를 처리하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}