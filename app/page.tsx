import Link from 'next/link';
import { client } from '@/libs/client';

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

  // ※NewLike人気記事はSupabase実装後に結合しますが、今は仮で最新を表示します
  const popularBlogs = latestBlogs; 

  return (
    <main className="w-full">
      
      {/* ヒーローセクション（幾何学・モノトーン） */}
      <section className="py-24 px-6 text-center flex flex-col items-center">
        {/* アイコン（画像がある場合はそれを表示） */}
        <div className="w-24 h-24 border border-black mb-8 flex items-center justify-center p-2">
             {/* 実際のロゴ画像URLがあれば imgタグに変更してください */}
             <span className="font-black text-4xl tracking-tighter">NL</span> 
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">NEW LOGOS</h1>
        <p className="text-xs font-mono tracking-[0.3em] text-gray-500 mb-12">LOGIC / STRUCTURE / POSSIBILITY</p>
        
        <div className="max-w-md text-sm font-medium leading-loose">
          <p>日常の思考を論理的に解体し、新しい可能性を再構築する。</p>
          <p>ここは、Axis（私）による「思考の実験室」です。</p>
        </div>
      </section>

      {/* 黒帯リンクエリア（SNS） */}
      <section className="bg-black text-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <a href="https://www.youtube.com/@NewLogos" target="_blank" className="group">
            <p className="text-xs font-mono text-gray-400 mb-2">VIDEO</p>
            <h3 className="text-2xl font-bold group-hover:underline underline-offset-4 decoration-1">YouTube</h3>
          </a>
          <a href="https://x.com/NewLogos_Axis" target="_blank" className="group">
            <p className="text-xs font-mono text-gray-400 mb-2">DIALOGUE</p>
            <h3 className="text-2xl font-bold group-hover:underline underline-offset-4 decoration-1">X (Twitter)</h3>
          </a>
          <a href="https://www.tiktok.com/@newlogos_axis" target="_blank" className="group">
            <p className="text-xs font-mono text-gray-400 mb-2">SHORTS</p>
            <h3 className="text-2xl font-bold group-hover:underline underline-offset-4 decoration-1">TikTok</h3>
          </a>
        </div>
      </section>

      {/* LATEST INSIGHTS (最新記事) */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between border-b border-black pb-2 mb-12">
          <h2 className="text-sm font-bold tracking-widest">LATEST INSIGHTS</h2>
          <span className="text-xs font-mono text-gray-400">ARCHIVE_NEW</span>
        </div>

        <div className="space-y-6">
          {latestBlogs.map((blog: Blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blogs?sort=latest" className="inline-block border border-black px-12 py-3 text-xs font-bold hover:bg-black hover:text-white transition-all">
            VIEW ALL (LATEST)
          </Link>
        </div>
      </section>

      {/* POPULAR LOGIC (人気記事) */}
      <section className="max-w-4xl mx-auto px-6 py-20 bg-gray-50">
        <div className="flex items-end justify-between border-b border-black pb-2 mb-12">
          <h2 className="text-sm font-bold tracking-widest">POPULAR LOGIC</h2>
          <span className="text-xs font-mono text-gray-400">TOP_LIKED</span>
        </div>

        <div className="space-y-6">
          {/* Supabase連携後にここを人気順データに差し替えます */}
          {popularBlogs.map((blog: Blog) => (
             <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blogs?sort=popular" className="inline-block border border-black px-12 py-3 text-xs font-bold hover:bg-black hover:text-white transition-all">
            VIEW ALL (POPULAR)
          </Link>
        </div>
      </section>

    </main>
  );
}

// 記事カードコンポーネント（再利用のため切り出し推奨だが、一旦ここに記述）
function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog.id}`} className="block group">
      <article className="border border-black p-0 flex flex-col md:flex-row h-auto md:h-32 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* 左側の画像エリア */}
        <div className="w-full md:w-48 bg-gray-200 shrink-0 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
           {blog.eyecatch ? (
             <img src={blog.eyecatch.url} alt="" className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">NO IMG</div>
           )}
        </div>
        
        {/* 右側の情報エリア */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <h3 className="text-lg font-bold leading-tight line-clamp-2">{blog.title}</h3>
             <span className="text-xs border border-black px-1.5 py-0.5 ml-2 whitespace-nowrap">
               {blog.category?.name || 'LOGIC'}
             </span>
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <time className="text-xs font-mono text-gray-500">{new Date(blog.publishedAt).toLocaleDateString()}</time>
            {/* ここにNewLike数を表示予定 */}
            <span className="text-xs font-mono">◇ --</span> 
          </div>
        </div>
      </article>
    </Link>
  );
}