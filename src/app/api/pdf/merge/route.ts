// src/app/api/pdf/merge/route.ts (수정 완료)

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }

        const mergedPdfBytes = await mergedPdf.save();

        // 👇 Uint8Array를 표준 ArrayBuffer로 변환합니다.
        const arrayBuffer = new Uint8Array(mergedPdfBytes).buffer;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
        const filename = `toolverse-merged_${timestamp}.pdf`;

        // 👇 변환된 arrayBuffer를 사용합니다.
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error('PDF 합치기 오류:', error);
        return NextResponse.json({ error: 'PDF를 처리하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}