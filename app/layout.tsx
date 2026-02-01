import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NEW LOGOS",
  description: "Logic / Structure / Possibility",
  icons: {
    icon: "/favicon.ico", // ファビコンがある場合
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
        
        {/* ヘッダー（全ページ共通・固定表示） */}
        <Header />

        {/* メインコンテンツエリア */}
        {/* pt-16: ヘッダーの高さ分だけ下にずらす */}
        {/* min-h-screen & flex-col: コンテンツが短くてもフッターを最下部に固定する構造 */}
        <div className="pt-16 min-h-screen flex flex-col justify-between">
          
          <main className="flex-grow w-full">
            {children}
          </main>

          {/* フッター（全ページ共通） */}
          <Footer />
          
        </div>
      </body>
    </html>
  );
}