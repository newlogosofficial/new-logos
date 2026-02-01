"use client";

import { useState, useEffect } from 'react';

export default function BootOpener() {
  const [stage, setStage] = useState(0); // 0:Init, 1:Text, 2:Sub, 3:Finish

  useEffect(() => {
    // ステップ実行: ブリンク -> 日本語 -> 英語 -> フェードアウト
    const timer1 = setTimeout(() => setStage(1), 800);
    const timer2 = setTimeout(() => setStage(2), 1800);
    const timer3 = setTimeout(() => setStage(3), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (stage === 3) return null; // アニメーション終了後はDOMから消滅

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-1000 ${stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="font-mono text-black text-center px-4">
        {/* カーソル点滅演出 */}
        <div className="mb-4 text-sm animate-pulse">_initializing_logos</div>

        {/* メインメッセージ */}
        <h1 className={`text-xl md:text-3xl font-bold transition-all duration-700 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          世界を解体し、新しい論理を作る
        </h1>

        {/* サブメッセージ（英語） */}
        <p className={`mt-2 text-xs md:text-sm text-gray-500 tracking-widest transition-all duration-700 delay-200 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          Deconstruct the world, construct a new logic.
        </p>
      </div>
    </div>
  );
}