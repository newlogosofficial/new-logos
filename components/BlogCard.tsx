import Link from 'next/link';

// カテゴリは「文字(string)」か「オブジェクト」のどちらか
type Category = string | { id: string; name: string };

type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  category: Category[]; // どちらが来てもOKにする
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
};

export default function BlogCard({ blog }: { blog: Blog }) {
  const date = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '.');

  return (
    <Link href={`/blogs/${blog.id}`} className="block group">
      <article className="flex flex-col md:flex-row gap-6 items-start border-b border-gray-200 pb-6 mb-6">
        
        {/* アイキャッチ画像 */}
        <div className="w-full md:w-1/3 aspect-video bg-gray-100 overflow-hidden border border-black relative">
          {blog.eyecatch ? (
            <img
              src={blog.eyecatch.url}
              alt={blog.title}
              className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono text-xs">
              NO IMAGE
            </div>
          )}
        </div>

        {/* テキストエリア */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-2">
            
            {/* カテゴリ表示エリア */}
            <div className="flex flex-wrap gap-2">
              {blog.category && blog.category.length > 0 ? (
                blog.category.map((cat, index) => {
                  // 文字列ならそのまま、オブジェクトなら.nameを使う
                  const catName = typeof cat === 'string' ? cat : cat.name;

                  return (
                    <span key={index} className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                      {/* 変換せずそのまま日本語を表示 */}
                      {catName}
                    </span>
                  );
                })
              ) : (
                <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                  UNCATEGORIZED
                </span>
              )}
            </div>

            <time className="text-xs font-mono text-gray-500">{date}</time>
          </div>

          <h2 className="text-xl md:text-2xl font-black leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4">
            {blog.title}
          </h2>
          
          <div className="flex items-center gap-2 text-xs font-bold font-mono group-hover:translate-x-1 transition-transform">
            <span>READ LOGIC</span>
            <span>&rarr;</span>
          </div>
        </div>
      </article>
    </Link>
  );
}