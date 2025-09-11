// GitHub Issues APIを使った記事管理サービス

class GitHubArticleService {
  constructor() {
    // GitHub設定
    this.owner = 'ICHIJO-999'; // GitHubユーザー名
    this.repo = 'love'; // リポジトリ名
    this.baseUrl = 'https://api.github.com';
    
    // Personal Access Tokenは環境変数または設定から取得
    // 本番環境では環境変数を使用することを推奨
    this.token = this.getGitHubToken();
  }

  // GitHub Tokenの取得（開発用）
  getGitHubToken() {
    // 開発環境では localStorage から取得
    // 本番環境では環境変数から取得
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      return savedToken;
    }
    
    // トークンが設定されていない場合の処理
    console.warn('GitHub Personal Access Token が設定されていません');
    return null;
  }

  // GitHub Tokenの設定
  setGitHubToken(token) {
    localStorage.setItem('github_token', token);
    this.token = token;
  }

  // APIリクエストのヘッダー
  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // 記事を新規作成（GitHub Issue作成）
  async createArticle(articleData) {
    try {
      const { title, content, course, status, tags = [] } = articleData;
      
      // ラベルの準備（コース + ステータス + タグ）
      const labels = [
        `course:${course}`,
        `status:${status}`,
        ...tags.map(tag => `tag:${tag}`)
      ];

      const issueData = {
        title: title,
        body: this.formatArticleBody(content, articleData),
        labels: labels
      };

      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(issueData)
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      const issue = await response.json();
      
      // 作成成功をLocalStorageからクリア
      this.clearDraft(articleData.articleId);
      
      return {
        success: true,
        articleId: issue.number,
        issueUrl: issue.html_url,
        issue: issue
      };

    } catch (error) {
      console.error('記事作成エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 記事を更新（GitHub Issue更新）
  async updateArticle(issueNumber, articleData) {
    try {
      const { title, content, course, status, tags = [] } = articleData;
      
      // ラベルの準備
      const labels = [
        `course:${course}`,
        `status:${status}`,
        ...tags.map(tag => `tag:${tag}`)
      ];

      const issueData = {
        title: title,
        body: this.formatArticleBody(content, articleData),
        labels: labels,
        state: status === 'published' ? 'open' : 'closed'
      };

      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(issueData)
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      const issue = await response.json();
      
      return {
        success: true,
        issue: issue
      };

    } catch (error) {
      console.error('記事更新エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 記事一覧を取得（GitHub Issues一覧取得）
  async getArticles(options = {}) {
    try {
      const { course, status, page = 1, per_page = 30 } = options;
      
      // クエリパラメータの構築
      const params = new URLSearchParams({
        state: 'all', // open と closed の両方を取得
        sort: 'created',
        direction: 'desc',
        page: page.toString(),
        per_page: per_page.toString()
      });

      // ラベルフィルタリング
      const labels = [];
      if (course) labels.push(`course:${course}`);
      if (status) labels.push(`status:${status}`);
      if (labels.length > 0) {
        params.append('labels', labels.join(','));
      }

      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues?${params}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      const issues = await response.json();
      
      // Issuesを記事形式に変換
      const articles = issues.map(issue => this.parseIssueToArticle(issue));
      
      return {
        success: true,
        articles: articles,
        total: issues.length
      };

    } catch (error) {
      console.error('記事一覧取得エラー:', error);
      return {
        success: false,
        error: error.message,
        articles: []
      };
    }
  }

  // 特定の記事を取得（GitHub Issue取得）
  async getArticle(issueNumber) {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues/${issueNumber}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      const issue = await response.json();
      const article = this.parseIssueToArticle(issue);
      
      return {
        success: true,
        article: article
      };

    } catch (error) {
      console.error('記事取得エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 記事を削除（GitHub Issue削除は不可のため、クローズ）
  async deleteArticle(issueNumber) {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          state: 'closed',
          labels: ['deleted']
        })
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      return {
        success: true,
        message: '記事を削除しました（クローズ）'
      };

    } catch (error) {
      console.error('記事削除エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Issue本文のフォーマット
  formatArticleBody(content, metadata) {
    const frontMatter = `---
作成日: ${new Date().toISOString()}
コース: ${metadata.course || 'コース1'}
ステータス: ${metadata.status || 'draft'}
---

`;
    return frontMatter + content;
  }

  // IssueからArticleオブジェクトに変換
  parseIssueToArticle(issue) {
    // ラベルからメタデータを抽出
    const labels = issue.labels || [];
    const course = this.extractLabelValue(labels, 'course') || 'コース1';
    const status = this.extractLabelValue(labels, 'status') || 'draft';
    const tags = labels
      .filter(label => label.name.startsWith('tag:'))
      .map(label => label.name.replace('tag:', ''));

    // 本文からメタデータとコンテンツを分離
    const body = issue.body || '';
    const content = this.extractContentFromBody(body);

    return {
      id: issue.number,
      title: issue.title,
      content: content,
      course: course,
      status: status,
      tags: tags,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      url: issue.html_url,
      state: issue.state,
      author: issue.user?.login || 'unknown'
    };
  }

  // ラベルから値を抽出
  extractLabelValue(labels, prefix) {
    const label = labels.find(l => l.name.startsWith(`${prefix}:`));
    return label ? label.name.replace(`${prefix}:`, '') : null;
  }

  // Issue本文からコンテンツを抽出（フロントマターを除去）
  extractContentFromBody(body) {
    // フロントマター（---で囲まれた部分）を除去
    const frontMatterRegex = /^---\s*\n.*?\n---\s*\n/s;
    return body.replace(frontMatterRegex, '').trim();
  }

  // 下書きをクリア
  clearDraft(articleId) {
    if (articleId) {
      localStorage.removeItem(`article_draft_${articleId}`);
    }
  }

  // GitHub認証状態をチェック
  async checkAuth() {
    if (!this.token) {
      return { authenticated: false, message: 'トークンが設定されていません' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: this.getHeaders()
      });

      if (response.ok) {
        const user = await response.json();
        return { 
          authenticated: true, 
          user: user.login,
          message: `${user.login} として認証済み`
        };
      } else {
        return { 
          authenticated: false, 
          message: 'トークンが無効です'
        };
      }
    } catch (error) {
      return { 
        authenticated: false, 
        message: `認証エラー: ${error.message}`
      };
    }
  }

  // 利用可能なコース一覧を取得
  async getCourses() {
    try {
      const result = await this.getArticles();
      if (result.success) {
        const courses = [...new Set(result.articles.map(article => article.course))];
        return courses.sort();
      }
      return ['コース1 - 基礎編', 'コース2 - 応用編', 'コース3 - 上級編'];
    } catch (error) {
      return ['コース1 - 基礎編', 'コース2 - 応用編', 'コース3 - 上級編'];
    }
  }
}

// シングルトンインスタンス
const githubArticleService = new GitHubArticleService();

export default githubArticleService;
export { githubArticleService as githubApi };
