'use client';

import { useState, useEffect } from 'react';

// initialCountを受け取れるように型定義を追加
export default function NewLikeButton({ 
  blogId, 
  initialCount 
}: { 
  blogId: string;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  // 初期値をサーバーから受け取った数字に設定
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const isLiked = localStorage.getItem(`like-${blogId}`);
    if (isLiked) {
      setLiked(true);
    }
  }, [blogId]);

  const handleLike = async () => {
    if (liked || loading) return;

    setLoading(true);

    // 楽観的UI更新（APIを待たずに先に数字を増やしてユーザー体験を良くする）
    setCount((prev) => prev + 1);
    setLiked(true);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blogId }),
      });

      if (!res.ok) {
        throw new Error('API Error');
      }

      // APIから正確な現在値が返ってきたらそれで上書きしてもよい
      // const data = await res.json();
      // setCount(data.count);
      
      localStorage.setItem(`like-${blogId}`, 'true');
      
    } catch (error) {
      console.error('Like failed:', error);
      // エラー時は元に戻す
      setCount((prev) => prev - 1);
      setLiked(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`
        group relative flex items-center gap-4 px-8 py-4 border-2 transition-all duration-300
        ${liked 
          ? 'bg-black text-white border-black cursor-default' 
          : 'bg-white text-black border-black hover:bg-black hover:text-white'
        }
      `}
    >
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-bold tracking-widest opacity-60 mb-1">
          {liked ? 'CONFIRMED' : 'CLICK TO'}
        </span>
        <span className="text-xl font-black font-mono tracking-tighter">
          NEWLIKE <span className="ml-1 text-lg">{count}</span>
        </span>
      </div>

      <div className={`
        w-3 h-3 bg-current transition-transform duration-500
        ${liked ? 'rotate-45' : 'group-hover:rotate-90'}
      `} />
    </button>
  );
}