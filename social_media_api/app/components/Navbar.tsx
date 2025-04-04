'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-600 text-white' : 'hover:bg-gray-100';
  };
  
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div className="flex items-center py-4">
              <span className="font-bold text-xl text-blue-500">Social Analytics</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className={`px-3 py-2 rounded-md ${isActive('/')}`}>
                Top Users
              </Link>
              <Link href="/trending" className={`px-3 py-2 rounded-md ${isActive('/trending')}`}>
                Trending Posts
              </Link>
              <Link href="/feed" className={`px-3 py-2 rounded-md ${isActive('/feed')}`}>
                Feed
              </Link>
              <Link href="/test" className={`px-3 py-2 rounded-md ${isActive('/test')}`}>
                Test API
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex justify-around py-2 bg-white shadow-sm">
        <Link href="/" className={`px-3 py-2 rounded-md text-sm ${isActive('/')}`}>
          Top Users
        </Link>
        <Link href="/trending" className={`px-3 py-2 rounded-md text-sm ${isActive('/trending')}`}>
          Trending Posts
        </Link>
        <Link href="/feed" className={`px-3 py-2 rounded-md text-sm ${isActive('/feed')}`}>
          Feed
        </Link>
        <Link href="/test" className={`px-3 py-2 rounded-md text-sm ${isActive('/test')}`}>
          Test
        </Link>
      </div>
    </nav>
  );
} 