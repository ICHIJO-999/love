export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { title, content, course } = req.body;
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      res.status(500).json({ error: 'GitHub token not configured' });
      return;
    }

    // GitHub Issues APIに記事を保存
    const response = await fetch('https://api.github.com/repos/ICHIJO-999/love/issues', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        title: title,
        body: `**コース**: ${course}
**作成日**: ${new Date().toISOString()}
**エディター**: TIPS Level Editor Enhanced

---

${content}`,
        labels: ['article', `course:${course}`, 'tips-editor']
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GitHub API Error:', response.status, errorData);
      res.status(response.status).json({ 
        error: 'GitHub API error', 
        details: errorData 
      });
      return;
    }

    const data = await response.json();
    res.status(200).json({ 
      success: true, 
      issueNumber: data.number,
      url: data.html_url 
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
