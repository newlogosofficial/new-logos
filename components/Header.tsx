"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      setIsOpen(false);
      router.push(`/blogs?q=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-black h-16 flex items-center justify-between px-6">
        {/* ロゴ */}
        <Link href="/" className="font-black text-xl tracking-tighter z-50">
          NL
        </Link>

        {/* ハンバーガーボタン */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="z-50 flex flex-col gap-1.5 w-8 items-end group"
        >
          <span className={`block h-0.5 bg-black transition-all duration-300 ${isOpen ? 'w-8 rotate-45 translate-y-2' : 'w-8'}`}></span>
          <span className={`block h-0.5 bg-black transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-6'}`}></span>
          <span className={`block h-0.5 bg-black transition-all duration-300 ${isOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-4'}`}></span>
        </button>
      </header>

      {/* フルスクリーンメニュー */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-500 flex flex-col items-center justify-center ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col gap-8 text-center text-2xl font-bold tracking-widest mb-12">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-gray-500">TOP</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-gray-500">ABOUT</Link>
          <Link href="/blogs" onClick={() => setIsOpen(false)} className="hover:text-gray-500">BLOGS</Link>
          <Link href="/access" onClick={() => setIsOpen(false)} className="hover:text-gray-500">ACCESS</Link>
        </nav>

        {/* 検索フォーム */}
        <form onSubmit={handleSearch} className="w-64 border-b border-black flex items-center">
          <input 
            type="text" 
            placeholder="SEARCH LOGIC..." 
            className="w-full py-2 bg-transparent outline-none font-mono text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="text-sm font-bold">→</button>
        </form>
      </div>
    </>
  );
}