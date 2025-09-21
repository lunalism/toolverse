// src/app/api/image/convert-heic/route.ts

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
        }

        // 1. 받은 파일을 컴퓨터가 처리할 수 있는 'Buffer' 형태로 변환합니다.
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // 2. sharp로 이미지를 처리합니다.
        const convertedImageBuffer = await sharp(fileBuffer)
            .jpeg({ quality: 90 }) // 90% 품질의 JPEG로 변환하라고 명령합니다.
            .toBuffer(); // 결과를 다시 Buffer 형태로 꺼냅니다.

        const arrayBuffer = new Uint8Array(convertedImageBuffer).buffer;

        const originalFileName = file.name.replace(/\.[^/.]+$/, "");
        const filename = `${originalFileName}.jpeg`;

        // 👇 변환된 arrayBuffer를 사용합니다.
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error('Sharp HEIC 변환 오류:', error);
        return NextResponse.json(
            { error: '서버에서 파일을 변환하는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}