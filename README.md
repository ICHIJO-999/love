# THE secret - 統合サイト

恋愛コンサルティング会員サイトの統合版です。

## 🎯 機能

### パスワード認証システム
- **管理者**: `admin123` - TIPSレベルエディターで記事作成・編集
- **コース1**: `course1` - 基礎編記事閲覧
- **コース2**: `course2` - 応用編記事閲覧  
- **コース3**: `course3` - 上級編記事閲覧

### TIPSレベルエディター機能
- リッチテキスト編集（太字、斜体、下線）
- 赤・青文字色ボタン
- 画像ドラッグ&ドロップ機能
- YouTube動画埋め込み対応
- GitHub Issues API連携（オンライン保存）

### THE SECRETデザイン
- 黒背景とピンクグロー効果
- レスポンシブデザイン対応
- 統一された美しいインターフェース

## 📁 ファイル構成

- `index.html` - GitHub Pages用簡易版
- `the-secret-integrated.html` - フル機能版統合サイト
- `favicon.ico` - サイトアイコン

## 🚀 使用方法

### GitHub Pages版
https://ichijo-999.github.io/love/

### フル機能版
1. `the-secret-integrated.html` をダウンロード
2. GitHub Personal Access Tokenを設定
3. ブラウザで開いて使用

## 🔧 GitHub Issues API設定

フル機能版を使用する場合は、以下の設定が必要です：

1. GitHub Personal Access Token取得
2. `the-secret-integrated.html` 内の `GITHUB_TOKEN` を設定
3. 必要な権限: `repo`, `issues`

## 📝 記事管理

記事はGitHub Issuesとして保存されます：
- ラベル `article` で記事を識別
- ラベル `course:course1/2/3` でコース分類
- メタデータ付きで構造化保存

## 🎨 デザインシステム

THE SECRETデザインシステムを採用：
- カラーパレット: 黒背景 + ピンクアクセント
- タイポグラフィ: Hiragino Sans
- エフェクト: グロー、ブラー、グラデーション
