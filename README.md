# 恋愛コンサル会員サイト

恋愛コンサルタント向けの会員制サイトです。コンサル生が記事や動画コンテンツを閲覧できる機能を提供します。

## 🌟 特徴

- **会員制システム**: ユーザー登録・ログイン機能
- **記事管理**: 恋愛に関する記事の投稿・閲覧
- **動画管理**: 動画コンテンツの管理・視聴
- **進捗管理**: ユーザーの学習進捗を追跡
- **レスポンシブデザイン**: PC・スマートフォン対応
- **モダンUI**: オンクラスを参考にしたクリーンなデザイン

## 🛠️ 技術スタック

### バックエンド
- **Flask** (Python) - Webフレームワーク
- **SQLite** - データベース
- **Flask-Login** - 認証管理
- **Flask-CORS** - CORS対応

### フロントエンド
- **React** - UIライブラリ
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UIコンポーネント
- **Lucide React** - アイコン
- **Axios** - HTTP通信

## 📁 プロジェクト構成

```
love-consulting-site/
├── backend/                    # Flaskバックエンド
│   ├── src/
│   │   ├── main.py            # メインアプリケーション
│   │   ├── models/            # データベースモデル
│   │   │   ├── user.py        # ユーザーモデル
│   │   │   └── content.py     # コンテンツモデル
│   │   ├── routes/            # APIルート
│   │   │   ├── auth.py        # 認証API
│   │   │   ├── content.py     # コンテンツAPI
│   │   │   └── user.py        # ユーザーAPI
│   │   ├── static/            # 静的ファイル
│   │   │   └── uploads/       # アップロードファイル
│   │   └── database/          # データベースファイル
│   ├── venv/                  # Python仮想環境
│   └── requirements.txt       # Python依存関係
├── frontend/                   # Reactフロントエンド
│   ├── src/
│   │   ├── components/        # Reactコンポーネント
│   │   │   └── Layout/        # レイアウトコンポーネント
│   │   ├── pages/             # ページコンポーネント
│   │   ├── hooks/             # カスタムフック
│   │   ├── services/          # API通信
│   │   └── App.jsx            # メインアプリ
│   ├── public/                # 公開ファイル
│   └── package.json           # Node.js依存関係
├── requirements.md            # 要件定義書
├── tech_design.md            # 技術設計書
├── test_results.md           # テスト結果
└── README.md                 # このファイル
```

## 🚀 セットアップ

### 前提条件
- Python 3.11+
- Node.js 22+
- pnpm

### バックエンドのセットアップ

1. プロジェクトをクローン
```bash
git clone <repository-url>
cd love-consulting-site/backend
```

2. 仮想環境を作成・有効化
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# または
venv\Scripts\activate     # Windows
```

3. 依存関係をインストール
```bash
pip install -r requirements.txt
```

4. サーバーを起動
```bash
python src/main.py
```

サーバーは `http://localhost:5000` で起動します。

### フロントエンドのセットアップ

1. フロントエンドディレクトリに移動
```bash
cd ../frontend
```

2. 依存関係をインストール
```bash
pnpm install
```

3. 開発サーバーを起動
```bash
pnpm run dev
```

フロントエンドは `http://localhost:5173` で起動します。

## 📊 データベース設計

### users テーブル
- `id`: ユーザーID（主キー）
- `username`: ユーザー名
- `email`: メールアドレス
- `password_hash`: パスワードハッシュ
- `is_admin`: 管理者フラグ
- `created_at`: 作成日時

### articles テーブル
- `id`: 記事ID（主キー）
- `title`: タイトル
- `content`: 内容
- `category`: カテゴリ
- `tags`: タグ
- `is_published`: 公開フラグ
- `created_at`: 作成日時
- `updated_at`: 更新日時

### videos テーブル
- `id`: 動画ID（主キー）
- `title`: タイトル
- `description`: 説明
- `filename`: ファイル名
- `thumbnail`: サムネイル
- `category`: カテゴリ
- `tags`: タグ
- `is_published`: 公開フラグ
- `created_at`: 作成日時
- `updated_at`: 更新日時

### user_progress テーブル
- `id`: 進捗ID（主キー）
- `user_id`: ユーザーID（外部キー）
- `content_type`: コンテンツタイプ（article/video）
- `content_id`: コンテンツID
- `progress`: 進捗率（0.0-1.0）
- `completed`: 完了フラグ
- `last_accessed`: 最終アクセス日時

## 🔧 API エンドポイント

### 認証API
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報
- `GET /api/auth/check` - 認証状態確認

### コンテンツAPI
- `GET /api/articles` - 記事一覧取得
- `GET /api/articles/:id` - 記事詳細取得
- `GET /api/videos` - 動画一覧取得
- `GET /api/videos/:id` - 動画詳細取得
- `POST /api/videos/:id/progress` - 動画進捗更新
- `GET /api/progress` - ユーザー進捗取得

### 管理者API
- `POST /api/admin/articles` - 記事作成
- `PUT /api/admin/articles/:id` - 記事更新
- `DELETE /api/admin/articles/:id` - 記事削除

## 🎨 UI/UX

このサイトは[オンクラス](https://the-online-class.co.jp/)を参考にしたデザインを採用しています：

- **クリーンなデザイン**: 学習に集中できるシンプルなレイアウト
- **直感的な操作**: ユーザーフレンドリーなナビゲーション
- **レスポンシブ対応**: あらゆるデバイスで最適な表示
- **アクセシビリティ**: 使いやすさを重視した設計

## 🧪 テスト

テスト結果は `test_results.md` を参照してください。

### 実行済みテスト
- フロントエンド表示テスト
- ユーザー登録機能テスト
- レスポンシブデザインテスト
- バックエンドAPI基本テスト

## 📝 今後の改善点

- ログイン機能の修正
- 管理者画面の実装
- 動画アップロード機能の実装
- 検索機能の強化
- パフォーマンス最適化
- セキュリティ強化

## 🤝 貢献

プロジェクトへの貢献を歓迎します。以下の手順でお願いします：

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は `LICENSE` ファイルを参照してください。

## 📞 サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。

---

**恋愛コンサル会員サイト** - あなたの恋愛スキル向上をサポートします 💕

