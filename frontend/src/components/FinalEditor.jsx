import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Upload,
  Save,
  Clock,
  CheckCircle,
  Sparkles,
  Zap
} from 'lucide-react';

const FinalEditor = ({ content, onChange, placeholder = "記事の内容を入力してください...", articleId = null }) => {
  const [editorContent, setEditorContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState('white');
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // 自動保存機能
  const autoSave = useCallback(async (content) => {
    if (!articleId) return;

    setAutoSaveStatus('saving');
    
    try {
      // LocalStorageに保存
      const saveData = {
        content,
        timestamp: new Date().toISOString(),
        articleId
      };
      localStorage.setItem(`article_draft_${articleId}`, JSON.stringify(saveData));
      
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      onChange(content);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
    }
  }, [articleId, onChange]);

  // 下書きの復元
  useEffect(() => {
    if (articleId) {
      const savedDraft = localStorage.getItem(`article_draft_${articleId}`);
      if (savedDraft) {
        try {
          const saveData = JSON.parse(savedDraft);
          setEditorContent(saveData.content);
          setLastSaved(new Date(saveData.timestamp));
          if (editorRef.current) {
            editorRef.current.innerHTML = saveData.content;
          }
        } catch (error) {
          console.error('Failed to restore draft:', error);
        }
      }
    }
  }, [articleId]);

  // 自動保存のトリガー
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave(editorContent);
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorContent, autoSave]);

  // エディター内容の更新
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setEditorContent(content);
    }
  };

  // フォーマット適用
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    handleContentChange();
    editorRef.current?.focus();
  };

  // 文字色変更
  const handleColorChange = (color) => {
    setSelectedColor(color);
    const colorMap = {
      'white': '#ffffff',
      'red': '#ff0000',
      'blue': '#0000ff'
    };
    applyFormat('foreColor', colorMap[color]);
  };

  // ファイル選択による画像挿入
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        insertImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  // 画像挿入
  const insertImage = (src) => {
    const img = `<img src="${src}" style="max-width: 300px; height: auto; border-radius: 12px; box-shadow: 0 0 30px rgba(255, 105, 180, 0.3); border: 2px solid rgba(255, 105, 180, 0.2); margin: 10px 0;" />`;
    
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, img);
      handleContentChange();
    }
  };

  // ドラッグ&ドロップ処理
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          insertImage(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 手動保存
  const handleManualSave = () => {
    autoSave(editorContent);
  };

  // 自動保存ステータス表示
  const renderAutoSaveStatus = () => {
    const formatTime = (date) => {
      return date.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    switch (autoSaveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-yellow-400">
            <Clock className="h-4 w-4 animate-spin" />
            <span className="text-sm">保存中...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{formatTime(lastSaved)} に保存済み</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-400">
            <span className="text-sm">保存エラー</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              className="h-6 px-2 text-xs border-red-400 text-red-400 hover:bg-red-500/10"
            >
              再試行
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border-2 border-pink-500/20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-pink-500/10">
      {/* 常に表示されるツールバー */}
      <div className="border-b border-pink-500/20 p-4 bg-gradient-to-r from-gray-900 to-gray-800 flex flex-wrap gap-2 items-center">
        {/* 基本フォーマット */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('bold')}
          className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('italic')}
          className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('underline')}
          className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-pink-500/30 mx-2" />

        {/* 文字色選択（シンプルなボタン） */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleColorChange('white')}
          className={`border-pink-500/30 text-white hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200 ${
            selectedColor === 'white' ? 'bg-pink-500/20' : ''
          }`}
        >
          白
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleColorChange('red')}
          className={`border-pink-500/30 text-red-400 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200 ${
            selectedColor === 'red' ? 'bg-pink-500/20' : ''
          }`}
        >
          赤
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleColorChange('blue')}
          className={`border-pink-500/30 text-blue-400 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200 ${
            selectedColor === 'blue' ? 'bg-pink-500/20' : ''
          }`}
        >
          青
        </Button>

        <div className="w-px h-6 bg-pink-500/30 mx-2" />

        {/* 画像挿入 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200"
        >
          <Upload className="h-4 w-4 mr-2" />
          画像選択
        </Button>

        <div className="w-px h-6 bg-pink-500/30 mx-2" />

        {/* 手動保存 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualSave}
          className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>

      {/* エディター本体 */}
      <div 
        className={`min-h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 relative p-6 ${
          isDragging ? 'bg-gradient-to-br from-pink-900/20 to-purple-900/20' : ''
        } transition-all duration-300`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-900/40 to-purple-900/40 z-10 rounded-lg">
            <div className="text-center">
              <div className="relative">
                <Upload className="h-16 w-16 text-pink-400 mx-auto mb-4 animate-bounce" />
                <Sparkles className="h-6 w-6 text-pink-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <p className="text-pink-300 font-medium text-lg">画像をドロップして挿入</p>
              <p className="text-pink-400/70 text-sm mt-1">カーソル位置に画像が挿入されます</p>
            </div>
          </div>
        )}
        
        <div
          ref={editorRef}
          className="min-h-[350px] text-white focus:outline-none text-base leading-relaxed"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleContentChange}
          style={{
            outline: 'none',
            color: 'white'
          }}
          data-placeholder={placeholder}
        />
      </div>

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ステータスバー */}
      <div className="border-t border-pink-500/20 p-3 bg-gradient-to-r from-gray-900 to-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-pink-400">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Final エディター</span>
          </div>
          {renderAutoSaveStatus()}
        </div>
        <span className="text-sm text-pink-300">
          {editorContent.replace(/<[^>]*>/g, '').length} 文字
        </span>
      </div>

      {/* プレースホルダー用CSS */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default FinalEditor;
