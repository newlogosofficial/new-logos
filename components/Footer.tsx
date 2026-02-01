export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-black bg-white text-center">
      <div className="flex flex-col items-center gap-4">
        {/* ロゴ（小） */}
        <div className="border border-black p-1 w-12 h-12 flex items-center justify-center">
          <span className="font-black text-xs tracking-tighter">NL</span>
        </div>
        
        {/* リンク集 */}
        <nav className="flex gap-6 text-xs font-bold tracking-widest">
          <a href="/about" className="hover:text-gray-500">ABOUT</a>
          <a href="/blogs" className="hover:text-gray-500">BLOGS</a>
          <a href="/access" className="hover:text-gray-500">ACCESS</a>
          <a href="https://x.com/NewLogos_Axis" target="_blank" className="hover:text-gray-500">CONTACT</a>
        </nav>

        {/* コピーライト */}
        <p className="mt-8 text-[10px] font-mono text-gray-400">
          &copy; 2026 Axis / New Logos. All Logic Reserved.
        </p>
      </div>
    </footer>
  );
}