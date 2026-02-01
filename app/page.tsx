import Link from 'next/link';
import { client } from '@/libs/client';
import BootOpener from '@/components/BootOpener';
import BlogCard from '@/components/BlogCard';

// microCMSの記事型定義
type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: { url: string };
  category?: { name: string };
};

export default async function Home() {
  // 最新記事を3件取得
  const { contents: latestBlogs } = await client.get({ 
    endpoint: 'blogs', 
    queries: { limit: 3 } 
  });

  return (
    <div className="w-full">
      <BootOpener />

      {/* ヒーローセクション */}
      <section className="py-16 md:py-24 text-center flex flex-col items-center">
        
        {/* 中央ロゴ：画像を表示 */}
        <div className="w-24 h-24 border border-black mb-8 p-1 flex items-center justify-center">
          <img src="/icon.png" alt="NEW LOGOS" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">NEW LOGOS</h1>
        <p className="text-xs font-mono tracking-[0.3em] text-gray-500 mb-10">LOGIC / STRUCTURE / POSSIBILITY</p>
        
        <div className="text-sm font-medium leading-loose text-gray-800 font-sans">
          <p>日常の思考を論理的に解体し、新しい可能性を再構築する。</p>
          <p>ここは、Axis（管理人）による「思考の実験室」です。</p>
        </div>
      </section>

      {/* SNSリンク（Instagram追加済み） */}
      <section className="bg-black text-white py-12 -mx-6 px-6 shadow-inner">
        {/* grid-cols-4 にして4つ並ぶように調整 */}
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <a href="https://www.youtube.com/@NewLogos" target="_blank" className="group">
            <p className="text-[10px] font-mono text-gray-400 mb-1">VIDEO</p>
            <h3 className="text-lg font-bold group-hover:underline underline-offset-4 decoration-1">YouTube</h3>
          </a>
          <a href="https://x.com/NewLogos_Axis" target="_blank" className="group">
            <p className="text-[10px] font-mono text-gray-400 mb-1">DIALOGUE</p>
            <h3 className="text-lg font-bold group-hover:underline underline-offset-4 decoration-1">X (Twitter)</h3>
          </a>
          <a href="https://www.tiktok.com/@newlogos_axis" target="_blank" className="group">
            <p className="text-[10px] font-mono text-gray-400 mb-1">SHORTS</p>
            <h3 className="text-lg font-bold group-hover:underline underline-offset-4 decoration-1">TikTok</h3>
          </a>
          <a href="https://www.instagram.com/newlogos_axis" target="_blank" className="group">
            <p className="text-[10px] font-mono text-gray-400 mb-1">VISUAL</p>
            <h3 className="text-lg font-bold group-hover:underline underline-offset-4 decoration-1">Instagram</h3>
          </a>
        </div>
      </section>

      {/* 最新記事リスト */}
      <section className="py-20">
        <div className="flex items-end justify-between border-b border-black pb-2 mb-10">
          <h2 className="text-sm font-bold tracking-widest">LATEST INSIGHTS</h2>
          <span className="text-xs font-mono text-gray-400">ARCHIVE_NEW</span>
        </div>

        <div className="space-y-8">
          {latestBlogs.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">NO LOGIC FOUND.</p>
          ) : (
            latestBlogs.map((blog: Blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blogs" className="inline-block border-b border-black pb-1 text-xs font-bold hover:opacity-50 transition-opacity">
            VIEW ALL ARCHIVES
          </Link>
        </div>
      </section>

    </div>
  );
}