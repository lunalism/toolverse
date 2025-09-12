// src/app/api/pdf/merge/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
    try {
        // 1. 프론트엔드에서 보낸 파일들을 FormData 형식으로 받습니다.
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
        }

        // 2. 새로운 PDF 문서를 생성합니다. 여기가 결과물이 담길 빈 종이입니다.
        const mergedPdf = await PDFDocument.create();

        // 3. 받은 파일들을 하나씩 순회하면서 새 문서에 페이지를 복사합니다.
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }

        // 4. 합쳐진 PDF를 바이트 배열(Uint8Array)로 저장합니다.
        const mergedPdfBytes = await mergedPdf.save();

        // 👇 파일명을 위한 타임스탬프 생성 로직 추가
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
        const filename = `toolverse-merged_${timestamp}.pdf`;

        // 5. 성공적으로 합쳐진 PDF 파일을 응답으로 보내줍니다.
        return new NextResponse(mergedPdfBytes, {
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