import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Calendar, Tag } from 'lucide-react';
import { contentAPI } from '../services/api';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm]);

  const loadArticles = async () => {
    try {
      const response = await contentAPI.getArticles();
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('記事の読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (!searchTerm) {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
  };

  const handleArticleClick = async (article) => {
    try {
      const response = await contentAPI.getArticle(article.id);
      setSelectedArticle(response.data.article);
    } catch (error) {
      console.error('記事の詳細読み込みエラー:', error);
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
          <p className="mt-4 text-gray-600">記事を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedArticle(null)}
            className="mb-4"
          >
            ← 記事一覧に戻る
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedArticle.created_at)}</span>
              </div>
              {selectedArticle.category && (
                <Badge variant="secondary">{selectedArticle.category}</Badge>
              )}
            </div>
            {selectedArticle.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {selectedArticle.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {selectedArticle.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">記事</h1>
        <p className="text-gray-600">恋愛に関する記事を読んで知識を深めましょう</p>
      </div>

      {/* 検索バー */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="記事を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 記事一覧 */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleArticleClick(article)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <BookOpen className="h-5 w-5 text-blue-500 mt-1" />
                  {article.category && (
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.content.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{article.tags.length}</span>
                    </div>
                  )}
                </div>
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? '検索結果が見つかりません' : '記事がありません'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? '別のキーワードで検索してみてください' 
                : 'まだ記事が投稿されていません'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Articles;

