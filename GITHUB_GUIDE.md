# GitHubでプロジェクトを公開する手順

このガイドでは、恋愛コンサル会員サイトのプロジェクトをGitHubで公開する手順を詳しく説明します。

## 前提条件

- GitHubアカウントを持っていること
- プロジェクトファイルがローカルに保存されていること

## 手順1: GitHubアカウントの準備

1. [GitHub](https://github.com/)にアクセス
2. アカウントをお持ちでない場合は「Sign up」をクリックして新規登録
3. 既にアカウントをお持ちの場合は「Sign in」でログイン

## 手順2: 新しいリポジトリの作成

1. GitHubにログイン後、右上の「+」ボタンをクリック
2. 「New repository」を選択
3. リポジトリの設定を行う：
   - **Repository name**: `love-consulting-site`（または任意の名前）
   - **Description**: `恋愛コンサル向け会員制サイト`
   - **Public/Private**: お好みに応じて選択
   - **Initialize this repository with**: チェックを入れない（既存プロジェクトをアップロードするため）
4. 「Create repository」をクリック

## 手順3: ローカルでのGit設定

ターミナル（コマンドプロンプト）を開いて、以下のコマンドを実行します：

```bash
# プロジェクトディレクトリに移動
cd /path/to/love-consulting-site

# Gitユーザー情報を設定（初回のみ）
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"

# 既存のGitリポジトリを確認
git status
```

## 手順4: リモートリポジトリの追加

GitHubで作成したリポジトリのURLを使用して、リモートリポジトリを追加します：

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/あなたのユーザー名/love-consulting-site.git

# リモートリポジトリの確認
git remote -v
```

## 手順5: ファイルをGitHubにプッシュ

```bash
# 変更をステージング
git add .

# コミット
git commit -m "初回コミット: 恋愛コンサル会員サイトの実装"

# GitHubにプッシュ
git push -u origin main
```

## 手順6: GitHubでの確認

1. GitHubのリポジトリページを更新
2. ファイルがアップロードされていることを確認
3. README.mdファイルが表示されていることを確認

## 手順7: GitHub Pagesでの公開（オプション）

静的サイトとして公開したい場合：

1. リポジトリの「Settings」タブをクリック
2. 左サイドバーの「Pages」をクリック
3. 「Source」で「Deploy from a branch」を選択
4. ブランチを「main」、フォルダを「/ (root)」に設定
5. 「Save」をクリック

## トラブルシューティング

### 認証エラーが発生した場合

GitHubでは2021年8月以降、パスワード認証が廃止されています。以下の方法で認証を行ってください：

#### 方法1: Personal Access Token（推奨）

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. 必要な権限を選択（repo権限は必須）
4. 生成されたトークンをパスワードの代わりに使用

#### 方法2: SSH認証

1. SSH鍵を生成：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. 公開鍵をGitHubに追加：
   - GitHub → Settings → SSH and GPG keys → New SSH key
   - 生成された公開鍵（~/.ssh/id_ed25519.pub）の内容をコピー&ペースト

3. SSH URLを使用：
```bash
git remote set-url origin git@github.com:あなたのユーザー名/love-consulting-site.git
```

### プッシュエラーが発生した場合

```bash
# リモートの変更を取得
git pull origin main

# 競合がある場合は解決後、再度プッシュ
git push origin main
```

## 次のステップ

プロジェクトがGitHubに公開されたら：

1. **README.mdの充実**: プロジェクトの説明、セットアップ手順、使用方法を詳しく記載
2. **Issues機能の活用**: バグ報告や機能要望の管理
3. **Releases機能**: バージョン管理とリリースノートの作成
4. **Collaborators追加**: チーム開発の場合は共同作業者を招待

## 注意事項

- **機密情報の除外**: `.env`ファイルやAPIキーなどの機密情報は`.gitignore`に追加して除外
- **定期的なバックアップ**: 重要な変更は定期的にコミット&プッシュ
- **ブランチ戦略**: 大きな変更は別ブランチで作業してからマージ

これで恋愛コンサル会員サイトのプロジェクトがGitHubで公開され、世界中からアクセス可能になります。

