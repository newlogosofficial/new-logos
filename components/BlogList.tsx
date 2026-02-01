'use client';

import { useState } from 'react';
import Link from 'next/link';

// 型定義
type Category = {
  id: string;
  name: string;
};

type Blog = {
  id: string;
  title: string;
  // カテゴリは「配列」の場合と「単一オブジェクト」の場合の両方に対応させる
  category: Category[] | Category | null; 
  publishedAt: string;
  eyecatch?: { url: string };
};

type Props = {
  blogs: Blog[];
  categories: Category[];
};

export default function BlogList({ blogs, categories }: Props) {
  const [filter, setFilter] = useState('ALL');

  // ■ ヘルパー関数：カテゴリを常に「配列」として扱うための変換処理
  // これにより、microCMSが「1個」で返してきても「リスト」で返してきてもエラーにならない
  const getCategories = (blog: Blog): Category[] => {
    if (!blog.category) return [];
    return Array.isArray(blog.category) ? blog.category : [blog.category];
  };

  // フィルタリング処理
  const filteredBlogs = filter === 'ALL'
    ? blogs
    : blogs.filter((blog) => {
        const cats = getCategories(blog);
        return cats.some((cat) => cat.id === filter);
      });

  return (
    <div>
      {/* 1. フィルターボタンエリア */}
      <div className="flex flex-wrap gap-3 mb-12">
        <button
          onClick={() => setFilter('ALL')}
          className={`
            text-[10px] font-bold font-mono px-4 py-2 border border-black transition-all tracking-wider
            ${filter === 'ALL' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}
          `}
        >
          ALL
        </button>

        {/* 親から渡されたカテゴリ一覧を表示 */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`
              text-[10px] font-bold font-mono px-4 py-2 border border-black transition-all uppercase tracking-wider
              ${filter === cat.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}
            `}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 2. 記事カード一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => {
            // ここでもヘルパー関数を使って安全にカテゴリを取得
            const blogCategories = getCategories(blog);

            return (
              <Link key={blog.id} href={`/blogs/${blog.id}`} className="group block">
                <div className="border border-black p-4 h-full bg-white transition-all group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1">
                  
                  {/* アイキャッチ画像 */}
                  <div className="aspect-video bg-gray-100 mb-4 overflow-hidden border border-black relative">
                    {blog.eyecatch ? (
                      <img
                        src={blog.eyecatch.url}
                        alt={blog.title}
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-mono text-xs">
                        NO IMAGE
                      </div>
                    )}
                  </div>
                  
                  {/* カテゴリ表示エリア */}
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[20px]">
                    {blogCategories.length > 0 ? (
                      blogCategories.map((cat) => (
                        <span key={cat.id} className="text-[10px] font-bold bg-black text-white px-1.5 py-0.5 uppercase tracking-wide">
                          {cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">
                        -
                      </span>
                    )}
                  </div>

                  {/* タイトル */}
                  <h2 className="text-base font-bold leading-tight mb-2 line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
                    {blog.title}
                  </h2>
                  
                  {/* 日付 */}
                  <time className="text-[10px] font-mono text-gray-500 block">
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: '2-digit', day: '2-digit'
                    }).replace(/\//g, '.')}
                  </time>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="font-mono text-sm text-gray-500 col-span-full py-10 text-center border border-dashed border-gray-300">
            NO LOGS FOUND IN THIS CATEGORY.
          </p>
        )}
      </div>
    </div>
  );
}