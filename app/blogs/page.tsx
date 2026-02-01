import Link from 'next/link';
import { client } from '@/libs/client';
import BlogCard from '@/components/BlogCard';

// 再検証時間を設定
export const revalidate = 60;

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}) {
  const { category, sort, page } = await searchParams;
  
  // 1. カテゴリ一覧を「記事データ」から抽出する
  // 記事で実際に使われているカテゴリだけをボタンにする
  let availableCategories: string[] = [];
  try {
    const allData = await client.get({ 
      endpoint: 'blogs', 
      queries: { fields: 'category', limit: 100 } 
    });
    
    // 全記事のカテゴリを平坦化して重複を除去
    const rawCategories = allData.contents.flatMap((blog: any) => blog.category || []);
    // オブジェクトか文字列かを判定して名前だけ抽出
    const categoryNames = rawCategories.map((c: any) => typeof c === 'string' ? c : c.name);
    // 重複を削除してリスト化
    availableCategories = Array.from(new Set(categoryNames)) as string[];
  } catch (e) {
    console.log("Failed to fetch categories from blogs.");
  }

  // 2. 表示する記事データの取得
  const currentPage = parseInt(page || '1', 10);
  const limit = 10;
  
  const queries: any = { 
    limit,
    offset: (currentPage - 1) * limit,
    orders: sort === 'oldest' ? 'publishedAt' : '-publishedAt',
  };
  
  // フィルター処理
  if (category) {
    // 日本語のまま検索
    queries.filters = `category[contains]${category}`;
  }
  
  const { contents, totalCount } = await client.get({ endpoint: 'blogs', queries });
  const totalPages = Math.ceil(totalCount / limit);

  const currentSort = sort || 'latest';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* ヘッダーエリア */}
      <header className="mb-12 border-b border-black pb-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">
              {/* 日本語でそのまま表示 */}
              {category ? `CAT: ${category}` : "LOGIC ARCHIVE"}
            </h1>
            <p className="text-xs font-mono text-gray-500">
              {totalCount} RECORDS FOUND
            </p>
          </div>

          {/* 並べ替えボタン */}
          <div className="flex gap-2 text-xs font-bold font-mono">
            <Link 
              href={`/blogs?sort=latest${category ? `&category=${category}` : ''}`} 
              className={`px-4 py-2 border border-black transition-colors ${currentSort === 'latest' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              LATEST
            </Link>
            <Link 
              href={`/blogs?sort=oldest${category ? `&category=${category}` : ''}`} 
              className={`px-4 py-2 border border-black transition-colors ${currentSort === 'oldest' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              OLDEST
            </Link>
          </div>
        </div>

        {/* カテゴリフィルタボタン */}
        {availableCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Link 
              href="/blogs"
              className={`text-[10px] font-bold font-mono px-4 py-2 border border-black transition-colors uppercase tracking-wider ${!category ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              ALL
            </Link>
            {availableCategories.map((catName) => (
              <Link 
                key={catName}
                // 日本語のままURLに入れて、日本語のまま表示する
                href={`/blogs?category=${catName}${sort ? `&sort=${sort}` : ''}`}
                className={`text-[10px] font-bold font-mono px-4 py-2 border border-black transition-colors uppercase tracking-wider ${category === catName ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                {catName}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 記事リスト */}
      <div className="space-y-6 min-h-[50vh]">
        {contents.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-300">
            <p className="font-mono text-gray-400 mb-4 text-sm">NO LOGIC FOUND.</p>
            <Link href="/blogs" className="text-xs border-b border-black pb-1 font-bold">CLEAR FILTER</Link>
          </div>
        ) : (
          contents.map((blog: any) => <BlogCard key={blog.id} blog={blog} />)
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-center gap-0 font-mono text-sm border-t border-black pt-8">
           {currentPage > 1 ? (
             <Link 
               href={`/blogs?page=${currentPage - 1}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}`} 
               className="border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors border-r-0"
             >
               &lt; PREV
             </Link>
           ) : (
             <span className="border border-gray-200 text-gray-300 px-6 py-3 border-r-0">&lt; PREV</span>
           )}
           
           <span className="border border-black px-6 py-3 flex items-center bg-black text-white">
             {currentPage} / {totalPages}
           </span>
           
           {currentPage < totalPages ? (
             <Link 
               href={`/blogs?page=${currentPage + 1}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}`} 
               className="border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors border-l-0"
             >
               NEXT &gt;
             </Link>
           ) : (
             <span className="border border-gray-200 text-gray-300 px-6 py-3 border-l-0">NEXT &gt;</span>
           )}
        </div>
      )}
    </div>
  );
}