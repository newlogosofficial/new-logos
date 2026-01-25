import { client } from "@/libs/client";
import Link from "next/link";
import Image from "next/image";

// microCMSから記事一覧を取得
async function getBlogs() {
  const data = await client.get({
    endpoint: "blogs",
  });
  return data.contents;
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white relative overflow-hidden">
      
      {/* 背景：論理的グリッドシステム（全ページ共通） */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
           style={{
             backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto border-l border-r border-black min-h-screen bg-white/90 backdrop-blur-sm">
        
        {/* HERO SECTION: ブランド定義 */}
        <section className="border-b border-black p-12 md:p-16 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24 border border-black p-1 bg-white">
              <Image src="/icon.png" alt="Axis Icon" fill className="object-cover" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">NEW LOGOS</h1>
          <p className="text-xs font-mono tracking-[0.2em] uppercase opacity-70 mb-8">
            Logic / Structure / Possibility
          </p>
          
          <div className="text-sm font-medium leading-loose max-w-lg mx-auto text-justify md:text-center opacity-80">
            <p>
              日常の思考を論理的に解体し、新しい可能性を再構築する。<br className="hidden md:inline"/>
              ここは、Axis（私）による「思考の実験室」です。
            </p>
          </div>
        </section>

        {/* LINKAGE: SNSエコシステム */}
        <section className="border-b border-black grid grid-cols-3 divide-x divide-black bg-black text-white">
          <a href="https://www.youtube.com/@NewLogos" target="_blank" rel="noopener noreferrer" 
             className="p-4 py-6 text-center hover:bg-white hover:text-black transition-colors group">
            <span className="text-[10px] uppercase tracking-widest block opacity-50 group-hover:opacity-100 mb-1">Video</span>
            <span className="font-bold text-sm md:text-base">YouTube</span>
          </a>
          <a href="https://x.com/LogosNew1809" target="_blank" rel="noopener noreferrer"
             className="p-4 py-6 text-center hover:bg-white hover:text-black transition-colors group">
            <span className="text-[10px] uppercase tracking-widest block opacity-50 group-hover:opacity-100 mb-1">Dialogue</span>
            <span className="font-bold text-sm md:text-base">X (Twitter)</span>
          </a>
          <a href="https://www.tiktok.com/@newlogos.official" target="_blank" rel="noopener noreferrer"
             className="p-4 py-6 text-center hover:bg-white hover:text-black transition-colors group">
            <span className="text-[10px] uppercase tracking-widest block opacity-50 group-hover:opacity-100 mb-1">Shorts</span>
            <span className="font-bold text-sm md:text-base">TikTok</span>
          </a>
        </section>

        {/* LATEST INSIGHTS: 記事一覧 */}
        <main className="p-8 md:p-12">
          <div className="flex justify-between items-end mb-8 border-b border-black pb-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em]">
              Latest Insights
            </h2>
            <span className="text-[10px] font-mono opacity-50">ARCHIVE_01</span>
          </div>

          <div className="space-y-6">
            {blogs.length === 0 ? (
              <p className="text-sm opacity-50 py-10 text-center font-mono">Waiting for the first logic to be deployed...</p>
            ) : (
              blogs.map((blog: any) => (
                <Link href={`/blog/${blog.id}`} key={blog.id} className="block group">
                  <article className="border border-black p-6 transition-all duration-300 hover:bg-black hover:text-white relative top-0 hover:-top-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-baseline mb-3 text-[10px] font-mono opacity-60 group-hover:opacity-80">
                      <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      <span className="uppercase border border-current px-2 py-0.5">
                        {blog.category && blog.category.name}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4">
                      {blog.title}
                    </h3>
                  </article>
                </Link>
              ))
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-neutral-100 border-t border-black p-8 text-center text-[10px] font-mono text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Axis / New Logos. All Logic Reserved.</p>
        </footer>

      </div>
    </div>
  );
}