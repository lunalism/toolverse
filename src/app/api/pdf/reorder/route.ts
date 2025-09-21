// src/app/api/pdf/reorder/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const pagesOrderStr = formData.get('pagesOrder') as string | null;

        if (!file || !pagesOrderStr) {
            return NextResponse.json({ error: '필수 데이터가 없습니다.' }, { status: 400 });
        }

        // 프론트엔드에서 보낸 페이지 순서 배열 (문자열 -> 숫자 배열로 변환)
        const pagesOrder: number[] = JSON.parse(pagesOrderStr);

        const originalPdfBytes = await file.arrayBuffer();
        const originalPdf = await PDFDocument.load(originalPdfBytes);
        
        // 새로운 PDF 문서를 생성합니다.
        const newPdf = await PDFDocument.create();

        // 받은 페이지 순서(pagesOrder)대로 원본 PDF에서 페이지를 복사해 새 문서에 추가합니다.
        const copiedPages = await newPdf.copyPages(originalPdf, pagesOrder.map(p => p - 1)); // 0-based index
        copiedPages.forEach(page => newPdf.addPage(page));

        const newPdfBytes = await newPdf.save();

        // 👇 이 한 줄을 추가하여 Uint8Array를 표준 ArrayBuffer로 변환합니다.
        const arrayBuffer = new Uint8Array(newPdfBytes).buffer;

        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const filename = `toolverse-reordered_${timestamp}.pdf`;

        // 👇 변환된 arrayBuffer를 사용합니다.
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error('PDF 재구성 오류:', error);
        return NextResponse.json({ error: 'PDF를 처리하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}