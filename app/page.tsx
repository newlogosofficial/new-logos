import { client } from "@/libs/client";
import Link from "next/link";

// 記事の型定義
type Blog = {
  id: string;
  title: string;
  category: string[];
  publishedAt: string;
};

// データを取得する非同期関数
async function getBlogs() {
  const data = await client.get({ endpoint: "blogs" });
  return data.contents;
}

export default async function Home() {
  const blogs: Blog[] = await getBlogs();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* 幾何学的背景 */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      {/* ヘッダー */}
      <header className="relative z-10 border-b border-black p-6 md:p-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter leading-none">NEW LOGOS</h1>
          <p className="text-xs mt-3 tracking-[0.3em] uppercase">Logical Structure & Aesthetics</p>
        </div>
      </header>

      {/* メインレイアウト */}
      <main className="relative z-10 grid grid-cols-1 md:grid-cols-12 min-h-screen border-b border-black">
        
        {/* 左サイドバー: 固定情報 */}
        <aside className="md:col-span-4 lg:col-span-3 border-r border-black p-8">
          <div className="sticky top-12">
            <h2 className="text-xs font-bold mb-6 uppercase tracking-widest border-b border-black pb-2 inline-block">Menu</h2>
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <Link href="/" className="hover:underline decoration-1 underline-offset-4">INDEX</Link>
              <Link href="/about" className="hover:underline decoration-1 underline-offset-4">ABOUT</Link>
            </nav>
            
            <div className="mt-12">
              <h2 className="text-xs font-bold mb-6 uppercase tracking-widest border-b border-black pb-2 inline-block">Concept</h2>
              <p className="text-xs leading-loose text-justify">
                感情やノイズを排し、論理と構造のみで世界を再定義する。<br/>
                We maximize entropy via structure.
              </p>
            </div>
          </div>
        </aside>

        {/* 記事一覧エリア */}
        <section className="md:col-span-8 lg:col-span-9">
          {blogs.map((blog) => (
            <article key={blog.id} className="group border-b border-black p-8 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer">
              <Link href={`/blog/${blog.id}`} className="block">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4 gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{blog.title}</h3>
                  <div className="flex gap-4 text-xs font-mono opacity-60 group-hover:opacity-100">
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    <span className="uppercase border border-current px-1">{blog.category}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                   <span className="text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">READ LOGIC →</span>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}