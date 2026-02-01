import { client } from '@/libs/client';
import NewLikeButton from '@/components/NewLikeButton';
import Link from 'next/link';

// シェア機能用コンポーネント（インライン定義）
const ShareButtons = ({ title, id }: { title: string; id: string }) => {
  const url = `https://newlogos.com/blog/${id}`; // ※実際のドメインに変えてください
  return (
    <div className="flex gap-4 text-xs font-mono">
       <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`} target="_blank" className="hover:underline">[ SHARE ON X ]</a>
       <a href={`mailto:?subject=${title}&body=${url}`} className="hover:underline">[ EMAIL ]</a>
    </div>
  );
};

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = await client.get({ endpoint: 'blogs', contentId: params.id });

  return (
    <main className="w-full bg-white pb-24">
      {/* アイキャッチ画像（全幅） */}
      {blog.eyecatch && (
        <div className="w-full h-[40vh] md:h-[50vh] bg-gray-100 relative overflow-hidden">
          <img src={blog.eyecatch.url} alt="" className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-black/10"></div> {/* 若干暗くする */}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-10">
        {/* タイトルエリア */}
        <div className="bg-white border border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-4 text-xs font-mono text-gray-500">
             <time>{new Date(blog.publishedAt).toLocaleDateString()}</time>
             <span className="border border-gray-300 px-2 py-1">{blog.category?.name || 'LOGIC'}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight">{blog.title}</h1>
        </div>

        {/* 本文エリア */}
        <div 
          className="prose prose-neutral prose-lg max-w-none mt-16 font-serif leading-loose
            prose-headings:font-sans prose-headings:font-bold prose-h2:border-l-4 prose-h2:border-black prose-h2:pl-4 prose-h2:text-2xl
            prose-blockquote:border-l-2 prose-blockquote:border-gray-400 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:text-sm prose-blockquote:not-italic
            prose-img:grayscale hover:prose-img:grayscale-0 prose-img:border prose-img:border-black"
          dangerouslySetInnerHTML={{ __html: blog.body || "" }}
        />

        {/* アクションエリア（NewLike / Share / Report） */}
        <div className="mt-24 pt-12 border-t border-black flex flex-col items-center gap-8">
          
          <p className="text-xs font-mono tracking-widest text-gray-400">IS THIS LOGIC VALID?</p>
          
          {/* NewLikeボタン（保存機能付き） */}
          <NewLikeButton blogId={blog.id} />

          <div className="w-full flex justify-between items-center mt-8 pt-8 border-t border-gray-100">
             <ShareButtons title={blog.title} id={blog.id} />
             
             {/* 訂正報告 */}
             <a href="mailto:contact@newlogos.com?subject=Correction Report" className="text-xs font-mono text-red-900 hover:bg-red-50 px-2 py-1">
               [ REPORT ERROR ]
             </a>
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="mt-16 text-center">
          <Link href="/blogs" className="inline-block border-b border-black pb-1 hover:opacity-50 text-sm font-bold">
            BACK TO ARCHIVE
          </Link>
        </div>

      </div>
    </main>
  );
}