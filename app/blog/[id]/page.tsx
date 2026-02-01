import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/libs/client';
import * as cheerio from 'cheerio';
import NewLike from '@/components/NewLikeButton'; 

// 常に最新データを取得（カウント数を正確に反映するため）
export const revalidate = 0;

export default async function BlogIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let blog;
  try {
    blog = await client.get({ 
      endpoint: 'blogs', 
      contentId: id,
      queries: { draftKey: undefined } 
    });
  } catch (e) {
    notFound();
  }

  const rawHtml = blog.body || blog.content;
  const $ = cheerio.load(rawHtml || '', null, false);
  $('h2').each((_, elm) => {
    const text = $(elm).text();
    $(elm).attr('id', text);
  });
  const processedContent = $.html();

  const date = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '.');

  return (
    <div className="max-w-3xl mx-auto w-full">
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

      {blog.eyecatch && (
        <div className="mb-12">
          <img src={blog.eyecatch.url} alt={blog.title} className="w-full h-auto border border-gray-200"/>
        </div>
      )}

      <div 
        className="
          prose prose-sm md:prose-base max-w-none font-mono
          prose-headings:font-black 
          prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-2xl prose-h2:border-l-4 prose-h2:border-black prose-h2:pl-4
          prose-a:text-black prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 hover:prose-a:opacity-50
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
        "
        dangerouslySetInnerHTML={{ __html: processedContent }} 
      />

      <div className="mt-16 flex justify-center">
        {/* ■ 修正点：現在のいいね数（なければ0）を渡す */}
        <NewLike blogId={id} initialCount={blog.likes || 0} />
      </div>

      <div className="mt-20 pt-10 border-t border-black flex justify-between items-center">
        <Link href="/blogs" className="text-xs font-bold font-mono border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
          &lt; BACK TO ARCHIVE
        </Link>
        <span className="text-xs font-mono text-gray-400">LOGIC END.</span>
      </div>
    </div>
  );
}