// src/app/api/image/favicon-generator/route.ts

import { NextRequest, NextResponse } from 'next/server';
import toIco from 'to-ico';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('pngFiles') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: '변환할 PNG 파일이 없습니다.' }, { status: 400 });
        }

        const zip = new JSZip();
        const icoSourceBuffers: Buffer[] = [];

        // 받은 모든 PNG 파일을 ZIP에 추가합니다.
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            zip.file(file.name, buffer);
            
            // .ico 파일 생성에 사용할 작은 사이즈의 이미지들만 따로 모읍니다.
            const size = parseInt(file.name.match(/(\d+)x\d+\.png$/)?.[1] || '0');
            if ([16, 24, 32, 48].includes(size)) {
                icoSourceBuffers.push(buffer);
            }
        }

        // .ico 파일을 생성하고 ZIP에 추가합니다.
        if (icoSourceBuffers.length > 0) {
            const icoBuffer = await toIco(icoSourceBuffers);
            zip.file('favicon.ico', icoBuffer);
        }
        
        // 👇 웹 표준 ArrayBuffer로 바로 생성합니다.
        const zipArrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
        const zipFilename = `favicons.zip`;

        // 👇 변환 없이 바로 사용합니다.
        return new NextResponse(zipArrayBuffer, {
        status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${zipFilename}"`,
            },
        });

    } catch (error) {
        console.error('파비콘 생성 서버 오류:', error);
        return NextResponse.json({ error: '서버에서 파비콘을 생성하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}