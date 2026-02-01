import Link from 'next/link';

type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: { url: string };
  category?: { name: string };
};

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog.id}`} className="block group">
      <article className="border border-black bg-white flex flex-col md:flex-row h-auto md:h-36 transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
        
        {/* 左：画像エリア */}
        <div className="w-full md:w-56 shrink-0 bg-gray-100 relative overflow-hidden border-b md:border-b-0 md:border-r border-black">
          {blog.eyecatch ? (
            <img src={blog.eyecatch.url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 font-mono text-xs">NO IMG</div>
          )}
        </div>

        {/* 右：情報エリア */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono bg-black text-white px-1.5 py-0.5">
                {blog.category?.name || 'UNCATEGORIZED'}
              </span>
              <time className="text-xs font-mono text-gray-500">
                {new Date(blog.publishedAt).toLocaleDateString()}
              </time>
            </div>
            <h3 className="text-lg md:text-xl font-bold leading-tight group-hover:underline decoration-1 underline-offset-4">
              {blog.title}
            </h3>
          </div>

          <div className="flex justify-end items-center mt-2">
            <span className="text-xs font-mono border-b border-gray-300 pb-0.5 group-hover:border-black transition-colors">
              READ LOGIC &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}