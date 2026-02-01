'use client';

import { useState, useEffect } from 'react';

export default function NewLikeButton({ blogId }: { blogId: string }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 過去に押したかチェック
    const isLiked = localStorage.getItem(`like-${blogId}`);
    if (isLiked) {
      setLiked(true);
    }
  }, [blogId]);

  const handleLike = async () => {
    if (liked || loading) return; // 連打防止

    setLoading(true);

    try {
      // さっき作った裏方の窓口に「+1して」と依頼
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blogId }),
      });

      if (!res.ok) {
        throw new Error('API Error');
      }

      // 成功したら見た目を「押した状態」にする
      setLiked(true);
      localStorage.setItem(`like-${blogId}`, 'true');
      
    } catch (error) {
      console.error('Like failed:', error);
      alert('通信エラーが発生しました。時間を置いて再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`
        group relative flex items-center gap-3 px-6 py-3 border transition-all duration-300
        ${liked 
          ? 'bg-black text-white border-black cursor-default' 
          : 'bg-white text-black border-black hover:bg-gray-100'
        }
      `}
    >
      <span className="text-sm font-bold font-mono tracking-widest">
        {loading ? 'SENDING...' : (liked ? 'ACKNOWLEDGED' : 'RESPECT')}
      </span>
      <div className={`
        w-2 h-2 bg-current transition-transform duration-300
        ${liked ? 'rotate-45' : 'group-hover:rotate-180'}
      `} />
    </button>
  );
}