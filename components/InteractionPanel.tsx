"use client";

import { useState } from 'react';

export default function InteractionPanel({ title, url }: { title: string; url: string }) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleNewLike = () => {
    // 本来はここでDBに送信。今回はローカルの動きのみ実装
    if (!isLiked) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
      // ここで幾何学的エフェクトのCSSクラスをトリガーするロジックが入ります
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard.');
    }
  };

  const handleReport = () => {
    // 訂正報告用のメールリンク（件名自動入力）
    window.location.href = `mailto:contact@example.com?subject=【訂正報告】${encodeURIComponent(title)}&body=該当記事URL: ${url}%0D%0A%0D%0A指摘箇所と理由:`;
  };

  return (
    <div className="mt-16 py-8 border-t border-black flex flex-wrap gap-4 items-center justify-between font-mono text-sm">
      
      {/* NewLike Button */}
      <button 
        onClick={handleNewLike}
        className={`group relative flex items-center gap-2 border px-6 py-2 transition-all duration-300 ${isLiked ? 'bg-black text-white border-black' : 'border-black hover:bg-gray-100'}`}
      >
        <span className="text-lg">◇</span>
        <span>NEW LIKE {likes > 0 && `[ ${likes} ]`}</span>
        
        {/* クリック時のパーティクル（簡易版） */}
        {isLiked && (
          <span className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <span className="animate-ping absolute h-full w-full opacity-20 bg-gray-400"></span>
          </span>
        )}
      </button>

      {/* Tools */}
      <div className="flex gap-4">
        <button onClick={handleShare} className="hover:underline decoration-1 underline-offset-4">
          [ SHARE ]
        </button>
        <button onClick={handleReport} className="text-gray-500 hover:text-red-600 hover:underline decoration-1 underline-offset-4">
          [ REPORT ERROR ]
        </button>
      </div>
    </div>
  );
}