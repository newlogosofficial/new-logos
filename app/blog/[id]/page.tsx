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
        <ReactMarkdown 
          rehypePlugins={[rehypeSlug]}
          components={{
            // リンクを新しいタブで開く挙動などを追加したい場合はここでカスタマイズ
            a: ({node, ...props}) => {
              // 目次リンク（#から始まる）はそのまま、外部サイトは別タブなどの制御が可能
              return <a {...props} className="text-black underline decoration-1 underline-offset-4 hover:opacity-50 transition-opacity" />
            },
            // 見出しのデザイン調整
            h2: ({node, ...props}) => <h2 {...props} className="mt-12 mb-6 text-xl md:text-2xl font-black border-l-4 border-black pl-4" />,
            h3: ({node, ...props}) => <h3 {...props} className="mt-8 mb-4 text-lg font-bold" />,
            // 引用のデザイン
            blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-8" />,
            // リストのデザイン
            ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 space-y-2 my-4" />,
            ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 space-y-2 my-4" />,
          }}
        >
          {blog.content}
        </ReactMarkdown>
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