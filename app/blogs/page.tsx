import Link from 'next/link';
import { client } from '@/libs/client';
import BlogCard from '@/components/BlogCard';

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}) {
  // 1. パラメータを確定させる
  const { category, sort, page } = await searchParams;
  
  // 2. カテゴリ一覧を取得（ボタン表示用）
  let categories = [];
  try {
    const data = await client.get({ endpoint: 'categories' });
    categories = data.contents;
  } catch (e) {
    console.log("No categories endpoint found or empty.");
  }

  // 3. 記事データのクエリ作成
  const currentPage = parseInt(page || '1', 10);
  const limit = 10;
  
  const queries: any = { 
    limit,
    offset: (currentPage - 1) * limit,
    orders: sort === 'oldest' ? 'publishedAt' : '-publishedAt',
  };
  
  // ★修正箇所：複数選択に対応するため [contains] を使用
  // これで「そのカテゴリを含んでいる記事」をすべて取得できます
  if (category) {
    queries.filters = `category[contains]${category}`;
  }
  
  // 4. 記事取得
  const { contents, totalCount } = await client.get({ endpoint: 'blogs', queries });
  const totalPages = Math.ceil(totalCount / limit);

  // 現在のカテゴリ名（タイトル表示用）
  const currentCategoryName = categories.find((c: any) => c.id === category)?.name;
  // 現在のソート（ボタンの色用）
  const currentSort = sort || 'latest';

  return (
    <div className="w-full">
      {/* ヘッダーエリア */}
      <header className="mb-12 border-b border-black pb-4 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
              {currentCategoryName ? `CAT: ${currentCategoryName}` : "LOGIC ARCHIVE"}
            </h1>
            <p className="text-xs font-mono text-gray-500 mt-2">
              {totalCount} RECORDS FOUND
            </p>
          </div>

          {/* 並べ替えボタン */}
          <div className="flex gap-2 text-xs font-bold font-mono">
            <Link 
              href={`/blogs?sort=latest${category ? `&category=${category}` : ''}`} 
              className={`px-3 py-1 border border-black transition-colors ${currentSort === 'latest' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              LATEST
            </Link>
            <Link 
              href={`/blogs?sort=oldest${category ? `&category=${category}` : ''}`} 
              className={`px-3 py-1 border border-black transition-colors ${currentSort === 'oldest' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              OLDEST
            </Link>
          </div>
        </div>

        {/* カテゴリフィルタボタン */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Link 
              href="/blogs"
              className={`text-[10px] font-bold px-3 py-1 border border-black transition-colors ${!category ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              ALL
            </Link>
            {categories.map((cat: any) => (
              <Link 
                key={cat.id}
                href={`/blogs?category=${cat.id}${sort ? `&sort=${sort}` : ''}`}
                className={`text-[10px] font-bold px-3 py-1 border border-black transition-colors ${category === cat.id ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 記事リスト */}
      <div className="space-y-4 min-h-[50vh]">
        {contents.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300">
            <p className="font-mono text-gray-400 mb-4 text-sm">NO LOGIC FOUND.</p>
            <Link href="/blogs" className="text-xs border-b border-black pb-1 font-bold">CLEAR FILTER</Link>
          </div>
        ) : (
          contents.map((blog: any) => <BlogCard key={blog.id} blog={blog} />)
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2 font-mono text-sm">
           {currentPage > 1 ? (
             <Link 
               href={`/blogs?page=${currentPage - 1}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}`} 
               className="border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
             >
               &lt; PREV
             </Link>
           ) : (
             <span className="border border-gray-200 text-gray-300 px-4 py-2">&lt; PREV</span>
           )}
           
           <span className="border-t border-b border-black px-4 py-2 flex items-center">
             {currentPage} / {totalPages}
           </span>
           
           {currentPage < totalPages ? (
             <Link 
               href={`/blogs?page=${currentPage + 1}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}`} 
               className="border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
             >
               NEXT &gt;
             </Link>
           ) : (
             <span className="border border-gray-200 text-gray-300 px-4 py-2">NEXT &gt;</span>
           )}
        </div>
      )}
    </div>
  );
}