import { client } from '@/libs/client';
import InteractionPanel from '@/components/InteractionPanel';

// 動的ルートのパラメータ型定義
type Props = {
  params: { id: string };
};

export default async function BlogPage({ params }: Props) {
  const blog = await client.get({ endpoint: 'blogs', contentId: params.id });

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-24">
      <div className="max-w-2xl mx-auto px-6 pt-24">
        
        {/* 記事ヘッダー */}
        <header className="mb-12">
          <time className="text-xs font-mono text-gray-500">{new Date(blog.publishedAt).toLocaleDateString()}</time>
          <h1 className="text-3xl md:text-4xl font-black mt-4 leading-tight">{blog.title}</h1>
          {blog.category && (
            <span className="inline-block mt-4 bg-gray-100 text-xs px-2 py-1">{blog.category.name}</span>
          )}
        </header>

        {/* アイキャッチ画像 */}
        {blog.eyecatch && (
          <div className="mb-12 border border-gray-100 grayscale">
            <img src={blog.eyecatch.url} alt="" className="w-full h-auto" />
          </div>
        )}

        {/* 本文 (HTMLとしてレンダリング) */}
        <div 
          className="prose prose-neutral max-w-none prose-h2:text-xl prose-h2:border-l-4 prose-h2:border-black prose-h2:pl-3 prose-h2:mt-12 prose-p:leading-8 prose-p:text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.body }} // microCMSの本文フィールド名に合わせてください
        />

        {/* インタラクション（NewLike, Share, Report） */}
        <InteractionPanel title={blog.title} url={`https://newlogos.com/blog/${blog.id}`} />
        
        {/* 戻るボタン */}
        <div className="mt-16 text-center">
            <a href="/" className="text-xs font-mono border-b border-black pb-1 hover:opacity-50">BACK TO ARCHIVE</a>
        </div>

      </div>
    </main>
  );
}

// 静的生成用のパスを取得（SSGの場合）
export async function generateStaticParams() {
  const { contents } = await client.get({ endpoint: 'blogs' });
  return contents.map((blog: any) => ({ id: blog.id }));
}