// components/main/Header.tsx

import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white-50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter">
          toolverse
          <span className="text-blue-500">.</span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 text-sm font-medium text-gray-600">
            <li>
              <Link href="/pdf" className="hover:text-blue-500 transition-colors">
                PDF
              </Link>
            </li>
            <li>
              <Link href="/image" className="hover:text-blue-500 transition-colors">
                Image
              </Link>
            </li>
            <li>
              <Link href="/color" className="hover:text-blue-500 transition-colors">
                Color
              </Link>
            </li>
            <li>
              <Link href="/text" className="hover:text-blue-500 transition-colors">
                Text
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;