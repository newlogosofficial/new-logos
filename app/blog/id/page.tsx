import { client } from "@/libs/client";
import Image from "next/image";

// microCMSから記事データを取得する関数
async function getBlogData(id: string) {
  const data = await client.get({
    endpoint: "blogs",
    contentId: id,
  });
  return data;
}

// 記事詳細ページの構築
export default async function BlogPage({ params }: { params: { id: string } }) {
  const blog = await getBlogData(params.id);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white relative overflow-hidden">
      
      {/* 背景：論理的なグリッドシステム（不透明度を下げてノイズにならないように配置） */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
           style={{
             backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* メインコンテンツエリア */}
      <div className="relative z-10 max-w-3xl mx-auto border-l border-r border-black min-h-screen bg-white/90 backdrop-blur-sm">
        
        {/* ヘッダーセクション */}
        <header className="border-b border-black p-8 md:p-12">
          <div className="flex justify-between items-start mb-10">
            {/* アイコン：Axisの視覚的アンカー */}
            <div className="relative w-16 h-16 border border-black bg-white">
              <Image 
                src="/icon.png" 
                alt="New Logos Icon" 
                fill 
                className="object-cover p-1"
              />
            </div>
            
            {/* メタ情報：幾何学的配置 */}
            <div className="text-right text-[10px] font-mono leading-relaxed opacity-70">
              ID: {blog.id}<br/>
              PUBLISHED: {new Date(blog.publishedAt).toLocaleDateString()}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="inline-block border border-black px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold">
            Category: {blog.category && blog.category.name}
          </div>
        </header>

        {/* 記事本文エリア */}
        <main className="p-8 md:p-12 prose prose-neutral max-w-none text-justify leading-loose"
              dangerouslySetInnerHTML={{ __html: blog.content }}>
        </main>

        {/* フッター：著者情報と理念 */}
        <footer className="border-t border-black p-8 md:p-12 bg-black text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* 左側：Author & Philosophy */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-4 border-b border-white/30 pb-2 inline-block">
                Author: Axis
              </h2>
              <p className="text-xs leading-7 opacity-80 font-light">
                私は、日常の当たり前を少しだけ分解し、新しい形に組み立て直す「思考の実験」を発信しています。<br className="hidden md:block" />
                硬直化した考えを解きほぐし、自由な可能性を皆さんと一緒に探していきたいと考えています。
              </p>
            </div>

            {/* 右側：Status & Contact */}
            <div className="text-xs space-y-6 md:text-right">
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-1 opacity-50">Status</h3>
                <p className="font-mono">Age: Undisclosed<br/>Location: Kagoshima, JP</p>
              </div>
              
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-1 opacity-50">Contact</h3>
                <a href="mailto:newlogos.official@gmail.com" className="font-mono underline decoration-1 underline-offset-4 hover:opacity-100 transition-opacity">
                  newlogos.official@gmail.com
                </a>
                <p className="mt-2 opacity-60 text-[10px]">
                  質問・対話・ご意見は大歓迎です。
                </p>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}