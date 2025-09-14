// src/app/color/palette-generator/page.tsx (SVG 아이콘 적용)

"use client";

import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';

function hslToHex(h: number, s: number, l: number): string { 
    /* ... 이전과 동일 ... */ 
    l /= 100; 
    const a = s * Math.min(l, 1 - l) / 100; 

    const f = (n: number) => { 
        const k = (n + h / 30) % 12; 
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); 
        return Math.round(255 * color).toString(16).padStart(2, '0'); 
    }; 

    return `#${f(0)}${f(8)}${f(4)}`; 
}
type Color = { hex: string; isLocked: boolean; };

export default function PaletteGeneratorPage() {
    const [palette, setPalette] = useState<Color[]>([]);
    const [copiedHex, setCopiedHex] = useState<string>('');

    const generatePalette = useCallback(() => { 
        /* ... 이전과 동일 ... */ 
        const newPalette = palette.map(color => { 
            if (color.isLocked) { 
                return color; 
            }

            const hue = Math.floor(Math.random() * 361); 
            const saturation = 40 + Math.floor(Math.random() * 31); 
            const lightness = 60 + Math.floor(Math.random() * 21); 
            
            return { hex: hslToHex(hue, saturation, lightness), isLocked: false, }; 
        }); 
    
        if (palette.length === 0) { 
            const initial = Array.from({ length: 5 }, () => { 
                const hue = Math.floor(Math.random() * 361); 
                const saturation = 40 + Math.floor(Math.random() * 31); 
                const lightness = 60 + Math.floor(Math.random() * 21); 
                
                return { hex: hslToHex(hue, saturation, lightness), isLocked: false }; 
            }); 
            
            setPalette(initial); 
        } else { 
            setPalette(newPalette); 
        } 
    }, [palette]);

    const toggleLock = (indexToToggle: number) => { 
        setPalette(palette.map((color, index) => index === indexToToggle ? { 
            ...color, isLocked: !color.isLocked 
        } : color)); 
    };

    const handleCopy = (hex: string) => { 
        navigator.clipboard.writeText(hex).then(() => { 
            setCopiedHex(hex); setTimeout(() => setCopiedHex(''), 1500); 
        }); 
    };

    useEffect(() => { 
        generatePalette(); 
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { 
        const handleKeyDown = (e: KeyboardEvent) => { 
            if (e.code === 'Space') { e.preventDefault(); generatePalette(); } 
        }; 
        
        window.addEventListener('keydown', handleKeyDown); 
        return () => { 
            window.removeEventListener('keydown', handleKeyDown); 
        }; 
    }, [generatePalette]);

    const getTextColor = (hex: string) => { 
        const rgb = parseInt(hex.substring(1), 16); 
        const r = (rgb >> 16) & 0xff; 
        const g = (rgb >> 8) & 0xff; 
        const b = (rgb >> 0) & 0xff; 
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
        
        return luma < 128 ? 'white' : 'black'; 
    };

    return (
        <div className="flex w-full flex-grow">
            {palette.map((color, index) => (
                <div key={index} style={{ backgroundColor: color.hex, color: getTextColor(color.hex) }} className="relative flex flex-grow flex-col items-center justify-center p-4 transition-colors duration-300">
                    <div className="text-center">
                        <h2 onClick={() => handleCopy(color.hex)} className="text-2xl font-mono font-bold tracking-widest cursor-pointer p-2 bg-black/20 rounded-lg">
                            {copiedHex === color.hex ? 'Copied!' : color.hex.toUpperCase()}
                        </h2>
                    </div>
                    {/* 👇 자물쇠 버튼을 SVG 아이콘으로 교체했습니다. */}
                    <Button onClick={() => toggleLock(index)} className="absolute top-4 right-4 p-3 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
                        {color.isLocked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                            </svg>
                        )}
                    </Button>
                </div>
            ))}

            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center bg-white/10 backdrop-blur-sm">
                <Button onClick={generatePalette} className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
                    Generate Palette
                </Button>
                <p className="absolute bottom-5 right-5 text-gray-500 bg-white/50 px-2 py-1 rounded-md text-sm">
                    or just press the spacebar
                </p>
            </div>
        </div>
    );
}