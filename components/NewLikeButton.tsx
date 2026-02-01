"use client";

import { useState, useEffect } from 'react';

export default function NewLikeButton({ blogId }: { blogId: string }) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // 初回読み込み時に保存された「いいね」を取得（現在は仮のlocalStorage）
  useEffect(() => {
    // ★将来的にここでSupabaseから全体のいいね数を取得します
    // const { count } = await supabase.from('likes').select...
    
    // 仮：ローカルストレージから自分のいいね状態を取得
    const liked = localStorage.getItem(`liked_${blogId}`);
    if (liked) setHasLiked(true);
    
    // 仮：ランダムな数値を表示（DB未接続のため）
    setLikes(Math.floor(Math.random() * 10)); 
  }, [blogId]);

  const handleLike = async () => {
    if (hasLiked) return; // 既にいいね済みなら何もしない

    // 1. UIを即座に更新（Optimistic UI）
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    localStorage.setItem(`liked_${blogId}`, 'true');

    // ★将来的にここでSupabaseへ「+1」を送信します
    // await supabase.rpc('increment_likes', { blog_id: blogId });
    
    console.log(`Saved like for blog: ${blogId}`);
  };

  return (
    <button 
      onClick={handleLike}
      disabled={hasLiked}
      className={`group relative overflow-hidden border border-black px-8 py-3 font-mono text-sm transition-all duration-300
        ${hasLiked ? 'bg-black text-white cursor-default' : 'hover:bg-gray-100 active:translate-y-1'}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className={`text-lg transition-transform duration-300 ${hasLiked ? '' : 'group-hover:rotate-45'}`}>
          {hasLiked ? '◆' : '◇'}
        </span>
        <span>NEW LIKE [ {likes} ]</span>
      </span>

      {/* クリック時の波紋エフェクト（幾何学的） */}
      {!hasLiked && (
        <span className="absolute inset-0 bg-black opacity-0 group-active:opacity-10 transition-opacity"></span>
      )}
    </button>
  );
}