import Link from 'next/link';
import { client } from '@/libs/client';
import BlogCard from '@/components/BlogCard';

// URLパラメータを受け取る設定
export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string; page?: string };
}) {
  const { q, category, sort, page } = searchParams;
  
  // ページネーション計算
  const currentPage = parseInt(page || '1', 10);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // microCMSクエリの構築
  const queries: any = { limit, offset };
  if (q) queries.q = q;
  if (category) queries.filters = `category[equals]${category}`;
  // microCMS標準は公開日順。人気順はDBが必要なため、UIのみ実装し動作は標準と同じにします。
  if (sort === 'oldest') queries.orders = 'publishedAt'; 
  
  const { contents, totalCount } = await client.get({ endpoint: 'blogs', queries });
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 w-full">
      
      {/* ページヘッダー */}
      <header className="mb-12 border-b border-black pb-4 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">LOGIC ARCHIVE</h1>
          <p className="text-xs font-mono text-gray-500 mt-2">ALL RECORDS OF THOUGHTS</p>
        </div>

        {/* ソート機能 */}
        <div className="flex gap-2 text-xs font-bold font-mono">
          <Link href="/blogs?sort=popular" className={`px-3 py-1 border border-black ${sort === 'popular' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>POPULAR</Link>
          <Link href="/blogs" className={`px-3 py-1 border border-black ${!sort ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>LATEST</Link>
          <Link href="/blogs?sort=oldest" className={`px-3 py-1 border border-black ${sort === 'oldest' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>OLDEST</Link>
        </div>
      </header>

      {/* カテゴリ絞り込み (簡易実装: 必要ならmicroCMSからカテゴリ一覧を取得してループさせる) */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        <Link href="/blogs" className="whitespace-nowrap px-4 py-1 bg-gray-100 text-xs hover:bg-black hover:text-white transition-colors">ALL</Link>
        <Link href="/blogs?category=programming" className="whitespace-nowrap px-4 py-1 bg-gray-100 text-xs hover:bg-black hover:text-white transition-colors">PROGRAMMING</Link>
        <Link href="/blogs?category=philosophy" className="whitespace-nowrap px-4 py-1 bg-gray-100 text-xs hover:bg-black hover:text-white transition-colors">PHILOSOPHY</Link>
        <Link href="/blogs?category=daily" className="whitespace-nowrap px-4 py-1 bg-gray-100 text-xs hover:bg-black hover:text-white transition-colors">DAILY</Link>
      </div>

      {/* 記事リスト */}
      <div className="space-y-4 min-h-[50vh]">
        {contents.length === 0 ? (
          <p className="text-center py-20 font-mono text-gray-400">NO LOGIC FOUND.</p>
        ) : (
          contents.map((blog: any) => <BlogCard key={blog.id} blog={blog} />)
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2 font-mono text-sm">
           {/* 前へ */}
           {currentPage > 1 ? (
             <Link href={`/blogs?page=${currentPage - 1}`} className="border border-black px-4 py-2 hover:bg-black hover:text-white">&lt; PREV</Link>
           ) : (
             <span className="border border-gray-200 text-gray-300 px-4 py-2">&lt; PREV</span>
           )}

           {/* ページ番号（簡易表示） */}
           <span className="border-t border-b border-black px-4 py-2 flex items-center">
             Page {currentPage} / {totalPages}
           </span>

           {/* 次へ */}
           {currentPage < totalPages ? (
             <Link href={`/blogs?page=${currentPage + 1}`} className="border border-black px-4 py-2 hover:bg-black hover:text-white">NEXT &gt;</Link>
           ) : (
             <span className="border border-gray-200 text-gray-300 px-4 py-2">NEXT &gt;</span>
           )}
        </div>
      )}
    </main>
  );
}