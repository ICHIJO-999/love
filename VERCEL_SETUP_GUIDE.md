# Vercel設定手順書

## 🎯 目的
恋愛コンサルティングサイトのVercelデプロイメント問題を解決するための設定手順

## 📋 必要な設定変更

### 1. Vercelダッシュボードにアクセス
- プロジェクト「love」を選択
- 「Settings」をクリック

### 2. Build and Deployment設定
左側メニューから「**Build and Deployment**」を選択し、以下を設定：

#### Root Directory
```
frontend
```

#### Build Command
```
npm run build
```

#### Output Directory
```
dist
```

#### Install Command
```
npm install
```

### 3. 設定保存と再デプロイ
1. 「**Save**」ボタンをクリック
2. 「**Deployments**」タブに移動
3. 「**Redeploy**」ボタンをクリック

## 🔧 設定理由

### Root Directory: `frontend`
- Reactアプリケーションが`frontend`ディレクトリに配置されているため
- Vercelがプロジェクトルートではなく、正しいディレクトリでビルドを実行

### Build Command: `npm run build`
- package.jsonで定義されたビルドスクリプトを実行
- Viteによる最適化されたプロダクションビルド

### Output Directory: `dist`
- Viteのデフォルト出力ディレクトリ
- ビルドされた静的ファイルの配置場所

### Install Command: `npm install`
- 依存関係のインストール
- pnpmではなくnpmを使用して互換性を確保

## ✅ 確認事項

### デプロイメント成功の確認
- ビルドログにエラーがないこと
- 「Build Succeeded」メッセージの表示
- デプロイメント完了通知

### サイト動作確認
- `https://love-ten-ashen.vercel.app` にアクセス
- ログインページが正常に表示
- ルーティングが正常に動作

## 🚨 トラブルシューティング

### ビルドが失敗する場合
1. Root Directoryが`frontend`に設定されているか確認
2. Build Commandが`npm run build`になっているか確認
3. package.jsonファイルが`frontend`ディレクトリにあるか確認

### 404エラーが表示される場合
1. Output Directoryが`dist`に設定されているか確認
2. vercel.jsonのrewritesルールが適用されているか確認
3. SPAルーティング設定が正しいか確認

## 📞 サポート

### 技術的な問題
- GitHubリポジトリ: https://github.com/ICHIJO-999/love
- Vercelドキュメント: https://vercel.com/docs

### 設定完了後の確認
設定変更とデプロイが完了したら、以下をテストしてください：
- [ ] トップページの表示
- [ ] ログインページへの遷移
- [ ] レスポンシブデザインの動作
- [ ] ブラウザの戻るボタン動作

---

**最終更新**: 2025年9月10日  
**対象プロジェクト**: love (https://love-ten-ashen.vercel.app)
