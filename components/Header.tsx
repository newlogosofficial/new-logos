"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* max-w-3xl mx-auto で本文と同じ幅に揃える */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-16 flex justify-center">
        <div className="w-full max-w-3xl px-6 flex items-center justify-between">
          
          {/* 左上：アイコン画像 ＋ NEW LOGOS */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* 画像を表示（正方形） */}
            <div className="w-8 h-8 relative overflow-hidden border border-black">
               <img src="/icon.png" alt="NL" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-lg tracking-tighter group-hover:opacity-70 transition-opacity">
              NEW LOGOS
            </span>
          </Link>

          {/* ハンバーガーメニュー */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex flex-col gap-1.5 w-6 items-end group"
          >
            <span className={`block h-0.5 bg-black transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
            <span className={`block h-0.5 bg-black transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`}></span>
            <span className={`block h-0.5 bg-black transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-3'}`}></span>
          </button>
        </div>
      </header>

      {/* メニューの中身（変更なし、省略可能） */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-500 flex flex-col items-center justify-center ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col gap-8 text-center text-xl font-bold tracking-widest">
          <Link href="/" onClick={() => setIsOpen(false)}>TOP</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>ABOUT</Link>
          <Link href="/blogs" onClick={() => setIsOpen(false)}>BLOGS</Link>
          <Link href="/access" onClick={() => setIsOpen(false)}>ACCESS</Link>
        </nav>
      </div>
    </>
  );
}