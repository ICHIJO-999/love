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
  Plus
} from 'lucide-react';

const AdvancedEditor = ({ content, onChange, placeholder = "記事の内容を入力してください..." }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const editorRef = useRef(null);
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

  // テキスト選択範囲を取得
  const getSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  // フォーマット適用
  const applyFormat = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // 文字色変更
  const setColor = (color) => {
    applyFormat('foreColor', color);
    setShowColorPicker(false);
  };

  // 画像挿入
  const insertImage = (src) => {
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.margin = '10px 0';
    img.style.borderRadius = '8px';
    img.className = 'editor-image';

    const selection = getSelection();
    if (selection) {
      selection.deleteContents();
      selection.insertNode(img);
      // カーソルを画像の後に移動
      const range = document.createRange();
      range.setStartAfter(img);
      range.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (editorRef.current) {
      editorRef.current.appendChild(img);
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // ファイル選択
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        insertImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    // ファイル入力をリセット
    event.target.value = '';
  };

  // URL入力で画像挿入
  const handleImageUrl = () => {
    const url = prompt('画像URLを入力してください:');
    if (url) {
      insertImage(url);
    }
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
        insertImage(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  // エディター内容変更
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // ブロック追加
  const addBlock = (type) => {
    let element;
    switch (type) {
      case 'heading1':
        element = document.createElement('h1');
        element.textContent = '見出し1';
        break;
      case 'heading2':
        element = document.createElement('h2');
        element.textContent = '見出し2';
        break;
      case 'paragraph':
        element = document.createElement('p');
        element.textContent = '新しい段落';
        break;
      case 'quote':
        element = document.createElement('blockquote');
        element.textContent = '引用文';
        element.style.borderLeft = '4px solid #ff69b4';
        element.style.paddingLeft = '16px';
        element.style.margin = '16px 0';
        element.style.fontStyle = 'italic';
        break;
      case 'code':
        element = document.createElement('pre');
        element.style.backgroundColor = '#1f2937';
        element.style.color = '#f9fafb';
        element.style.padding = '12px';
        element.style.borderRadius = '6px';
        element.style.overflow = 'auto';
        const code = document.createElement('code');
        code.textContent = 'console.log("Hello World");';
        element.appendChild(code);
        break;
      default:
        return;
    }

    if (editorRef.current) {
      editorRef.current.appendChild(element);
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-800">
      {/* ツールバー */}
      <div className="border-b border-gray-600 p-3 bg-gray-900 flex flex-wrap gap-2">
        {/* 基本フォーマット */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('bold')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('italic')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('underline')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* 見出し */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('formatBlock', 'h1')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('formatBlock', 'h2')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* リスト */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('insertUnorderedList')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyFormat('insertOrderedList')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ListOrdered className="h-4 w-4" />
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
                  applyFormat('removeFormat');
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
          onClick={() => applyFormat('hiliteColor', '#ffff00')}
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

        <Button
          variant="outline"
          size="sm"
          onClick={handleImageUrl}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* ブロック追加 */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
            <button
              onClick={() => addBlock('paragraph')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              段落
            </button>
            <button
              onClick={() => addBlock('heading1')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              見出し1
            </button>
            <button
              onClick={() => addBlock('heading2')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              見出し2
            </button>
            <button
              onClick={() => addBlock('quote')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              引用
            </button>
            <button
              onClick={() => addBlock('code')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              コード
            </button>
          </div>
        </div>
      </div>

      {/* エディター本体 */}
      <div 
        className={`min-h-[300px] bg-gray-800 relative ${isDragging ? 'bg-gray-700 border-2 border-dashed border-pink-500' : ''}`}
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
        
        <div 
          ref={editorRef}
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 text-white"
          contentEditable
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ 
            outline: 'none',
            color: 'white'
          }}
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

      {/* 文字数カウンター */}
      <div className="border-t border-gray-600 p-2 bg-gray-900 text-right">
        <span className="text-sm text-gray-400">
          {editorRef.current?.textContent?.length || 0} 文字
        </span>
      </div>
    </div>
  );
};

export default AdvancedEditor;
