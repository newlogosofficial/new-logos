import Link from 'next/link';
import { client } from '@/libs/client';
import BlogCard from '@/components/BlogCard';

/* ▼ Next.js 15対応: searchParamsをPromiseとして定義 */
export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  // ★ここでawaitしてパラメータを確定させる（これでボタンの色が変わるようになります）
  const { q, category, sort, page } = await searchParams;
  
  const currentPage = parseInt(page || '1', 10);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // microCMSへのクエリ作成
  const queries: any = { limit, offset };
  
  if (q) queries.q = q;
  if (category) queries.filters = `category[equals]${category}`;

  // ソート順のロジック
  if (sort === 'oldest') {
    queries.orders = 'publishedAt'; // 古い順
  } else {
    // デフォルト または latest または popular
    queries.orders = '-publishedAt'; // 新しい順
  }
  
  const { contents, totalCount } = await client.get({ endpoint: 'blogs', queries });
  const totalPages = Math.ceil(totalCount / limit);

  // 現在のソート状態（ボタンの色変え用）
  const currentSort = sort || 'latest';

  return (
    <div className="w-full">
      <header className="mb-12 border-b border-black pb-4 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">LOGIC ARCHIVE</h1>
          <p className="text-xs font-mono text-gray-500 mt-2">ALL RECORDS OF THOUGHTS</p>
        </div>

        {/* 並べ替えボタンエリア */}
        <div className="flex gap-2 text-xs font-bold font-mono">
          {/* 人気順（今はまだ機能がないので見た目だけ。動きは最新順と同じ） */}
          <Link 
            href="/blogs?sort=popular" 
            className={`px-3 py-1 border border-black transition-colors ${currentSort === 'popular' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            POPULAR
          </Link>

          {/* 最新順 */}
          <Link 
            href="/blogs?sort=latest" 
            className={`px-3 py-1 border border-black transition-colors ${currentSort === 'latest' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            LATEST
          </Link>

          {/* 古い順 */}
          <Link 
            href="/blogs?sort=oldest" 
            className={`px-3 py-1 border border-black transition-colors ${currentSort === 'oldest' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            OLDEST
          </Link>
        </div>
      </header>

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
           {currentPage > 1 ? (
             <Link href={`/blogs?page=${currentPage - 1}${sort ? `&sort=${sort}` : ''}`} className="border border-black px-4 py-2 hover:bg-black hover:text-white">&lt; PREV</Link>
           ) : (
             <span className="border border-gray-200 text-gray-300 px-4 py-2">&lt; PREV</span>
           )}
           <span className="border-t border-b border-black px-4 py-2 flex items-center">
             Page {currentPage} / {totalPages}
           </span>
           {currentPage < totalPages ? (
             <Link href={`/blogs?page=${currentPage + 1}${sort ? `&sort=${sort}` : ''}`} className="border border-black px-4 py-2 hover:bg-black hover:text-white">NEXT &gt;</Link>
           ) : (
             <span className="border border-gray-200 text-gray-300 px-4 py-2">NEXT &gt;</span>
           )}
        </div>
      )}
    </div>
  );
}