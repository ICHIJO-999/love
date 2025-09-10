from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from src.models.user import User, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'ユーザー名、メールアドレス、パスワードは必須です'}), 400
        
        # 既存ユーザーチェック
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'このユーザー名は既に使用されています'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'このメールアドレスは既に使用されています'}), 400
        
        # 新規ユーザー作成
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'ユーザー登録が完了しました',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'ユーザー名とパスワードは必須です'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            login_user(user)
            return jsonify({
                'message': 'ログインしました',
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({'error': 'ユーザー名またはパスワードが間違っています'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    try:
        logout_user()
        return jsonify({'message': 'ログアウトしました'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    try:
        return jsonify({
            'user': current_user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/check', methods=['GET'])
def check_auth():
    try:
        if current_user.is_authenticated:
            return jsonify({
                'authenticated': True,
                'user': current_user.to_dict()
            }), 200
        else:
            return jsonify({
                'authenticated': False
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

