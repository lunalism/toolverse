// src/app/api/image/compressor/route.ts

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const quality = Number(formData.get('quality') as string) || 80;

        if (!files || files.length === 0) {
            return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
        }

        const zip = new JSZip();

        for (const file of files) {
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            
            let compressedBuffer: Buffer;
            const originalFileName = file.name.replace(/\.[^/.]+$/, "");
            let newExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

            // 파일 타입에 따라 다른 압축 옵션을 적용합니다.
            if (file.type === 'image/png') {
                newExtension = 'png';
                compressedBuffer = await sharp(fileBuffer).png({ quality }).toBuffer();
            } else if (file.type === 'image/webp') {
                newExtension = 'webp';
                compressedBuffer = await sharp(fileBuffer).webp({ quality }).toBuffer();
            } else { // 기본적으로 JPEG으로 처리
                newExtension = 'jpeg';
                compressedBuffer = await sharp(fileBuffer).jpeg({ quality, mozjpeg: true }).toBuffer();
            }
            
            zip.file(`${originalFileName}_compressed.${newExtension}`, compressedBuffer);
        }

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const zipFilename = `toolverse-compressed_${timestamp}.zip`;

        return new NextResponse(zipBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${zipFilename}"`,
            },
        });

    } catch (error) {
        console.error('이미지 압축 오류:', error);
        return NextResponse.json({ error: '이미지를 압축하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}