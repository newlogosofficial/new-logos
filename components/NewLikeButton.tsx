"use client";
import { useState } from 'react';

export default function NewLikeButton({ blogId }: { blogId: string }) {
  const [likes, setLikes] = useState(0); // 初期値0
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) return;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
  };

  return (
    <button 
      onClick={handleLike}
      disabled={hasLiked}
      className={`group border border-black px-10 py-3 font-bold text-sm transition-all duration-300 ${hasLiked ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
    >
      <span className="flex items-center gap-3">
        <span className={`text-lg ${hasLiked ? '' : 'group-hover:rotate-45 transition-transform'}`}>
          {hasLiked ? '◆' : '◇'}
        </span>
        <span>NEW LIKE {likes > 0 && `[ ${likes} ]`}</span>
      </span>
    </button>
  );
}