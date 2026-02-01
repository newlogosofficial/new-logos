import Link from 'next/link';
import { client } from '@/libs/client';
import BlogCard from '@/components/BlogCard';

// 修正ポイント：BlogCardに合わせてカテゴリを配列(Category[])に変更
type Category = {
  id: string;
  name: string;
};

type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  category: Category[]; // ここを配列に修正！
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
};

// 最新データを取得
export const revalidate = 60;

export default async function Home() {
  // 最新記事を5件取得
  const data = await client.get({
    endpoint: 'blogs',
    queries: { limit: 5 },
  });
  const latestBlogs: Blog[] = data.contents;

  return (
    <div className="w-full py-12 md:py-20">
      {/* ヒーローエリア */}
      <section className="mb-24 px-4 text-center">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
          NEW<br className="md:hidden" />LOGOS
        </h1>
        <p className="font-mono text-sm md:text-base tracking-widest uppercase mb-12">
          RECONSTRUCTING LOGIC & EMOTION
        </p>
        <div className="w-16 h-1 bg-black mx-auto"></div>
      </section>

      {/* 最新記事リスト */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12 border-b border-black pb-4">
          <h2 className="text-2xl font-black tracking-tight">LATEST LOGS</h2>
          <Link href="/blogs" className="font-mono text-xs font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
            VIEW ARCHIVES &rarr;
          </Link>
        </div>

        <div className="space-y-4">
          {latestBlogs.length === 0 ? (
            <p className="text-center py-20 font-mono text-gray-400">NO LOGS RECORDED.</p>
          ) : (
            latestBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          )}
        </div>
      </section>
      
      {/* フッターリンク */}
      <section className="mt-24 text-center font-mono text-xs text-gray-400">
        <p>SYSTEM OPERATIONAL.</p>
      </section>
    </div>
  );
}