import Link from 'next/link';

export default function AccessPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 min-h-[60vh]">
      <div className="border-b border-black pb-8 mb-12">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">ACCESS</h1>
        <p className="text-xs font-mono tracking-widest text-gray-500">LINKS / CONTACT / RESOURCES</p>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        {/* SNS Links */}
        <section>
          <h2 className="text-sm font-bold border-l-4 border-black pl-3 mb-6">OFFICIAL CHANNELS</h2>
          <div className="flex flex-col gap-4">
            <a href="https://www.youtube.com/@NewLogos" target="_blank" className="group flex items-center justify-between border border-black p-4 hover:bg-black hover:text-white transition-colors">
              <span className="font-bold">YouTube</span>
              <span className="text-xs font-mono opacity-50 group-hover:opacity-100">@NewLogos</span>
            </a>
            <a href="https://x.com/NewLogos_Axis" target="_blank" className="group flex items-center justify-between border border-black p-4 hover:bg-black hover:text-white transition-colors">
              <span className="font-bold">X (Twitter)</span>
              <span className="text-xs font-mono opacity-50 group-hover:opacity-100">@NewLogos_Axis</span>
            </a>
            <a href="https://www.instagram.com/newlogos_axis" target="_blank" className="group flex items-center justify-between border border-black p-4 hover:bg-black hover:text-white transition-colors">
              <span className="font-bold">Instagram</span>
              <span className="text-xs font-mono opacity-50 group-hover:opacity-100">@newlogos_axis</span>
            </a>
            <a href="https://www.tiktok.com/@newlogos_axis" target="_blank" className="group flex items-center justify-between border border-black p-4 hover:bg-black hover:text-white transition-colors">
              <span className="font-bold">TikTok</span>
              <span className="text-xs font-mono opacity-50 group-hover:opacity-100">@newlogos_axis</span>
            </a>
          </div>
        </section>

        {/* Contact / Other */}
        <section>
          <h2 className="text-sm font-bold border-l-4 border-black pl-3 mb-6">CONTACT & REPORT</h2>
          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              NewLogosへの取材、コラボレーションの依頼、または記事内容に関する訂正報告は以下のメールアドレスまでご連絡ください。
            </p>
            <div className="bg-gray-100 p-4 font-mono text-center select-all">
              contact@newlogos.com
            </div>
            <p className="text-xs text-gray-500">
              ※ 個人的な人生相談や、論理的でない誹謗中傷には返信できない場合があります。
            </p>
          </div>
        </section>
      </div>

      <div className="mt-24 text-center">
        <Link href="/" className="inline-block border-b border-black pb-1 text-xs font-bold hover:opacity-50">
          BACK TO HOME
        </Link>
      </div>
    </main>
  );
}