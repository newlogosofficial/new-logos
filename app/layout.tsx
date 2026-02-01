import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

/* ▼ ここでタイトルとアイコンを設定します ▼ */
export const metadata: Metadata = {
  // タイトルの設定（%s は各ページで設定したタイトルが入る場所）
  title: {
    template: '%s | NEW LOGOS', 
    default: 'NEW LOGOS', // ページごとの設定がない場合に表示されるタイトル
  },
  description: "Logic / Structure / Possibility",
  // アイコンの設定
  icons: {
    icon: '/icon.png', // publicフォルダにあるicon.pngを指定
    shortcut: '/icon.png',
    apple: '/icon.png', // iPhoneなどのホーム画面用
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* ... (bodyの中身は変更なし) ... */}
      <body className={`${notoSansJP.className} bg-white text-black antialiased selection:bg-black selection:text-white flex flex-col min-h-screen`}>
        <Header />
        <div className="flex-grow w-full pt-20 pb-12">
           <main className="w-full max-w-3xl mx-auto px-6 shadow-[0_0_50px_rgba(0,0,0,0.03)] min-h-[80vh] bg-white">
            {children}
           </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}