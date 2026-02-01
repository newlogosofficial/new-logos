import Link from 'next/link';
import Image from 'next/image'; // 画像表示用
import { client } from '@/libs/client';

// 型定義
type Category = {
  id: string;
  name: string;
};

type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: { url: string };
  category?: Category[];
  likes?: number; // いいね数も型に追加
};

// データの再検証（60秒更新）
export const revalidate = 60;

export default async function Home() {
  // ■ 修正ポイント：最新記事と人気記事を同時に取得する（高速化）
  const [latestData, popularData] = await Promise.all([
    // 最新順 (limit: 3)
    client.get({ 
      endpoint: 'blogs', 
      queries: { limit: 3, orders: '-publishedAt' } 
    }),
    // ■ 修正ポイント：いいね数順 (orders: '-likes', limit: 3)
    client.get({ 
      endpoint: 'blogs', 
      queries: { limit: 3, orders: '-likes' } 
    })
  ]);

  const latestBlogs: Blog[] = latestData.contents;
  const popularBlogs: Blog[] = popularData.contents;

  return (
    <main className="w-full">
      
      {/* ヒーローセクション */}
      <section className="py-24 px-6 text-center flex flex-col items-center">
        
        {/* ■ 修正ポイント：アイコン画像を表示 */}
        {/* publicフォルダに icon.png を置いてください */}
        <div className="mb-8 w-24 h-24 relative">
           <Image 
             src="/icon.png" 
             alt="NewLogos Icon" 
             fill
             className="object-contain"
             priority
           />
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">NEW LOGOS</h1>
        <p className="text-xs font-mono tracking-[0.3em] text-gray-500 mb-12">LOGIC / STRUCTURE / POSSIBILITY</p>
        
        <div className="max-w-md text-sm font-medium leading-loose">
          <p>日常の思考を論理的に解体し、新しい可能性を再構築する。</p>
          <p>ここは、Axis（私）による「思考の実験室」です。</p>
        </div>
      </section>

      {/* ■ 修正ポイント：SNSリンク（4列に変更してInstagram追加） */}
      <section className="bg-black text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <a href="https://www.youtube.com/@NewLogos" target="_blank" className="group">
            <p className="text-xs font-mono text-gray-400 mb-2">VIDEO</p>
            <h3 className="text-xl md:text-2xl font-bold group-hover:underline underline-offset-4 decoration-1">YouTube</h3>
          </a>
          <a href="https://x.com/NewLogos_Axis" target="_blank" className="group">
            <p className="text-xs font-mono text-gray-400 mb-2">DIALOGUE</p>
            <h3 className="text-xl md:text-2xl font-bold group-hover:underline underline-offset-4 decoration-1">X (Twitter)</h3>
          </a>
          <a href="https://www.tiktok.com/@newlogos_axis" target="_blank" className="group">
            <p className="text-xs font-mono text-gray-400 mb-2">SHORTS</p>
            <h3 className="text-xl md:text-2xl font-bold group-hover:underline underline-offset-4 decoration-1">TikTok</h3>
          </a>
          {/* 追加：Instagram */}
          <a href="https://www.instagram.com/newlogos_axis" target="_blank" className="group">
            <p className="text-xs font-mono text-gray-400 mb-2">VISUAL</p>
            <h3 className="text-xl md:text-2xl font-bold group-hover:underline underline-offset-4 decoration-1">Instagram</h3>
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
          {latestBlogs.length > 0 ? (
            latestBlogs.map((blog) => (
              <HomeBlogCard key={blog.id} blog={blog} type="latest" />
            ))
          ) : (
            <p className="text-center font-mono text-gray-400 text-xs py-10">NO DATA YET.</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blogs?sort=latest" className="inline-block border border-black px-12 py-3 text-xs font-bold hover:bg-black hover:text-white transition-all">
            VIEW ALL (LATEST)
          </Link>
        </div>
      </section>

      {/* POPULAR LOGIC (人気記事：いいね順) */}
      <section className="max-w-4xl mx-auto px-6 py-20 bg-gray-50">
        <div className="flex items-end justify-between border-b border-black pb-2 mb-12">
          <h2 className="text-sm font-bold tracking-widest">POPULAR LOGIC</h2>
          <span className="text-xs font-mono text-gray-400">TOP_LIKED</span>
        </div>

        <div className="space-y-6">
          {popularBlogs.length > 0 ? (
             popularBlogs.map((blog) => (
               <HomeBlogCard key={blog.id} blog={blog} type="popular" />
             ))
          ) : (
             <p className="text-center font-mono text-gray-400 text-xs py-10">NO LIKES YET.</p>
          )}
        </div>

        <div className="mt-12 text-center">
          {/* 人気順ソートへのリンクがあれば理想的ですが、今は一覧へ */}
          <Link href="/blogs" className="inline-block border border-black px-12 py-3 text-xs font-bold hover:bg-black hover:text-white transition-all">
            VIEW ALL
          </Link>
        </div>
      </section>

    </main>
  );
}

// 記事カードコンポーネント
function HomeBlogCard({ blog, type }: { blog: Blog; type: 'latest' | 'popular' }) {
  const categoryName = blog.category && blog.category.length > 0 
    ? blog.category[0].name 
    : 'LOGIC';

  const date = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '.');

  return (
    <Link href={`/blogs/${blog.id}`} className="block group">
      <article className="border border-black p-0 flex flex-col md:flex-row h-auto md:h-32 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
        {/* 左側の画像エリア */}
        <div className="w-full md:w-48 bg-gray-100 shrink-0 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all border-b md:border-b-0 md:border-r border-black h-32 md:h-auto">
           {blog.eyecatch ? (
             <img src={blog.eyecatch.url} alt="" className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-mono">NO IMG</div>
           )}
           {/* 人気記事の場合はランクバッジ風の装飾をつけるのもアリ */}
           {type === 'popular' && (
             <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold px-2 py-1">
               POPULAR
             </div>
           )}
        </div>
        
        {/* 右側の情報エリア */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <h3 className="text-lg font-bold leading-tight line-clamp-2 pr-4">{blog.title}</h3>
             <span className="text-[10px] border border-black px-1.5 py-0.5 ml-2 whitespace-nowrap bg-black text-white uppercase font-bold">
               {categoryName}
             </span>
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <time className="text-xs font-mono text-gray-500">{date}</time>
            {/* いいね数を表示 */}
            <span className="text-xs font-mono font-bold">
              ♥ {blog.likes || 0}
            </span> 
          </div>
        </div>
      </article>
    </Link>
  );
}