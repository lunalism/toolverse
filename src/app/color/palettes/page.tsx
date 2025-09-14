// src/app/color/palettes/page.tsx (팝업 기능 최종 구현)

"use client";

import { useState, useEffect, useMemo } from 'react';
import palettesData from '@/data/palettes.json';

// shadcn/ui의 Dialog, Button 컴포넌트들을 import 합니다.
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

type Palette = { name: string; colors: string[]; tags: string[]; };

function PaletteCard({ palette, onClick }: { palette: Palette, onClick: () => void }) {
    return (
        <div onClick={onClick} className="flex flex-col group cursor-pointer">
            <div className="flex h-24 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
                {palette.colors.map((color, index) => (
                    <div key={index} style={{ backgroundColor: color }} className="flex-grow" />
                ))}
            </div>
            <div className="py-2 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">{palette.name}</span>
            </div>
        </div>
    );
}

export default function PalettesPage() {
    const [palettes, setPalettes] = useState<Palette[]>(palettesData);
    const [activeTag, setActiveTag] = useState<string>('All');
    const [activeSort, setActiveSort] = useState<string>('Default');
    
    // 팝업에 보여줄 팔레트를 관리할 state
    const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
    const [copiedColor, setCopiedColor] = useState<string>('');

    const allTags = useMemo(() => ['All', ...new Set(palettesData.flatMap(p => p.tags))], []);
    
    useEffect(() => { /* ... 필터링 및 정렬 로직은 동일 ... */ let filteredPalettes = [...palettesData]; if (activeTag !== 'All') { filteredPalettes = palettesData.filter(p => p.tags.includes(activeTag)); } if (activeSort === 'Random') { filteredPalettes.sort(() => Math.random() - 0.5); } else if (activeSort === 'A-Z') { filteredPalettes.sort((a, b) => a.name.localeCompare(b.name)); } setPalettes(filteredPalettes); }, [activeTag, activeSort]);
    
    const handleCopy = (color: string) => {
        navigator.clipboard.writeText(color).then(() => {
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(''), 1500);
        });
    };

    return (
        <Dialog>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black tracking-tighter">컬러 팔레트 라이브러리</h1>
                    <p className="text-lg text-gray-600 mt-2">엄선된 색상 팔레트들을 탐색하고 영감을 얻으세요.</p>
                </div>
                
                <div className="mb-10 p-4 border rounded-lg bg-white/50 backdrop-blur-sm space-y-4">
                    {/* ... 필터링 및 정렬 UI는 동일 ... */}
                    <div>
                        <h3 className="font-semibold mb-2">Filter by Color</h3>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <Button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1 text-sm rounded-full transition-colors ${activeTag === tag ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Sort by</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Default', 'Random', 'A-Z'].map(sort => (
                                <Button key={sort} onClick={() => setActiveSort(sort)} className={`px-3 py-1 text-sm rounded-full transition-colors ${activeSort === sort ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                    {sort}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                    {palettes.map((palette, index) => (
                        // 👇 각 카드를 DialogTrigger로 감싸서, 클릭 시 팝업이 열리도록 합니다.
                        <DialogTrigger key={`${palette.name}-${index}`} asChild>
                            <PaletteCard palette={palette} onClick={() => setSelectedPalette(palette)} />
                        </DialogTrigger>
                    ))}
                </div>
            </div>

            {/* 👇 팝업(Dialog)의 실제 내용입니다. */}
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle>{selectedPalette?.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col">
                    {/* 상단 색상 바 */}
                    <div className="flex h-32 w-full">
                        {selectedPalette?.colors.map((color, index) => (
                            <div key={index} style={{ backgroundColor: color }} className="flex-grow transition-all duration-300 hover:flex-grow-[2] cursor-pointer" onClick={() => handleCopy(color)} />
                        ))}
                    </div>
                    
                    {/* 하단 색상 코드 목록 */}
                    <div className="p-6 pt-4 space-y-3">
                        {selectedPalette?.colors.map((color, index) => (
                            <div key={index} onClick={() => handleCopy(color)} className="flex items-center gap-4 group cursor-pointer">
                                <div style={{ backgroundColor: color }} className="w-8 h-8 rounded-md border" />
                                <div className="font-mono text-gray-700 group-hover:font-bold">
                                    {copiedColor === color ? 'Copied!' : color}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}