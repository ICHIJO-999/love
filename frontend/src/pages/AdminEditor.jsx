import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Edit3, FileText, Video, Save, Eye, Plus, Github, Key, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import TipsLevelEditor from '@/components/TipsLevelEditor';

export default function AdminEditor() {
  const { user } = useAuth();
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('course1');
  const [publishStatus, setPublishStatus] = useState('draft');
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [isGitHubAuthenticated, setIsGitHubAuthenticated] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleGitHubTokenSubmit = () => {
    if (githubToken.trim()) {
      localStorage.setItem('github_token', githubToken.trim());
      setIsGitHubAuthenticated(true);
      setSaveMessage('GitHub認証が完了しました！記事の保存が可能になりました。');
      setShowTokenInput(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!articleTitle.trim() || !articleContent.trim()) {
      setSaveMessage('タイトルと内容を入力してください。');
      return;
    }

    if (!isGitHubAuthenticated) {
      setSaveMessage('GitHub認証が必要です。Personal Access Tokenを設定してください。');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      // GitHub Issues APIで記事を保存
      const token = localStorage.getItem('github_token');
      const response = await fetch('https://api.github.com/repos/ICHIJO-999/love/issues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: articleTitle,
          body: articleContent,
          labels: [selectedCourse, publishStatus]
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSaveMessage(`記事が正常に保存されました！Issue #${result.number} として作成されました。`);
        // 保存成功後、フォームをリセット
        setArticleTitle('');
        setArticleContent('');
      } else {
        const error = await response.json();
        setSaveMessage(`保存に失敗しました: ${error.message}`);
      }
    } catch (error) {
      setSaveMessage(`保存エラー: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Zap className="h-8 w-8 text-pink-400" />
              TIPS レベル 管理者パネル
            </h1>
            <p className="text-gray-300">高度なエディター機能で記事と動画の管理を行います</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-pink-500 text-pink-400">
              TIPS レベル
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              {user.username}
            </Badge>
          </div>
        </div>

        {/* GitHub認証セクション */}
        {!isGitHubAuthenticated && (
          <Card className="bg-gray-900 border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Github className="h-5 w-5 text-pink-400" />
                GitHub認証設定
              </CardTitle>
              <CardDescription className="text-gray-400">
                記事を永続的に保存するためにGitHub Personal Access Tokenが必要です
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-900/20 border-yellow-500/20">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300">
                  GitHub Settings → Developer settings → Personal access tokens → Generate new token (classic) で「repo」権限を付与したトークンを作成してください。
                </AlertDescription>
              </Alert>
              
              {!showTokenInput ? (
                <Button 
                  onClick={() => setShowTokenInput(true)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  <Key className="h-4 w-4 mr-2" />
                  トークンを設定
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-token" className="text-white">GitHub Personal Access Token</Label>
                    <Input
                      id="github-token"
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGitHubTokenSubmit}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      認証
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTokenInput(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      キャンセル
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="bg-gray-800 border-pink-500/20">
            <TabsTrigger value="editor" className="data-[state=active]:bg-pink-600">
              <Edit3 className="h-4 w-4 mr-2" />
              TIPS エディター
            </TabsTrigger>
            <TabsTrigger value="articles" className="data-[state=active]:bg-pink-600">
              <FileText className="h-4 w-4 mr-2" />
              記事管理
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-pink-600">
              <Video className="h-4 w-4 mr-2" />
              動画管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            {/* 記事エディター */}
            <Card className="bg-gray-900 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-pink-400" />
                  TIPS レベル エディター
                </CardTitle>
                <CardDescription className="text-gray-400">
                  高度な機能を持つエディターで記事を作成・編集します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 記事設定 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">記事タイトル</Label>
                    <Input
                      id="title"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="記事のタイトルを入力"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-white">対象コース</Label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="コースを選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="course1">コース1: 基礎編</SelectItem>
                        <SelectItem value="course2">コース2: 実践編</SelectItem>
                        <SelectItem value="course3">コース3: 上級編</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-white">公開状態</Label>
                    <Select value={publishStatus} onValueChange={setPublishStatus}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="状態を選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="draft">下書き</SelectItem>
                        <SelectItem value="published">公開</SelectItem>
                        <SelectItem value="private">非公開</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* TIPS レベル エディター */}
                <div className="space-y-4">
                  <Label className="text-white">記事内容</Label>
                  <TipsLevelEditor
                    content={articleContent}
                    onChange={setArticleContent}
                    placeholder="記事の内容を入力してください..."
                  />
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveArticle}
                    disabled={isSaving || !isGitHubAuthenticated}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        GitHub に保存
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10">
                    <Eye className="h-4 w-4 mr-2" />
                    プレビュー
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10"
                    onClick={() => {
                      setArticleTitle('');
                      setArticleContent('');
                      setSelectedCourse('course1');
                      setPublishStatus('draft');
                      setSaveMessage('');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    新規作成
                  </Button>
                </div>

                {/* 保存メッセージ */}
                {saveMessage && (
                  <Alert className={`${
                    saveMessage.includes('正常に保存') 
                      ? 'bg-green-900/20 border-green-500/20' 
                      : 'bg-red-900/20 border-red-500/20'
                  }`}>
                    <AlertDescription className={`${
                      saveMessage.includes('正常に保存') 
                        ? 'text-green-300' 
                        : 'text-red-300'
                    }`}>
                      {saveMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* エディター機能説明 */}
            <Card className="bg-gray-900 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-pink-400" />
                  TIPS レベル エディター機能
                </CardTitle>
                <CardDescription className="text-gray-400">
                  高度なエディター機能とGitHub Issues APIによる永続的記事保存
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <h4 className="font-semibold text-pink-400 mb-2">エディター機能</h4>
                    <ul className="space-y-1">
                      <li>• ブロック単位での編集</li>
                      <li>• 赤・青の文字色ボタン</li>
                      <li>• 画像ドラッグ&ドロップ</li>
                      <li>• ファイル選択ダイアログ</li>
                      <li>• 見出し・引用・コード</li>
                      <li>• リアルタイム文字数カウント</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-400 mb-2">GitHub連携</h4>
                    <ul className="space-y-1">
                      <li>• 永続的な記事保存</li>
                      <li>• Issues APIによる管理</li>
                      <li>• コース別ラベル分類</li>
                      <li>• 公開状態管理</li>
                      <li>• バージョン管理</li>
                      <li>• 無料で利用可能</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles">
            <Card className="bg-gray-900 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white">記事管理</CardTitle>
                <CardDescription className="text-gray-400">
                  公開済みの記事を管理します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">記事一覧機能は今後実装予定です。</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card className="bg-gray-900 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white">動画管理</CardTitle>
                <CardDescription className="text-gray-400">
                  動画コンテンツを管理します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">動画管理機能は今後実装予定です。</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
