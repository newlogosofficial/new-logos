import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/libs/client';
import * as cheerio from 'cheerio';

export default async function BlogIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let blog;
  try {
    blog = await client.get({ endpoint: 'blogs', contentId: id });
  } catch (e) {
    notFound();
  }

  // HTMLを取得
  const rawHtml = blog.content || blog.body;

  // HTMLを解析して、見出し(h2)にIDを自動付与する
  const $ = cheerio.load(rawHtml || '', null, false);
  $('h2').each((_, elm) => {
    const text = $(elm).text();
    $(elm).attr('id', text); // 見出しの文字をそのままIDにする
  });
  const processedContent = $.html();

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

      {/* 本文（リッチテキスト表示） */}
      <div 
        className="
          prose prose-sm md:prose-base max-w-none font-mono
          prose-headings:font-black 
          prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-2xl prose-h2:border-l-4 prose-h2:border-black prose-h2:pl-4 prose-h2:leading-snug
          prose-h3:mt-8 prose-h3:text-lg
          prose-a:text-black prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 hover:prose-a:opacity-50
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500
        "
        dangerouslySetInnerHTML={{ __html: processedContent }} 
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

// 静的生成の設定（必要に応じて）
export async function generateStaticParams() {
  const { contents } = await client.get({ endpoint: 'blogs' });
  return contents.map((blog: any) => ({
    id: blog.id,
  }));
}