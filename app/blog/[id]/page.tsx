import { client } from '@/libs/client';
import NewLikeButton from '@/components/NewLikeButton';
import Link from 'next/link';

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = await client.get({ endpoint: 'blogs', contentId: params.id });

  // ▼ デバッグ用：どんなデータが来ているかコンソールと画面に出す
  console.log('Blog Data:', blog);

  // body, content, text, richEditor... 何か入っているものを探す
  const contentHTML = blog.body || blog.content || blog.text || blog.richEditor || "";

  return (
    <div className="pb-24 pt-8">
      {/* --- デバッグエリア（解決したら消す） --- */}
      <div className="bg-gray-800 text-white p-4 mb-8 font-mono text-xs overflow-auto h-64">
        <p className="text-yellow-400 mb-2">▼ MICROCMS DEBUG DATA</p>
        <pre>{JSON.stringify(blog, null, 2)}</pre>
      </div>
      {/* ------------------------------------- */}

      <div className="mb-12 text-center">
        <time className="text-xs font-mono text-gray-400 block mb-2">{new Date(blog.publishedAt).toLocaleDateString()}</time>
        <h1 className="text-2xl md:text-3xl font-black leading-tight">{blog.title}</h1>
      </div>

      <div 
        className="prose prose-neutral max-w-none font-medium leading-8"
      >
        {contentHTML ? (
          <div dangerouslySetInnerHTML={{ __html: contentHTML }} />
        ) : (
          <div className="p-4 border border-red-500 text-red-500 font-bold">
            本文が見つかりません。<br/>
            上の黒いデバッグエリアの中に、本文らしきデータはありますか？<br/>
            その「キー名（例: content, text）」を教えてください。
          </div>
        )}
      </div>
    </div>
  );
}