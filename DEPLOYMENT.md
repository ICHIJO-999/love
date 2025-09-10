# デプロイメントガイド

## 概要

このドキュメントでは、恋愛コンサル会員サイトをGitHubで公開し、本番環境にデプロイする方法を説明します。

## GitHub公開手順

### 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 「New repository」をクリック
3. リポジトリ名: `love-consulting-site`
4. 説明: `恋愛コンサル向けの会員制サイト - 記事・動画コンテンツ管理システム`
5. 「Public」を選択（または「Private」でも可）
6. 「Create repository」をクリック

### 2. ローカルリポジトリとの連携

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/love-consulting-site.git

# メインブランチに変更（推奨）
git branch -M main

# 初回プッシュ
git push -u origin main
```

### 3. ブランチ戦略

```bash
# 開発ブランチの作成
git checkout -b develop

# 機能ブランチの作成例
git checkout -b feature/user-authentication
git checkout -b feature/video-upload
git checkout -b feature/admin-panel
```

## 本番環境デプロイ

### オプション1: Heroku（推奨）

#### 前提条件
- Herokuアカウント
- Heroku CLI

#### 手順

1. **Herokuアプリの作成**
```bash
heroku create love-consulting-site
```

2. **環境変数の設定**
```bash
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=your-secret-key-here
```

3. **Procfileの作成**
```bash
echo "web: cd backend && python src/main.py" > Procfile
```

4. **requirements.txtの更新**
```bash
cd backend
echo "gunicorn==20.1.0" >> requirements.txt
```

5. **デプロイ**
```bash
git add .
git commit -m "Heroku用設定追加"
git push heroku main
```

### オプション2: Vercel（フロントエンド）+ Railway（バックエンド）

#### フロントエンド（Vercel）

1. [Vercel](https://vercel.com)にログイン
2. GitHubリポジトリを連携
3. Build設定:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `pnpm run build`
   - Output Directory: `dist`

#### バックエンド（Railway）

1. [Railway](https://railway.app)にログイン
2. GitHubリポジトリを連携
3. 環境変数を設定:
   - `FLASK_ENV=production`
   - `SECRET_KEY=your-secret-key`

### オプション3: VPS（Ubuntu）

#### 前提条件
- Ubuntu 20.04+ VPS
- ドメイン名（オプション）

#### 手順

1. **サーバーの準備**
```bash
# パッケージ更新
sudo apt update && sudo apt upgrade -y

# 必要なパッケージのインストール
sudo apt install python3 python3-pip nodejs npm nginx git -y

# pnpmのインストール
npm install -g pnpm
```

2. **アプリケーションのデプロイ**
```bash
# リポジトリのクローン
git clone https://github.com/YOUR_USERNAME/love-consulting-site.git
cd love-consulting-site

# バックエンドのセットアップ
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# フロントエンドのビルド
cd ../frontend
pnpm install
pnpm run build

# ビルドファイルをバックエンドに移動
cp -r dist/* ../backend/src/static/
```

3. **Nginxの設定**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /path/to/love-consulting-site/backend/src/static;
    }
}
```

4. **Systemdサービスの作成**
```ini
[Unit]
Description=Love Consulting Site
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/path/to/love-consulting-site/backend
Environment=PATH=/path/to/love-consulting-site/backend/venv/bin
ExecStart=/path/to/love-consulting-site/backend/venv/bin/python src/main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

## 環境変数設定

### 本番環境で必要な環境変数

```bash
# Flask設定
FLASK_ENV=production
SECRET_KEY=your-very-secure-secret-key

# データベース設定（本番環境ではPostgreSQLを推奨）
DATABASE_URL=postgresql://user:password@host:port/dbname

# ファイルアップロード設定
UPLOAD_FOLDER=/path/to/uploads
MAX_CONTENT_LENGTH=16777216  # 16MB

# メール設定（パスワードリセット等）
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## セキュリティ設定

### 1. HTTPS設定

```bash
# Let's Encryptを使用
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. ファイアウォール設定

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. セキュリティヘッダー

Nginxに以下を追加:
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## モニタリング

### 1. ログ監視

```bash
# アプリケーションログ
tail -f /var/log/love-consulting-site.log

# Nginxログ
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. パフォーマンス監視

- **Uptime監視**: UptimeRobot、Pingdom
- **エラー追跡**: Sentry
- **アナリティクス**: Google Analytics

## バックアップ

### 1. データベースバックアップ

```bash
# SQLiteの場合
cp backend/src/database/app.db backup/app_$(date +%Y%m%d_%H%M%S).db

# PostgreSQLの場合
pg_dump dbname > backup/db_$(date +%Y%m%d_%H%M%S).sql
```

### 2. ファイルバックアップ

```bash
# アップロードファイル
tar -czf backup/uploads_$(date +%Y%m%d_%H%M%S).tar.gz backend/src/static/uploads/
```

## トラブルシューティング

### よくある問題

1. **ポート5000が使用中**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 PID
   ```

2. **パーミッションエラー**
   ```bash
   sudo chown -R ubuntu:ubuntu /path/to/love-consulting-site
   chmod +x backend/src/main.py
   ```

3. **依存関係エラー**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

## 継続的デプロイ（CI/CD）

### GitHub Actionsの設定例

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Setup Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.11'
        
    - name: Install dependencies
      run: |
        cd frontend && npm install
        cd ../backend && pip install -r requirements.txt
        
    - name: Build frontend
      run: cd frontend && npm run build
      
    - name: Deploy to server
      run: |
        # デプロイスクリプトを実行
        ./deploy.sh
```

## まとめ

このガイドに従って、恋愛コンサル会員サイトを安全かつ効率的にデプロイできます。本番環境では必ずHTTPS、適切なセキュリティ設定、定期的なバックアップを実施してください。

