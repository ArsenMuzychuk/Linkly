from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
import bd

app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/home')
def home_page():
    return render_template('home.html')

@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/work')
def work():
    return render_template('work.html')

@app.route('/premium')
def pro():
    return render_template('premium.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    ip_address = data.get('ip_address')

    if not name or not email or not password or not ip_address:
        return jsonify({'message': 'Missing fields'}), 400

    response = bd.add_user(name, email, password, ip_address)

    if response["success"]:
        session['user_id'] = response['user_id']
        return jsonify({'message': response["message"]}), 200
    else:
        return jsonify({'message': response["message"]}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    ip_address = data.get('ip_address')

    if not email or not password or not ip_address:
        return jsonify({'message': 'Missing fields'}), 400

    response = bd.auth_user(email, password, ip_address)

    if response["success"]:
        session['user_id'] = response['user_id']
        return jsonify({'message': response["message"]}), 200
    else:
        return jsonify({'message': response["message"]}), 400

@app.route('/api/edit', methods=['POST'])
def edit():
    data = request.get_json()
    email = data.get('email')
    old_password = data.get('old_password')
    ip_address = data.get('ip_address')

    if not email or not old_password or not ip_address:
        return jsonify({'message': 'Missing fields'}), 400

    response = bd.auth_user(email, old_password, ip_address)

    if response["success"]:
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        username = data.get('username')
        new_password = data.get('new_password')
        info = data.get('info')

        response_02 = bd.edit_user(email, first_name, last_name, username, new_password, info)

        if response_02["success"]:
            return jsonify({'message': response_02["message"]}), 200
        else:
            return jsonify({'message': response_02["message"]}), 400
    else:
        return jsonify({'message': response["message"]}), 400

@app.route('/api/user', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if user_id:
        user_data = bd.fetch_user_data(user_id)
        if user_data["success"]:
            return jsonify(user_data), 200
        else:
            return jsonify({'message': user_data["message"]}), 400
    else:
        return jsonify({'message': 'Користувач не знайдений'}), 404

@app.route('/api/links_update', methods=['POST'])
def links_update():
    user_id = session.get('user_id')
    data = request.get_json()
    links = data.get('links')

    if not links:
        return jsonify({'message': 'Дані посилань не були надані'}), 400

    if user_id:
        user_data = bd.set_link(links, user_id)
        if user_data["success"]:
            return jsonify('Okey'), 200
        else:
            return jsonify({'message': user_data["message"]}), 400
    else:
        return jsonify({'message': 'Користувач не знайдений'}), 404

@app.route('/api/links_get', methods=['GET'])
def links_get():
    user_id = session.get('user_id')

    if user_id:
        user_data = bd.get_link(user_id)
        if user_data["success"]:
            return jsonify(user_data["links"]), 200
        else:
            return jsonify({'message': user_data["message"]}), 400
    else:
        return jsonify({'message': 'Користувач не знайдений'}), 404

@app.route('/api/links_delete', methods=['DELETE'])
def links_delete():
    user_id = session.get('user_id')
    data = request.get_json()
    links = data.get('link')

    if user_id:
        user_data = bd.delete_link(links, user_id)
        if user_data["success"]:
            return jsonify('Okey'), 200
        else:
            return jsonify({'message': user_data["message"]}), 400
    else:
        return jsonify({'message': 'Користувач не знайдений'}), 404

if __name__ == '__main__':
    app.run(host='localhost', port=8088, debug=True)
