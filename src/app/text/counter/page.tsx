// src/app/text/counter/page.tsx (최종 완성본)

"use client";

import { useState, useMemo } from 'react';

export default function CounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text) {
      return { characters: 0, charactersWithoutSpaces: 0, words: 0, lines: 0, paragraphs: 0 };
    }

    const trimmedText = text.trim();
    const characters = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;
    
    // 영어, 숫자, 한글, 그리고 하이픈/어퍼스트로피를 포함하는 단어를 찾습니다.
    const words = trimmedText.match(/[\w\uAC00-\uD7A3'-]+/g)?.length ?? 0;
    
    const lines = text.split('\n').length;
    const paragraphs = trimmedText.split(/\n\s*\n/).filter(p => p.trim() !== '').length;
    
    return { characters, charactersWithoutSpaces, words, lines, paragraphs };
  }, [text]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter">글자 수 / 단어 수 세기</h1>
        <p className="text-lg text-gray-600 mt-2">
          텍스트를 입력하면 실시간으로 분석 결과를 알려드립니다.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 text-center">
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold">{stats.characters}</div>
            <div className="text-sm text-gray-600">글자 (공백 포함)</div>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold">{stats.charactersWithoutSpaces}</div>
            <div className="text-sm text-gray-600">글자 (공백 제외)</div>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold">{stats.words}</div>
            <div className="text-sm text-gray-600">단어</div>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold">{stats.lines}</div>
            <div className="text-sm text-gray-600">줄</div>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold">{stats.paragraphs}</div>
            <div className="text-sm text-gray-600">문단</div>
          </div>
        </div>
      </div>
    </div>
  );
}