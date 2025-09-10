import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Search, Calendar, Tag, Clock } from 'lucide-react';
import { contentAPI } from '../services/api';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm]);

  const loadVideos = async () => {
    try {
      const response = await contentAPI.getVideos();
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('動画の読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    if (!searchTerm) {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredVideos(filtered);
    }
  };

  const handleVideoClick = async (video) => {
    try {
      const response = await contentAPI.getVideo(video.id);
      setSelectedVideo(response.data.video);
    } catch (error) {
      console.error('動画の詳細読み込みエラー:', error);
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
          <p className="mt-4 text-gray-600">動画を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedVideo(null)}
            className="mb-4"
          >
            ← 動画一覧に戻る
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{selectedVideo.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedVideo.created_at)}</span>
              </div>
              {selectedVideo.category && (
                <Badge variant="secondary">{selectedVideo.category}</Badge>
              )}
            </div>
            {selectedVideo.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {selectedVideo.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {/* 動画プレイヤー（プレースホルダー） */}
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">動画: {selectedVideo.filename}</p>
                <p className="text-sm text-gray-400 mt-2">
                  実際の実装では、ここに動画プレイヤーが表示されます
                </p>
              </div>
            </div>

            {/* 動画の説明 */}
            {selectedVideo.description && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">動画について</h3>
                {selectedVideo.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">動画</h1>
        <p className="text-gray-600">動画コンテンツで実践的なスキルを学びましょう</p>
      </div>

      {/* 検索バー */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="動画を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 動画一覧 */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleVideoClick(video)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Play className="h-5 w-5 text-red-500 mt-1" />
                  {video.category && (
                    <Badge variant="secondary" className="text-xs">
                      {video.category}
                    </Badge>
                  )}
                </div>
                
                {/* サムネイル（プレースホルダー） */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <Play className="h-8 w-8 text-gray-400" />
                </div>
                
                <CardTitle className="text-lg line-clamp-2">
                  {video.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {video.description ? video.description.substring(0, 150) + '...' : '動画の説明はありません'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(video.created_at)}</span>
                  </div>
                  {video.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{video.tags.length}</span>
                    </div>
                  )}
                </div>
                
                {video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {video.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{video.tags.length - 3}
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
            <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? '検索結果が見つかりません' : '動画がありません'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? '別のキーワードで検索してみてください' 
                : 'まだ動画が投稿されていません'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Videos;

