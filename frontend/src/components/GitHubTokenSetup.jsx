import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Eye,
  EyeOff,
  Github
} from 'lucide-react';
import { githubApi } from '../services/githubApi';

const GitHubTokenSetup = ({ onAuthSuccess }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 初期認証状態をチェック
  useEffect(() => {
    checkCurrentAuth();
  }, []);

  const checkCurrentAuth = async () => {
    setIsLoading(true);
    const result = await githubApi.checkAuth();
    setAuthStatus(result);
    setIsLoading(false);
    
    if (result.authenticated && onAuthSuccess) {
      onAuthSuccess(result);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsChecking(true);
    
    // トークンを設定
    githubApi.setGitHubToken(token.trim());
    
    // 認証をチェック
    const result = await githubApi.checkAuth();
    setAuthStatus(result);
    setIsChecking(false);

    if (result.authenticated) {
      setToken(''); // セキュリティのためトークンをクリア
      if (onAuthSuccess) {
        onAuthSuccess(result);
      }
    }
  };

  const handleTokenClear = () => {
    githubArticleService.setGitHubToken('');
    setAuthStatus({ authenticated: false, message: 'トークンをクリアしました' });
    setToken('');
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-pink-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-pink-400">認証状態を確認中...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (authStatus?.authenticated) {
    return (
      <Card className="bg-gray-900 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            GitHub認証済み
          </CardTitle>
          <CardDescription className="text-gray-400">
            記事の永続化が有効になりました
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-900/20 border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              {authStatus.message}
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkCurrentAuth}
              className="border-green-500/30 text-green-300 hover:bg-green-500/10"
            >
              認証状態を再確認
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTokenClear}
              className="border-red-500/30 text-red-300 hover:bg-red-500/10"
            >
              トークンをクリア
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-pink-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Github className="h-5 w-5 text-pink-400" />
          GitHub認証設定
        </CardTitle>
        <CardDescription className="text-gray-400">
          記事を永続化するためにGitHub Personal Access Tokenを設定してください
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* トークン作成手順 */}
        <Alert className="bg-blue-900/20 border-blue-500/20">
          <Key className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            <div className="space-y-2">
              <p className="font-medium">Personal Access Token作成手順:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  <a 
                    href="https://github.com/settings/tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    GitHub Settings → Developer settings → Personal access tokens
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>「Generate new token (classic)」をクリック</li>
                <li>Note: 「Love Consulting Site」など</li>
                <li>Scopes: 「repo」にチェック</li>
                <li>「Generate token」をクリック</li>
                <li>生成されたトークンをコピーして下記に入力</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>

        {/* トークン入力フォーム */}
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-token" className="text-white">
              GitHub Personal Access Token
            </Label>
            <div className="relative">
              <Input
                id="github-token"
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="bg-gray-800 border-pink-500/30 text-white pr-10"
                disabled={isChecking}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!token.trim() || isChecking}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            {isChecking ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                認証中...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                トークンを設定
              </div>
            )}
          </Button>
        </form>

        {/* エラー表示 */}
        {authStatus && !authStatus.authenticated && (
          <Alert className="bg-red-900/20 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {authStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* セキュリティ注意事項 */}
        <Alert className="bg-yellow-900/20 border-yellow-500/20">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-300 text-sm">
            <p className="font-medium mb-1">セキュリティ注意事項:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>トークンは安全に管理してください</li>
              <li>他人と共有しないでください</li>
              <li>不要になったら削除してください</li>
              <li>このトークンでリポジトリへの書き込みが可能になります</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default GitHubTokenSetup;
