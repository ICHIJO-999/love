import requests

BASE_URL = 'http://localhost:5000/api'

def create_article(title, content, category, tags, is_published):
    data = {
        'title': title,
        'content': content,
        'category': category,
        'tags': tags,
        'is_published': is_published
    }
    response = requests.post(f'{BASE_URL}/admin/articles', json=data)
    print(response.json())

if __name__ == '__main__':
    create_article(
        title='恋愛コンサル入門：第一歩を踏み出すために',
        content='恋愛コンサルティングの基本と、あなたが恋愛で成功するための第一歩について解説します。',
        category='入門',
        tags='恋愛,コンサル,初心者',
        is_published=True
    )

