import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/libs/client';

// キャッシュを強制的に無効化（常に最新のデータをmicroCMSに取りに行く設定）
export const revalidate = 0;

export default async function BlogIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let blog;
  try {
    // 常に最新データを取得
    blog = await client.get({ 
      endpoint: 'blogs', 
      contentId: id,
      // キャッシュを使わない設定念押し
      queries: { draftKey: undefined } 
    });
  } catch (e) {
    notFound();
  }

  // bodyがない場合のデバッグ用
  if (!blog.body) {
    return (
      <div className="p-10 font-mono text-red-600">
        <h1 className="text-xl font-bold mb-4">Display Error</h1>
        <p>field "body" is empty or undefined.</p>
        <p className="mt-4 border-t pt-4">Received fields:</p>
        <pre className="bg-gray-100 p-4 mt-2 text-sm text-black">
          {JSON.stringify(blog, null, 2)}
        </pre>
      </div>
    );
  }

  // 日付フォーマット
  const date = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '.');

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* ヘッダー */}
      <header className="mb-12 border-b border-black pb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.category && blog.category.map((cat: any) => (
            <span key={cat.id} className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">
              {cat.name}
            </span>
          ))}
        </div>
        <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-4 uppercase">
          {blog.title}
        </h1>
        <time className="text-xs font-mono text-gray-500">{date}</time>
      </header>

      {/* アイキャッチ */}
      {blog.eyecatch && (
        <div className="mb-12">
          <img 
            src={blog.eyecatch.url} 
            alt={blog.title} 
            className="w-full h-auto border border-gray-200"
          />
        </div>
      )}

      {/* 本文表示（加工なし・直球） */}
      <div 
        className="
          prose prose-sm md:prose-base max-w-none font-mono
          prose-headings:font-black 
          prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-2xl prose-h2:border-l-4 prose-h2:border-black prose-h2:pl-4
          prose-a:text-black prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 hover:prose-a:opacity-50
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
        "
        dangerouslySetInnerHTML={{ __html: blog.body }} 
      />

      {/* フッター */}
      <div className="mt-20 pt-10 border-t border-black flex justify-between items-center">
        <Link href="/blogs" className="text-xs font-bold font-mono border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
          &lt; BACK TO ARCHIVE
        </Link>
        <span className="text-xs font-mono text-gray-400">LOGIC END.</span>
      </div>
    </div>
  );
}