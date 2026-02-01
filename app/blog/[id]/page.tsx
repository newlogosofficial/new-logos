import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/libs/client';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';

// Next.js 15対応: paramsをPromiseとして定義
export default async function BlogIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. 記事データを取得
  let blog;
  try {
    blog = await client.get({ endpoint: 'blogs', contentId: id });
  } catch (e) {
    notFound();
  }

  // ★重要修正：本文が入っている変数を探す
  // microCMSの設定によって 'body' か 'content' か異なるため、ある方を採用する
  const blogBody = blog.body || blog.content;

  // 日付のフォーマット
  const date = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '.');

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* 記事ヘッダー */}
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

      {/* アイキャッチ画像 */}
      {blog.eyecatch && (
        <div className="mb-12">
          <img 
            src={blog.eyecatch.url} 
            alt={blog.title} 
            className="w-full h-auto border border-gray-200"
          />
        </div>
      )}

      {/* 本文（Markdownレンダリング + 自動ID付与） */}
      <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-black prose-a:text-blue-600 hover:prose-a:underline font-mono">
        {blogBody ? (
          <ReactMarkdown 
            rehypePlugins={[rehypeSlug]}
            components={{
              // リンクの挙動カスタマイズ
              a: ({node, ...props}) => <a {...props} className="text-black underline decoration-1 underline-offset-4 hover:opacity-50 transition-opacity" />,
              // 見出しのデザイン
              h2: ({node, ...props}) => <h2 {...props} className="mt-16 mb-6 text-xl md:text-2xl font-black border-l-4 border-black pl-4 pt-1 pb-1" />,
              h3: ({node, ...props}) => <h3 {...props} className="mt-8 mb-4 text-lg font-bold" />,
              // 引用のデザイン
              blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-8" />,
              // リストのデザイン
              ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 space-y-2 my-4" />,
              ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 space-y-2 my-4" />,
            }}
          >
            {blogBody}
          </ReactMarkdown>
        ) : (
          // 本文データが取得できなかった場合のエラー表示
          <div className="py-10 text-center text-red-500 font-bold border border-red-200 bg-red-50">
            Error: Content not found. (Field name mismatch?)
          </div>
        )}
      </div>

      {/* フッター / 戻るボタン */}
      <div className="mt-20 pt-10 border-t border-black flex justify-between items-center">
        <Link href="/blogs" className="text-xs font-bold font-mono border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
          &lt; BACK TO ARCHIVE
        </Link>
        <span className="text-xs font-mono text-gray-400">LOGIC END.</span>
      </div>
    </div>
  );
}

// 静的生成（SSG）用パラメータ生成（必要に応じて有効化）
export async function generateStaticParams() {
  const { contents } = await client.get({ endpoint: 'blogs' });
  return contents.map((blog: any) => ({
    id: blog.id,
  }));
}