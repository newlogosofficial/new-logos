import Link from 'next/link';
import { client } from '@/libs/client';
import BlogCard from '@/components/BlogCard';

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string; page?: string };
}) {
  const { q, category, sort, page } = searchParams;
  
  const currentPage = parseInt(page || '1', 10);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // ▼ ここを修正：並べ替えロジック
  const queries: any = { limit, offset };
  
  if (q) queries.q = q;
  if (category) queries.filters = `category[equals]${category}`;

  // ソート順の指定（microCMSの仕様に合わせる）
  if (sort === 'oldest') {
    queries.orders = 'publishedAt'; // 古い順（昇順）
  } else {
    queries.orders = '-publishedAt'; // 新しい順（降順・デフォルト）
  }
  
  // ※「人気順(popular)」はDB未連携のため、現状は「新しい順」と同じ動作になります
  
  const { contents, totalCount } = await client.get({ endpoint: 'blogs', queries });
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="w-full">
      <header className="mb-12 border-b border-black pb-4 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">LOGIC ARCHIVE</h1>
          <p className="text-xs font-mono text-gray-500 mt-2">ALL RECORDS OF THOUGHTS</p>
        </div>

        <div className="flex gap-2 text-xs font-bold font-mono">
          <Link href="/blogs?sort=popular" className={`px-3 py-1 border border-black ${sort === 'popular' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>POPULAR</Link>
          <Link href="/blogs" className={`px-3 py-1 border border-black ${!sort ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>LATEST</Link>
          <Link href="/blogs?sort=oldest" className={`px-3 py-1 border border-black ${sort === 'oldest' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>OLDEST</Link>
        </div>
      </header>

      {/* ... (カテゴリ・記事リスト・ページネーションは変更なし) ... */}
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