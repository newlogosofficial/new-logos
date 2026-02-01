import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

/* タイトル設定等はそのまま... */
export const metadata: Metadata = {
  title: { template: '%s | NEW LOGOS', default: 'NEW LOGOS' },
  description: "Logic / Structure / Possibility",
  icons: { icon: '/icon.png', shortcut: '/icon.png', apple: '/icon.png' },
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