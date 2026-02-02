import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/libs/client';
import * as cheerio from 'cheerio';
import NewLike from '@/components/NewLikeButton'; 
import ShareSection from '@/components/ShareSection';

// 常に最新データを取得
export const revalidate = 0;

// ■ 追加: 本文からHTMLタグを除去して説明文を作る補助関数
function truncateContent(htmlContent: string, length: 120) {
  if (!htmlContent) return '';
  const text = htmlContent.replace(/(<([^>]+)>)/gi, ''); // タグ除去
  return text.length > length ? text.substring(0, length) + '...' : text;
}

type Props = {
  params: Promise<{ id: string }>;
};

// ■ 追加: メタデータを動的に生成する関数 (OGP設定)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  
  // 記事データを取得（失敗時はnull）
  const blog = await client.get({ 
    endpoint: 'blogs', 
    contentId: id,
    queries: { draftKey: undefined } 
  }).catch(() => null);

  if (!blog) {
    return { title: 'New Logos' };
  }

  // タイトル、説明文、画像を準備
  const title = blog.title;
  const description = blog.description || truncateContent(blog.body || blog.content, 120);
  const imageUrl = blog.eyecatch?.url || (await parent).openGraph?.images?.[0] || '/icon.png';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `/blogs/${id}`,
      images: [imageUrl],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

// ▼ メインのページコンポーネント（既存コード）
export default async function BlogIdPage({
  params,
}: Props) {
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

  // HTML解析とID付与
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
    <div className="max-w-3xl mx-auto w-full px-6 py-12">
      <header className="mb-12 border-b border-black pb-8">
        {/* カテゴリ表示 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.category && blog.category.length > 0 ? (
            blog.category.map((cat: any, index: number) => {
              const catName = typeof cat === 'string' ? cat : cat.name;
              return (
                <span key={index} className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                  {catName}
                </span>
              );
            })
          ) : (
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">-</span>
          )}
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

      {/* 本文 */}
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

      {/* いいねボタン */}
      <div className="mt-16 flex justify-center">
        <NewLike blogId={id} initialCount={blog.likes || 0} />
      </div>

      {/* シェア & 訂正提案セクション */}
      <ShareSection id={id} title={blog.title} />

      <div className="mt-8 pt-10 flex justify-between items-center">
        <Link href="/blogs" className="text-xs font-bold font-mono border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
          &lt; BACK TO ARCHIVE
        </Link>
        <span className="text-xs font-mono text-gray-400">LOGIC END.</span>
      </div>
    </div>
  );
}