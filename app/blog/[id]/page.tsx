import { client } from '@/libs/client';
import NewLikeButton from '@/components/NewLikeButton';
import Link from 'next/link';

// シェアボタン
const ShareButtons = ({ title, id }: { title: string; id: string }) => {
  const url = `https://newlogos.vercel.app/blog/${id}`;
  return (
    <div className="flex gap-4 text-xs font-bold">
       <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`} target="_blank" className="hover:underline">[ Xで共有 ]</a>
       <a href={`mailto:?subject=${title}&body=${url}`} className="hover:underline">[ メールで送る ]</a>
    </div>
  );
};

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = await client.get({ endpoint: 'blogs', contentId: params.id });

  // ▼ Bodyの安全な取得ロジック
  // body または content または text というフィールド名を探して、あるものを採用する
  const contentHTML = blog.body || blog.content || blog.text || "";

  return (
    <div className="pb-24 pt-8">
      <div className="mb-12 text-center">
        <time className="text-xs font-mono text-gray-400 block mb-2">{new Date(blog.publishedAt).toLocaleDateString()}</time>
        <h1 className="text-2xl md:text-3xl font-black leading-tight">{blog.title}</h1>
        <span className="inline-block mt-4 text-[10px] bg-black text-white px-2 py-1">{blog.category?.name || 'LOGIC'}</span>
      </div>

      {blog.eyecatch && (
        <div className="mb-12 border border-black">
          <img src={blog.eyecatch.url} alt="" className="w-full h-auto grayscale" />
        </div>
      )}

      {/* ▼ 修正：安全に本文を表示する */}
      <div 
        className="prose prose-neutral max-w-none font-medium leading-8 prose-headings:font-bold prose-a:text-blue-600"
      >
        {contentHTML ? (
          <div dangerouslySetInnerHTML={{ __html: contentHTML }} />
        ) : (
          <div className="py-10 text-center text-red-500 text-sm font-mono border border-red-200 bg-red-50">
            [ERROR] 本文データが見つかりません。<br/>
            microCMSのフィールドIDが `body` ではない可能性があります。
          </div>
        )}
      </div>

      <div className="mt-24 pt-12 border-t border-gray-200 flex flex-col items-center gap-8">
        <p className="text-xs font-bold tracking-widest text-gray-400">この論理を評価する</p>
        <NewLikeButton blogId={blog.id} />

        <div className="w-full flex justify-between items-center mt-8 pt-8 border-t border-gray-100">
           <ShareButtons title={blog.title} id={blog.id} />
           
           {/* ▼ メールアドレス変更 */}
           <a href="mailto:newlogos.official@gmail.com?subject=訂正の提案" className="text-xs font-bold text-gray-500 hover:text-red-600">
             [ 訂正を提案 ]
           </a>
        </div>
      </div>
    </div>
  );
}