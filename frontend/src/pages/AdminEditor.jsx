import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../hooks/useAuth';
import FinalEditor from '../components/FinalEditor.jsx';
import { 
  Plus, 
  Save, 
  Eye, 
  Trash2, 
  Edit3,
  FileText,
  Video,
  Users,
  Settings
} from 'lucide-react';

const AdminEditor = () => {
  const { user } = useAuth();
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCourse, setArticleCourse] = useState('course1');
  const [articleStatus, setArticleStatus] = useState('draft');

  // 管理者権限チェック
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="bg-gray-900 border-pink-500/20">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-white mb-2">
              アクセス権限がありません
            </h3>
            <p className="text-gray-400">
              この機能は管理者のみ利用できます。
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    const article = {
      title: articleTitle,
      content: articleContent,
      course: articleCourse,
      status: articleStatus,
      createdAt: new Date().toISOString(),
      author: user.username
    };
    
    console.log('保存する記事:', article);
    alert('記事が保存されました！（テスト実装）');
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${articleTitle}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px;
              background: #111827;
              color: #f9fafb;
            }
            h1, h2, h3 { color: #ff69b4; }
            img { max-width: 100%; height: auto; border-radius: 8px; }
            blockquote { 
              border-left: 4px solid #ff69b4; 
              padding-left: 16px; 
              margin: 16px 0; 
              font-style: italic; 
            }
            pre { 
              background: #1f2937; 
              padding: 12px; 
              border-radius: 6px; 
              overflow: auto; 
            }
          </style>
        </head>
        <body>
          <h1>${articleTitle}</h1>
          <div>${articleContent}</div>
        </body>
      </html>
    `);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">管理者パネル</h1>
          <p className="text-gray-300">記事と動画の管理を行います</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-pink-500 text-pink-400">
            管理者モード
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-400">
            {user.username}
          </Badge>
        </div>
      </div>

      {/* タブナビゲーション */}
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="editor" className="data-[state=active]:bg-pink-600">
            <Edit3 className="h-4 w-4 mr-2" />
            記事エディター
          </TabsTrigger>
          <TabsTrigger value="articles" className="data-[state=active]:bg-pink-600">
            <FileText className="h-4 w-4 mr-2" />
            記事管理
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-pink-600">
            <Video className="h-4 w-4 mr-2" />
            動画管理
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-pink-600">
            <Users className="h-4 w-4 mr-2" />
            ユーザー管理
          </TabsTrigger>
        </TabsList>

        {/* 記事エディタータブ */}
        <TabsContent value="editor" className="space-y-6">
          <Card className="bg-gray-900 border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-pink-400" />
                新しい記事を作成
              </CardTitle>
              <CardDescription className="text-gray-400">
                シンプルで確実に動作するドラッグ&ドロップ対応エディター
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 記事メタデータ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">記事タイトル</Label>
                  <Input
                    id="title"
                    placeholder="記事タイトルを入力"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">対象コース</Label>
                  <Select value={articleCourse} onValueChange={setArticleCourse}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="course1">コース1 - 基礎編</SelectItem>
                      <SelectItem value="course2">コース2 - 実践編</SelectItem>
                      <SelectItem value="course3">コース3 - 上級編</SelectItem>
                      <SelectItem value="all">全コース共通</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">公開状態</Label>
                  <Select value={articleStatus} onValueChange={setArticleStatus}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="draft">下書き</SelectItem>
                      <SelectItem value="published">公開</SelectItem>
                      <SelectItem value="private">非公開</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Final エディター */}
              <div className="space-y-2">
                <Label className="text-white">記事内容</Label>
                <FinalEditor
                  content={articleContent}
                  onChange={setArticleContent}
                  placeholder="記事の内容を入力してください。画像をドラッグ&ドロップで挿入できます。"
                  articleId={`article_${Date.now()}`}
                />
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  記事を保存
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  プレビュー
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setArticleTitle('');
                    setArticleContent('');
                    setArticleCourse('course1');
                    setArticleStatus('draft');
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規作成
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* エディター機能説明 */}
          <Card className="bg-gray-900 border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white">Final エディター機能</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300">
                <div>
                  <h4 className="font-semibold text-pink-400 mb-2">基本フォーマット</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 太字・斜体・下線</li>
                    <li>• 見出し（H1, H2）</li>
                    <li>• リスト（順序付き・なし）</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-pink-400 mb-2">簡単な文字色変更</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• プルダウン式選択</li>
                    <li>• 白、赤、青の3色</li>
                    <li>• 直感的な操作</li>
                    <li>• リアルタイム反映</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-pink-400 mb-2">簡単な画像挿入</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• ドラッグ&ドロップで挿入</li>
                    <li>• 画像選択ボタン</li>
                    <li>• ブロック間に自動挿入</li>
                    <li>• 美しいスタイリング</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-pink-400 mb-2">自動保存機能</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 2秒間隔での自動保存</li>
                    <li>• LocalStorage バックアップ</li>
                    <li>• 保存状況の表示</li>
                    <li>• 下書き復元機能</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* その他のタブ（プレースホルダー） */}
        <TabsContent value="articles">
          <Card className="bg-gray-900 border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white">記事管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">記事一覧と管理機能（実装予定）</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card className="bg-gray-900 border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white">動画管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">動画アップロードと管理機能（実装予定）</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-gray-900 border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white">ユーザー管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">ユーザー一覧と権限管理（実装予定）</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEditor;
