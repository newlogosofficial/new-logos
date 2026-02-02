import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

/* メタデータ設定（OGP追加版） */
export const metadata: Metadata = {
  // ★重要: ここを自分の実際の公開ドメインに書き換えてください
  metadataBase: new URL('https://new-logos.vercel.app'),

  title: { template: '%s | NEW LOGOS', default: 'NEW LOGOS' },
  description: "Logic / Structure / Possibility",
  icons: { icon: '/icon.png', shortcut: '/icon.png', apple: '/icon.png' },

  // ▼▼▼ 追加：SNSシェア用設定 (Open Graph) ▼▼▼
  openGraph: {
    title: 'NEW LOGOS',
    description: 'Logic / Structure / Possibility',
    url: '/',
    siteName: 'NEW LOGOS',
    locale: 'ja_JP',
    type: 'website',
    // デフォルト画像（記事に画像がない場合やトップページで表示されます）
    // publicフォルダにある icon.png を指定していますが、専用の default-ogp.png などを作ってもOKです
    images: ['/icon.png'],
  },

  // ▼▼▼ 追加：Twitter用設定 ▼▼▼
  twitter: {
    card: 'summary_large_image', // 画像を大きく表示する設定
    title: 'NEW LOGOS',
    description: 'Logic / Structure / Possibility',
    // 必要であれば自分のTwitter IDを設定
    // site: '@NewLogos_Axis',
    images: ['/icon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* bodyに bg-grid-pattern クラスを追加 */}
      <body className={`${notoSansJP.className} bg-grid-pattern text-black antialiased selection:bg-black selection:text-white flex flex-col min-h-screen`}>
        
        <Header />

        <div className="flex-grow w-full pt-20 pb-12">
           {/* メインエリアは「白背景」にして影をつけることで、背景から浮かび上がらせる */}
           <main className="w-full max-w-3xl mx-auto px-6 shadow-[0_0_50px_rgba(0,0,0,0.05)] min-h-[80vh] bg-white border-x border-gray-100">
            {children}
           </main>
        </div>

        <Footer />
        
      </body>
    </html>
  );
}