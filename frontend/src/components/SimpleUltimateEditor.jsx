import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Heading1, 
  Heading2, 
  Quote, 
  Code, 
  Image as ImageIcon,
  Upload,
  Plus,
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Sparkles,
  Zap,
  Save,
  Clock,
  CheckCircle
} from 'lucide-react';

const SimpleUltimateEditor = ({ content, onChange, placeholder = "記事の内容を入力してください...", articleId = null }) => {
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: '', placeholder: 'ここに文章を入力...' }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const [dragOverBlock, setDragOverBlock] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState('white');
  const fileInputRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // 色の選択肢（赤と青のみ）
  const colors = [
    { value: 'white', label: '白', color: '#ffffff' },
    { value: 'red', label: '赤', color: '#ff0000' },
    { value: 'blue', label: '青', color: '#0000ff' }
  ];

  // 自動保存機能
  const autoSave = useCallback(async (blocksData) => {
    if (!articleId) return;

    setAutoSaveStatus('saving');
    
    try {
      const htmlContent = blocksToHtml(blocksData);
      
      // LocalStorageに保存
      const saveData = {
        blocks: blocksData,
        htmlContent,
        timestamp: new Date().toISOString(),
        articleId
      };
      localStorage.setItem(`article_draft_${articleId}`, JSON.stringify(saveData));
      
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      onChange(htmlContent);
      
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
          setBlocks(saveData.blocks);
          setLastSaved(new Date(saveData.timestamp));
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
      autoSave(blocks);
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [blocks, autoSave]);

  // ブロック追加
  const addBlock = (type, afterIndex = null) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: '',
      placeholder: getPlaceholderForType(type)
    };

    setBlocks(prev => {
      if (afterIndex !== null) {
        const newBlocks = [...prev];
        newBlocks.splice(afterIndex + 1, 0, newBlock);
        return newBlocks;
      }
      return [...prev, newBlock];
    });
  };

  // ブロックタイプ別プレースホルダー
  const getPlaceholderForType = (type) => {
    switch (type) {
      case 'heading1': return '✨ 見出し1を入力...';
      case 'heading2': return '💫 見出し2を入力...';
      case 'paragraph': return '💭 ここに文章を入力...';
      case 'quote': return '💎 引用文を入力...';
      case 'code': return '⚡ コードを入力...';
      default: return '✨ テキストを入力...';
    }
  };

  // ブロック削除
  const deleteBlock = (blockId) => {
    if (blocks.length > 1) {
      setBlocks(prev => prev.filter(block => block.id !== blockId));
    }
  };

  // ブロック移動
  const moveBlock = (blockId, direction) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === blockId);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newBlocks = [...prev];
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      return newBlocks;
    });
  };

  // ブロック内容更新
  const updateBlockContent = (blockId, content) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId ? { ...block, content } : block
      )
    );
  };

  // ブロックをHTMLに変換
  const blocksToHtml = (blocksArray) => {
    return blocksArray.map(block => {
      switch (block.type) {
        case 'heading1':
          return `<h1 style="color: #ff69b4; text-shadow: 0 0 10px rgba(255, 105, 180, 0.5); font-weight: bold; margin: 20px 0;">${block.content}</h1>`;
        case 'heading2':
          return `<h2 style="color: #ff69b4; text-shadow: 0 0 8px rgba(255, 105, 180, 0.4); font-weight: semibold; margin: 16px 0;">${block.content}</h2>`;
        case 'paragraph':
          return `<p style="color: #f9fafb; line-height: 1.7; margin: 12px 0;">${block.content}</p>`;
        case 'quote':
          return `<blockquote style="border-left: 4px solid #ff69b4; background: linear-gradient(90deg, rgba(255, 105, 180, 0.1), transparent); padding: 16px; margin: 16px 0; font-style: italic; color: #f9fafb; box-shadow: 0 0 20px rgba(255, 105, 180, 0.1);">${block.content}</blockquote>`;
        case 'code':
          return `<pre style="background: linear-gradient(135deg, #1f2937, #111827); color: #f9fafb; padding: 16px; border-radius: 8px; overflow: auto; border: 1px solid rgba(255, 105, 180, 0.2); box-shadow: 0 0 20px rgba(255, 105, 180, 0.1); margin: 16px 0;"><code>${block.content}</code></pre>`;
        case 'image':
          return `<div style="text-align: center; margin: 20px 0;"><img src="${block.content}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 0 30px rgba(255, 105, 180, 0.3); border: 2px solid rgba(255, 105, 180, 0.2);" /></div>`;
        default:
          return `<p style="color: #f9fafb; line-height: 1.7; margin: 12px 0;">${block.content}</p>`;
      }
    }).join('');
  };

  // フォーマット適用
  const applyFormat = useCallback((command, value = null, blockId = null) => {
    if (blockId && activeBlock === blockId) {
      document.execCommand(command, false, value);
      const blockElement = document.getElementById(`block-${blockId}`);
      if (blockElement) {
        updateBlockContent(blockId, blockElement.innerHTML);
      }
    }
  }, [activeBlock]);

  // 文字色変更
  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (activeBlock) {
      const colorValue = colors.find(c => c.value === color)?.color;
      applyFormat('foreColor', colorValue, activeBlock);
    }
  };

  // ファイル選択による画像挿入
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        insertImageAsBlock(e.target.result, activeBlock);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  // 新しいブロックとして画像挿入
  const insertImageAsBlock = (src, blockId = null) => {
    const imageBlock = {
      id: Date.now(),
      type: 'image',
      content: src,
      placeholder: ''
    };
    
    if (blockId) {
      setBlocks(prev => {
        const index = prev.findIndex(block => block.id === blockId);
        const newBlocks = [...prev];
        newBlocks.splice(index + 1, 0, imageBlock);
        return newBlocks;
      });
    } else {
      setBlocks(prev => [...prev, imageBlock]);
    }
  };

  // ドラッグ&ドロップ処理
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    // ドラッグオーバーしているブロックを特定
    const blockElement = e.target.closest('[data-block-id]');
    if (blockElement) {
      const blockId = parseInt(blockElement.dataset.blockId);
      setDragOverBlock(blockId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // エディター全体から離れた場合のみドラッグ状態をリセット
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
      setDragOverBlock(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragOverBlock(null);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          // ドロップされたブロックを特定
          const blockElement = e.target.closest('[data-block-id]');
          if (blockElement) {
            const blockId = parseInt(blockElement.dataset.blockId);
            insertImageAsBlock(event.target.result, blockId);
          } else {
            insertImageAsBlock(event.target.result);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 手動保存
  const handleManualSave = () => {
    autoSave(blocks);
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

  // ブロックレンダリング
  const renderBlock = (block, index) => {
    const isActive = activeBlock === block.id;
    const isDragOver = dragOverBlock === block.id;

    return (
      <div 
        key={block.id} 
        data-block-id={block.id}
        className={`group relative border-2 transition-all duration-300 rounded-xl ${
          isActive ? 'border-pink-500/50 bg-gradient-to-r from-pink-500/5 to-purple-500/5 shadow-lg shadow-pink-500/10' : 
          isDragOver ? 'border-pink-400/70 bg-gradient-to-r from-pink-400/10 to-purple-400/10' :
          'border-transparent hover:border-pink-500/30'
        }`}
        onClick={() => setActiveBlock(block.id)}
      >
        {/* ブロックコントロール */}
        <div className={`absolute left-0 top-0 flex items-center gap-1 transform -translate-x-full pr-3 ${
          isActive || 'group-hover:opacity-100 opacity-0'
        } transition-all duration-300`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-full transition-all duration-200"
            onClick={() => moveBlock(block.id, 'up')}
            disabled={index === 0}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-full transition-all duration-200"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-full transition-all duration-200"
            onClick={() => moveBlock(block.id, 'down')}
            disabled={index === blocks.length - 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {blocks.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200"
              onClick={() => deleteBlock(block.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* ブロック追加ボタン */}
        <div className={`absolute right-0 top-0 transform translate-x-full pl-3 ${
          isActive || 'group-hover:opacity-100 opacity-0'
        } transition-all duration-300`}>
          <div className="relative group/add">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-full transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <div className="absolute top-full right-0 mt-2 hidden group-hover/add:block bg-gradient-to-br from-gray-900 to-gray-800 border border-pink-500/20 rounded-xl shadow-2xl shadow-pink-500/10 z-10 min-w-[140px] overflow-hidden">
              <button
                onClick={() => addBlock('paragraph', index)}
                className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-pink-500/10 hover:text-pink-300 flex items-center gap-3 transition-all duration-200"
              >
                <Type className="h-4 w-4" />
                段落
              </button>
              <button
                onClick={() => addBlock('heading1', index)}
                className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-pink-500/10 hover:text-pink-300 flex items-center gap-3 transition-all duration-200"
              >
                <Heading1 className="h-4 w-4" />
                見出し1
              </button>
              <button
                onClick={() => addBlock('heading2', index)}
                className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-pink-500/10 hover:text-pink-300 flex items-center gap-3 transition-all duration-200"
              >
                <Heading2 className="h-4 w-4" />
                見出し2
              </button>
              <button
                onClick={() => addBlock('quote', index)}
                className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-pink-500/10 hover:text-pink-300 flex items-center gap-3 transition-all duration-200"
              >
                <Quote className="h-4 w-4" />
                引用
              </button>
              <button
                onClick={() => addBlock('code', index)}
                className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-pink-500/10 hover:text-pink-300 flex items-center gap-3 transition-all duration-200"
              >
                <Code className="h-4 w-4" />
                コード
              </button>
            </div>
          </div>
        </div>

        {/* ドラッグオーバー表示 */}
        {isDragOver && (
          <div className="absolute inset-0 border-2 border-dashed border-pink-400 rounded-xl bg-pink-400/5 flex items-center justify-center z-10">
            <div className="text-pink-400 text-sm font-medium">ここに画像をドロップ</div>
          </div>
        )}

        {/* ブロック内容 */}
        {block.type === 'image' ? (
          <div className="p-4">
            <img 
              src={block.content} 
              alt="挿入された画像"
              className="max-w-full h-auto rounded-xl shadow-lg shadow-pink-500/20 border-2 border-pink-500/20"
            />
          </div>
        ) : (
          <div
            id={`block-${block.id}`}
            className={`min-h-[50px] p-4 text-white focus:outline-none transition-all duration-200 ${
              block.type === 'heading1' ? 'text-3xl font-bold text-pink-400' :
              block.type === 'heading2' ? 'text-2xl font-semibold text-pink-300' :
              block.type === 'quote' ? 'italic border-l-4 border-pink-500 pl-6 bg-gradient-to-r from-pink-500/10 to-transparent' :
              block.type === 'code' ? 'font-mono bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-pink-500/20' :
              'text-base leading-relaxed'
            }`}
            contentEditable
            suppressContentEditableWarning={true}
            onInput={(e) => updateBlockContent(block.id, e.target.innerHTML)}
            onFocus={() => setActiveBlock(block.id)}
            dangerouslySetInnerHTML={{ __html: block.content }}
            data-placeholder={block.placeholder}
            style={{
              outline: 'none',
              color: block.type.startsWith('heading') ? '#ff69b4' : 'white'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="border-2 border-pink-500/20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-pink-500/10">
      {/* ツールバー */}
      {activeBlock && (
        <div className="border-b border-pink-500/20 p-4 bg-gradient-to-r from-gray-900 to-gray-800 flex flex-wrap gap-2 items-center">
          {/* 基本フォーマット */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormat('bold', null, activeBlock)}
            className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormat('italic', null, activeBlock)}
            className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormat('underline', null, activeBlock)}
            className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 transition-all duration-200"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-pink-500/30 mx-2" />

          {/* 文字色選択（プルダウン） */}
          <Select value={selectedColor} onValueChange={handleColorChange}>
            <SelectTrigger className="w-24 border-pink-500/30 text-pink-300 bg-gray-800 hover:bg-pink-500/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-pink-500/30">
              {colors.map((color) => (
                <SelectItem 
                  key={color.value} 
                  value={color.value}
                  className="text-gray-300 hover:bg-pink-500/10 focus:bg-pink-500/10"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-gray-600"
                      style={{ backgroundColor: color.color }}
                    />
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
      )}

      {/* エディター本体 */}
      <div 
        className={`min-h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 relative space-y-4 p-6 ${
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
              <p className="text-pink-400/70 text-sm mt-1">ブロック間に画像が挿入されます</p>
            </div>
          </div>
        )}
        
        {blocks.map((block, index) => renderBlock(block, index))}
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
            <span className="text-sm font-medium">Simple Ultimate エディター</span>
          </div>
          {renderAutoSaveStatus()}
        </div>
        <span className="text-sm text-pink-300">
          {blocks.reduce((total, block) => total + (block.content?.replace(/<[^>]*>/g, '').length || 0), 0)} 文字
        </span>
      </div>
    </div>
  );
};

export default SimpleUltimateEditor;
