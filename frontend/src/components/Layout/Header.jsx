import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Heart, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    { path: '/dashboard', label: 'ダッシュボード' },
    { path: '/articles', label: '記事' },
    { path: '/videos', label: '動画' },
  ];

  // 管理者の場合は管理者パネルを追加
  if (user?.role === 'admin') {
    navigationItems.push({ path: '/admin', label: '管理者パネル' });
  }

  return (
    <header className="bg-black shadow-sm border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link to="/dashboard" className="flex items-center">
            <Heart className="h-8 w-8 text-pink-500 mr-2" />
            <h1 className="text-xl font-bold text-white">一条塾</h1>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-pink-400 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                    : 'text-gray-300 hover:text-pink-400 hover:bg-pink-500/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ユーザー情報とログアウト */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-300">
              こんにちは、{user?.username}さん
            </span>
            {user?.role === 'admin' && (
              <Link to="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                >
                  <Settings className="h-4 w-4" />
                  <span>管理</span>
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </Button>
          </div>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-pink-400"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    location.pathname === item.path
                      ? 'text-pink-400 bg-pink-500/10'
                      : 'text-gray-300 hover:text-pink-400 hover:bg-pink-500/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-700 pt-4 pb-3">
                <div className="px-3 mb-3">
                  <p className="text-sm text-gray-300">
                    こんにちは、{user?.username}さん
                  </p>
                </div>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mx-3 flex items-center space-x-2 border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                    >
                      <Settings className="h-4 w-4" />
                      <span>管理者パネル</span>
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="mx-3 flex items-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <LogOut className="h-4 w-4" />
                  <span>ログアウト</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
