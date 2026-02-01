import Link from 'next/link';
import { client } from '@/libs/client'; // microCMSのクライアント
import BootOpener from '@/components/BootOpener';

// 型定義
type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: { url: string; height: number; width: number };
};

export default async function Home() {
  const { contents } = await client.get({ endpoint: 'blogs' });

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* 起動アニメーション */}
      <BootOpener />

      {/* ヘッダーエリア */}
      <header className="pt-24 pb-12 px-6 text-center border-b border-gray-200">
        <div className="mb-4 inline-block border border-black p-2">
          <span className="font-bold text-2xl tracking-tighter">NL</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">NEW LOGOS</h1>
        <p className="text-xs font-mono tracking-widest text-gray-500">LOGIC / STRUCTURE / POSSIBILITY</p>
      </header>

      {/* 記事一覧エリア */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-2">
          <h2 className="text-sm font-bold tracking-widest">LATEST INSIGHTS</h2>
          <span className="text-xs font-mono text-gray-400">ARCHIVE_01</span>
        </div>

        <div className="space-y-8">
          {contents.map((blog: Blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className="block group">
              <article className="flex flex-col md:flex-row gap-6 items-start transition-opacity duration-300 hover:opacity-70">
                {/* 画像エリア（存在する場合のみ表示） */}
                {blog.eyecatch && (
                  <div className="w-full md:w-48 aspect-video bg-gray-100 border border-gray-200 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                    <img src={blog.eyecatch.url} alt="" className="object-cover w-full h-full" />
                  </div>
                )}
                
                {/* テキストエリア */}
                <div className="flex-1 pt-2">
                  <time className="block text-xs font-mono text-gray-500 mb-2">
                    {new Date(blog.publishedAt).toLocaleDateString()}
                  </time>
                  <h3 className="text-xl md:text-2xl font-bold leading-snug group-hover:underline decoration-1 underline-offset-4">
                    {blog.title}
                  </h3>
                  <div className="mt-4 flex justify-end">
                     <span className="text-xs border border-black px-2 py-0.5">READ LOGIC</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer className="py-12 text-center text-xs font-mono text-gray-400 border-t border-gray-100">
        <p>&copy; 2026 NewLogos / Axis. All Logic Reserved.</p>
      </footer>
    </main>
  );
}