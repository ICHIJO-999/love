import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image as ImageIcon,
  Palette,
  Highlighter,
  Upload,
  Plus,
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  AlignLeft
} from 'lucide-react';

const BlockEditor = ({ content, onChange, placeholder = "記事の内容を入力してください..." }) => {
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: '', placeholder: 'ここに文章を入力...' }
  ]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const fileInputRef = useRef(null);

  const colors = [
    '#000000', // 黒
    '#ff0000', // 赤
    '#0000ff', // 青
    '#008000', // 緑
    '#800080', // 紫
    '#ff69b4', // ピンク
    '#ffa500', // オレンジ
    '#ffff00', // 黄色
  ];

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
      case 'heading1': return '見出し1を入力...';
      case 'heading2': return '見出し2を入力...';
      case 'paragraph': return 'ここに文章を入力...';
      case 'quote': return '引用文を入力...';
      case 'code': return 'コードを入力...';
      case 'list': return 'リスト項目を入力...';
      default: return 'テキストを入力...';
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
    
    // 全体のコンテンツを更新
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    );
    const htmlContent = blocksToHtml(updatedBlocks);
    onChange(htmlContent);
  };

  // ブロックをHTMLに変換
  const blocksToHtml = (blocksArray) => {
    return blocksArray.map(block => {
      switch (block.type) {
        case 'heading1':
          return `<h1>${block.content}</h1>`;
        case 'heading2':
          return `<h2>${block.content}</h2>`;
        case 'paragraph':
          return `<p>${block.content}</p>`;
        case 'quote':
          return `<blockquote style="border-left: 4px solid #ff69b4; padding-left: 16px; margin: 16px 0; font-style: italic;">${block.content}</blockquote>`;
        case 'code':
          return `<pre style="background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; overflow: auto;"><code>${block.content}</code></pre>`;
        case 'list':
          return `<ul><li>${block.content}</li></ul>`;
        case 'image':
          return `<img src="${block.content}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />`;
        default:
          return `<p>${block.content}</p>`;
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
  const setColor = (color) => {
    if (activeBlock) {
      applyFormat('foreColor', color, activeBlock);
    }
    setShowColorPicker(false);
  };

  // 画像挿入
  const insertImage = (src, blockId = null) => {
    if (blockId) {
      const imageBlock = {
        id: Date.now(),
        type: 'image',
        content: src,
        placeholder: ''
      };
      
      setBlocks(prev => {
        const index = prev.findIndex(block => block.id === blockId);
        const newBlocks = [...prev];
        newBlocks.splice(index + 1, 0, imageBlock);
        return newBlocks;
      });
    }
  };

  // ファイル選択
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        insertImage(e.target.result, activeBlock);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  // ドラッグ&ドロップ処理
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        insertImage(event.target.result, activeBlock);
      };
      reader.readAsDataURL(file);
    });
  };

  // ブロックレンダリング
  const renderBlock = (block, index) => {
    const isActive = activeBlock === block.id;

    return (
      <div 
        key={block.id} 
        className={`group relative border border-transparent hover:border-pink-500/30 rounded-lg transition-all ${
          isActive ? 'border-pink-500/50 bg-gray-800/50' : ''
        }`}
        onFocus={() => setActiveBlock(block.id)}
        onBlur={() => setActiveBlock(null)}
      >
        {/* ブロックコントロール */}
        <div className={`absolute left-0 top-0 flex items-center gap-1 transform -translate-x-full pr-2 ${
          isActive || 'group-hover:opacity-100 opacity-0'
        } transition-opacity`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-pink-400"
            onClick={() => moveBlock(block.id, 'up')}
            disabled={index === 0}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-pink-400"
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-pink-400"
            onClick={() => moveBlock(block.id, 'down')}
            disabled={index === blocks.length - 1}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
          
          {blocks.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
              onClick={() => deleteBlock(block.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* ブロック追加ボタン */}
        <div className={`absolute right-0 top-0 transform translate-x-full pl-2 ${
          isActive || 'group-hover:opacity-100 opacity-0'
        } transition-opacity`}>
          <div className="relative group/add">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-pink-400"
            >
              <Plus className="h-3 w-3" />
            </Button>
            
            <div className="absolute top-full right-0 mt-1 hidden group-hover/add:block bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => addBlock('paragraph', index)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Type className="h-3 w-3" />
                段落
              </button>
              <button
                onClick={() => addBlock('heading1', index)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Heading1 className="h-3 w-3" />
                見出し1
              </button>
              <button
                onClick={() => addBlock('heading2', index)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Heading2 className="h-3 w-3" />
                見出し2
              </button>
              <button
                onClick={() => addBlock('quote', index)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Quote className="h-3 w-3" />
                引用
              </button>
              <button
                onClick={() => addBlock('code', index)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Code className="h-3 w-3" />
                コード
              </button>
            </div>
          </div>
        </div>

        {/* ブロック内容 */}
        {block.type === 'image' ? (
          <div className="p-2">
            <img 
              src={block.content} 
              alt="挿入された画像"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        ) : (
          <div
            id={`block-${block.id}`}
            className={`min-h-[40px] p-3 text-white focus:outline-none ${
              block.type === 'heading1' ? 'text-2xl font-bold' :
              block.type === 'heading2' ? 'text-xl font-semibold' :
              block.type === 'quote' ? 'italic border-l-4 border-pink-500 pl-4' :
              block.type === 'code' ? 'font-mono bg-gray-900 rounded' :
              'text-base'
            }`}
            contentEditable
            suppressContentEditableWarning={true}
            onInput={(e) => updateBlockContent(block.id, e.target.innerHTML)}
            onFocus={() => setActiveBlock(block.id)}
            dangerouslySetInnerHTML={{ __html: block.content }}
            data-placeholder={block.placeholder}
            style={{
              outline: 'none',
              color: 'white'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-800">
      {/* ツールバー */}
      {activeBlock && (
        <div className="border-b border-gray-600 p-3 bg-gray-900 flex flex-wrap gap-2">
          {/* 基本フォーマット */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormat('bold', null, activeBlock)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormat('italic', null, activeBlock)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormat('underline', null, activeBlock)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-600 mx-1" />

          {/* 文字色 */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Palette className="h-4 w-4" />
            </Button>
            
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                <div className="grid grid-cols-4 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-500 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => setColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    applyFormat('removeFormat', null, activeBlock);
                    setShowColorPicker(false);
                  }}
                >
                  色をリセット
                </Button>
              </div>
            )}
          </div>

          {/* ハイライト */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormat('hiliteColor', '#ffff00', activeBlock)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-600 mx-1" />

          {/* 画像挿入 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* エディター本体 */}
      <div 
        className={`min-h-[300px] bg-gray-800 relative space-y-2 p-4 ${
          isDragging ? 'bg-gray-700 border-2 border-dashed border-pink-500' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700/80 z-10">
            <div className="text-center">
              <Upload className="h-12 w-12 text-pink-500 mx-auto mb-2" />
              <p className="text-pink-400 font-medium">画像をドロップして挿入</p>
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

      {/* 文字数カウンター */}
      <div className="border-t border-gray-600 p-2 bg-gray-900 text-right">
        <span className="text-sm text-gray-400">
          {blocks.reduce((total, block) => total + (block.content?.length || 0), 0)} 文字
        </span>
      </div>
    </div>
  );
};

export default BlockEditor;
