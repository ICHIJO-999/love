from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
import os
from src.models.user import db
from src.models.content import Article, Video, UserProgress

content_bp = Blueprint('content', __name__)

# 記事関連のエンドポイント
@content_bp.route('/articles', methods=['GET'])
@login_required
def get_articles():
    try:
        articles = Article.query.filter_by(is_published=True).order_by(Article.created_at.desc()).all()
        return jsonify({
            'articles': [article.to_dict() for article in articles]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/articles/<int:article_id>', methods=['GET'])
@login_required
def get_article(article_id):
    try:
        article = Article.query.filter_by(id=article_id, is_published=True).first()
        if not article:
            return jsonify({'error': '記事が見つかりません'}), 404
        
        # 進捗を記録
        progress = UserProgress.query.filter_by(
            user_id=current_user.id,
            content_type='article',
            content_id=article_id
        ).first()
        
        if not progress:
            progress = UserProgress(
                user_id=current_user.id,
                content_type='article',
                content_id=article_id,
                progress=1.0,
                completed=True
            )
            db.session.add(progress)
            db.session.commit()
        
        return jsonify({
            'article': article.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 動画関連のエンドポイント
@content_bp.route('/videos', methods=['GET'])
@login_required
def get_videos():
    try:
        videos = Video.query.filter_by(is_published=True).order_by(Video.created_at.desc()).all()
        return jsonify({
            'videos': [video.to_dict() for video in videos]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/videos/<int:video_id>', methods=['GET'])
@login_required
def get_video(video_id):
    try:
        video = Video.query.filter_by(id=video_id, is_published=True).first()
        if not video:
            return jsonify({'error': '動画が見つかりません'}), 404
        
        return jsonify({
            'video': video.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/videos/<int:video_id>/progress', methods=['POST'])
@login_required
def update_video_progress(video_id):
    try:
        data = request.get_json()
        progress_value = data.get('progress', 0.0)
        
        video = Video.query.filter_by(id=video_id, is_published=True).first()
        if not video:
            return jsonify({'error': '動画が見つかりません'}), 404
        
        progress = UserProgress.query.filter_by(
            user_id=current_user.id,
            content_type='video',
            content_id=video_id
        ).first()
        
        if not progress:
            progress = UserProgress(
                user_id=current_user.id,
                content_type='video',
                content_id=video_id
            )
            db.session.add(progress)
        
        progress.progress = progress_value
        progress.completed = progress_value >= 0.9  # 90%以上で完了とする
        db.session.commit()
        
        return jsonify({
            'message': '進捗を更新しました',
            'progress': progress.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 管理者用エンドポイント
@content_bp.route('/admin/articles', methods=['POST'])
@login_required
def create_article():
    try:
        if not current_user.is_admin:
            return jsonify({'error': '管理者権限が必要です'}), 403
        
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('content'):
            return jsonify({'error': 'タイトルと内容は必須です'}), 400
        
        article = Article(
            title=data['title'],
            content=data['content'],
            category=data.get('category', ''),
            tags=','.join(data.get('tags', [])) if data.get('tags') else '',
            is_published=data.get('is_published', False)
        )
        
        db.session.add(article)
        db.session.commit()
        
        return jsonify({
            'message': '記事を作成しました',
            'article': article.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@content_bp.route('/admin/articles/<int:article_id>', methods=['PUT'])
@login_required
def update_article(article_id):
    try:
        if not current_user.is_admin:
            return jsonify({'error': '管理者権限が必要です'}), 403
        
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'error': '記事が見つかりません'}), 404
        
        data = request.get_json()
        
        if data.get('title'):
            article.title = data['title']
        if data.get('content'):
            article.content = data['content']
        if data.get('category') is not None:
            article.category = data['category']
        if data.get('tags') is not None:
            article.tags = ','.join(data['tags']) if data['tags'] else ''
        if data.get('is_published') is not None:
            article.is_published = data['is_published']
        
        db.session.commit()
        
        return jsonify({
            'message': '記事を更新しました',
            'article': article.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@content_bp.route('/admin/articles/<int:article_id>', methods=['DELETE'])
@login_required
def delete_article(article_id):
    try:
        if not current_user.is_admin:
            return jsonify({'error': '管理者権限が必要です'}), 403
        
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'error': '記事が見つかりません'}), 404
        
        db.session.delete(article)
        db.session.commit()
        
        return jsonify({'message': '記事を削除しました'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ユーザーの進捗取得
@content_bp.route('/progress', methods=['GET'])
@login_required
def get_user_progress():
    try:
        progress_list = UserProgress.query.filter_by(user_id=current_user.id).all()
        return jsonify({
            'progress': [p.to_dict() for p in progress_list]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

