// src/app/pdf/page.tsx

import Link from "next/link";

export default function PdfToolsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tighter">PDF 도구 모음</h1>
                <p className="text-lg text-gray-600 mt-2">
                    필요한 모든 PDF 도구를 여기서 만나보세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* PDF 합치기 도구 카드 */}
                <Link 
                href="/pdf/merge" 
                className="block p-6 border rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
                >
                    <h2 className="text-xl font-bold mb-2">PDF 합치기</h2>
                    <p className="text-gray-600">여러 개의 PDF 파일을 원하는 순서대로 합쳐 하나의 파일로 만듭니다.</p>
                </Link>

                {/* 앞으로 다른 PDF 도구들이 추가될 자리입니다. */}
                {/* 예시:
                <div className="block p-6 border rounded-lg bg-gray-100 text-gray-400">
                <h2 className="text-xl font-bold mb-2">PDF 분할하기 (준비 중)</h2>
                <p>하나의 PDF 파일을 여러 개로 분할합니다.</p>
                </div> 
                */}
            </div>
        </div>
    );
}