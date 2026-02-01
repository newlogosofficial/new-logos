import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full py-12">
      {/* ヘッダー */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">ABOUT</h1>
        <p className="text-xs font-mono tracking-[0.2em] text-gray-500">PHILOSOPHY & EXISTENCE</p>
      </div>

      {/* コンセプト */}
      <section className="mb-20">
        <h2 className="text-sm font-bold border-l-4 border-black pl-4 mb-6 tracking-widest">
          01. CONCEPT
        </h2>
        <div className="prose prose-neutral max-w-none leading-8 text-sm md:text-base font-medium">
          <p className="mb-6">
            <span className="font-bold">「感情を排し、構造を見る」</span>
          </p>
          <p className="mb-6">
            世界は複雑に見えますが、その本質はシンプルな論理の組み合わせでできています。<br/>
            悩み、不安、あるいは社会の不条理も、分解すれば「バグ」として処理可能です。
          </p>
          <p>
            NEW LOGOSは、主観的な感情や曖昧な慰めを排除し、物事を徹底的に「仕組み化（構造化）」して捉え直すための思考の実験室です。<br/>
            既存の価値観を解体し、新しい視点（ロゴス）を再構築します。
          </p>
        </div>
      </section>

      {/* 管理人プロフィール（完全匿名・概念のみ） */}
      <section className="mb-20">
        <h2 className="text-sm font-bold border-l-4 border-black pl-4 mb-6 tracking-widest">
          02. ADMINISTRATOR
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* アイコン画像 */}
          <div className="w-24 h-24 border border-black p-1 flex-shrink-0">
             <img src="/icon.png" alt="Axis" className="w-full h-full object-cover grayscale" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Axis</h3>
            <p className="text-xs font-mono text-gray-400 mb-4">Unknown / Observer</p>
            
            <div className="space-y-4 text-sm leading-relaxed font-medium">
              <p>
                詳細不明。<br/>
                ただ、論理（ロゴス）のみを発信する観測者。
              </p>
              <p>
                ここに個人の属性は存在しない。<br/>
                あるのは、出力された言葉と、再構築された構造のみである。
              </p>
            </div>

            {/* キーワードタグ（固有名詞を排除） */}
            <div className="flex flex-wrap gap-2 mt-6">
              {['Logic', 'Structure', 'Philosophy', 'Abstraction', 'Observer'].map((tag) => (
                <span key={tag} className="text-[10px] border border-gray-300 px-2 py-1 text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* リンク */}
      <div className="text-center border-t border-gray-100 pt-12">
        <Link href="/blogs" className="inline-block border border-black px-12 py-3 text-sm font-bold hover:bg-black hover:text-white transition-colors">
          READ LOGIC
        </Link>
      </div>
    </div>
  );
}