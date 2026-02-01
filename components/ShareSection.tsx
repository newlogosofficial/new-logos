'use client';

import { useState } from 'react';

type Props = {
  id: string;
  title: string;
};

export default function ShareSection({ id, title }: Props) {
  const [copied, setCopied] = useState(false);

  // 本番環境のドメイン（変更してください、またはwindow.locationを使っても可）
  // VercelのURLが確定していない場合は window.location.origin を使うのが安全です
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/blogs/${id}`
    : `https://new-logos.vercel.app/blogs/${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 訂正提案の宛先（メール または GoogleフォームのURLなどに書き換えてください）
  // 今回は仮で「X（Twitter）へのDM」または「メール」を想定
  const feedbackSubject = encodeURIComponent(`Correction Proposal: ${title}`);
  const feedbackLink = `mailto:your-email@example.com?subject=${feedbackSubject}&body=Found a logic error in "${title}":%0D%0A%0D%0A`; 

  return (
    <div className="border-t border-b border-black py-8 my-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      
      {/* シェア機能エリア */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Share Logic</span>
        <div className="flex gap-3">
          {/* X (Twitter) */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-6 flex items-center justify-center border border-black text-xs font-bold hover:bg-black hover:text-white transition-colors"
          >
            X / POST
          </a>

          {/* URLコピー */}
          <button
            onClick={handleCopy}
            className={`
              h-10 px-6 flex items-center justify-center border border-black text-xs font-bold transition-all min-w-[100px]
              ${copied ? 'bg-black text-white' : 'hover:bg-gray-100'}
            `}
          >
            {copied ? 'COPIED' : 'COPY URL'}
          </button>
        </div>
      </div>

      {/* 訂正提案エリア */}
      <div className="flex flex-col gap-2 items-start md:items-end">
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Debug Content</span>
        <a
          href={feedbackLink}
          className="text-xs font-mono underline underline-offset-4 decoration-1 text-gray-600 hover:text-black hover:decoration-2"
        >
          訂正を提案する / Report Issue &rarr;
        </a>
      </div>

    </div>
  );
}