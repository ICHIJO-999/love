# 🚀 クイックスタートガイド

このガイドでは、最短でGitHubにプロジェクトを公開する手順を説明します。

## 📋 事前準備

1. [GitHub](https://github.com/)でアカウントを作成（無料）
2. プロジェクトファイルをダウンロード

## ⚡ 5分で公開する手順

### ステップ1: GitHubでリポジトリ作成（1分）

1. GitHubにログイン
2. 右上の「+」→「New repository」
3. 名前を入力（例：`love-consulting-site`）
4. 「Create repository」をクリック

### ステップ2: ファイルをアップロード（3分）

**方法A: ブラウザから直接アップロード（簡単）**

1. 作成したリポジトリページで「uploading an existing file」をクリック
2. プロジェクトフォルダ内のすべてのファイルをドラッグ&ドロップ
3. 下部の「Commit changes」をクリック

**方法B: コマンドライン（上級者向け）**

```bash
# プロジェクトフォルダに移動
cd love-consulting-site

# Git初期化（まだの場合）
git init

# ファイルを追加
git add .

# コミット
git commit -m "初回コミット"

# リモートリポジトリを追加
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git

# プッシュ
git push -u origin main
```

### ステップ3: 確認（1分）

1. GitHubのリポジトリページを更新
2. ファイルがアップロードされていることを確認
3. 完了！

## 🌐 ウェブサイトとして公開する場合

### GitHub Pagesを使用（無料）

1. リポジトリの「Settings」タブ
2. 左メニューの「Pages」
3. 「Source」で「Deploy from a branch」を選択
4. ブランチを「main」に設定
5. 「Save」をクリック
6. 数分後にURLが表示されます

## 🔧 ローカルで開発を続ける場合

### 必要なソフトウェア

- [Node.js](https://nodejs.org/) (v18以上)
- [Python](https://python.org/) (v3.11以上)
- [Git](https://git-scm.com/)

### セットアップ手順

```bash
# プロジェクトをクローン
git clone https://github.com/あなたのユーザー名/love-consulting-site.git
cd love-consulting-site

# バックエンドのセットアップ
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# フロントエンドのセットアップ
cd ../frontend
npm install

# 開発サーバー起動
# ターミナル1: バックエンド
cd backend
source venv/bin/activate
python src/main.py

# ターミナル2: フロントエンド
cd frontend
npm run dev
```

## 📞 サポート

問題が発生した場合：

1. [GitHub Issues](https://github.com/あなたのユーザー名/love-consulting-site/issues)で質問
2. README.mdファイルを確認
3. GitHubの[ヘルプドキュメント](https://docs.github.com/)を参照

## 🎉 次のステップ

- プロジェクトの説明をREADME.mdに追加
- 機能追加や改善を行う
- 他の開発者と共同作業する
- 本格的なホスティングサービスにデプロイ

おめでとうございます！あなたのプロジェクトがGitHubで公開されました。

