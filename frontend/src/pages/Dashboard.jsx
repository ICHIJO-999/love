import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { contentAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalVideos: 0,
    completedContent: 0,
    totalProgress: 0,
  });
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [articlesRes, videosRes, progressRes] = await Promise.all([
        contentAPI.getArticles(),
        contentAPI.getVideos(),
        contentAPI.getUserProgress(),
      ]);

      const articles = articlesRes.data.articles || [];
      const videos = videosRes.data.videos || [];
      const progress = progressRes.data.progress || [];

      // 統計情報を計算
      const completedCount = progress.filter(p => p.completed).length;
      const totalContent = articles.length + videos.length;
      const progressPercentage = totalContent > 0 ? (completedCount / totalContent) * 100 : 0;

      setStats({
        totalArticles: articles.length,
        totalVideos: videos.length,
        completedContent: completedCount,
        totalProgress: Math.round(progressPercentage),
      });

      // 最新のコンテンツを取得（記事と動画を混合して最新5件）
      const allContent = [
        ...articles.map(a => ({ ...a, type: 'article' })),
        ...videos.map(v => ({ ...v, type: 'video' })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

      setRecentContent(allContent);
    } catch (error) {
      console.error('ダッシュボードデータの読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ウェルカムメッセージ */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          おかえりなさい、{user?.username}さん！
        </h1>
        <p className="text-pink-100">
          今日も素敵な恋愛について学んでいきましょう。
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">記事数</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              利用可能な記事
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">動画数</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVideos}</div>
            <p className="text-xs text-muted-foreground">
              利用可能な動画
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完了済み</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedContent}</div>
            <p className="text-xs text-muted-foreground">
              学習完了コンテンツ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">進捗率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProgress}%</div>
            <p className="text-xs text-muted-foreground">
              全体の学習進捗
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 最新コンテンツ */}
      <Card>
        <CardHeader>
          <CardTitle>最新のコンテンツ</CardTitle>
          <CardDescription>
            新しく追加されたコンテンツをチェックしましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentContent.length > 0 ? (
            <div className="space-y-4">
              {recentContent.map((content) => (
                <div
                  key={`${content.type}-${content.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {content.type === 'article' ? (
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Play className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <h3 className="font-medium">{content.title}</h3>
                      <p className="text-sm text-gray-500">
                        {content.type === 'article' ? '記事' : '動画'} • {formatDate(content.created_at)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate(content.type === 'article' ? 'articles' : 'videos')}
                  >
                    見る
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">まだコンテンツがありません</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* クイックアクション */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('articles')}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span>記事を読む</span>
            </CardTitle>
            <CardDescription>
              恋愛に関する記事を読んで知識を深めましょう
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('videos')}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-red-500" />
              <span>動画を見る</span>
            </CardTitle>
            <CardDescription>
              動画コンテンツで実践的なスキルを学びましょう
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

