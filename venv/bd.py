import mysql.connector
from datetime import date
import re
import bcrypt

def add_user(name, email, password, ip_address):
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return {"success": False, "message": "Invalid email format"}
    if len(password) < 8:
        return {"success": False, "message": "Пароль має містити щонайменше 8 символів"}
    if not re.search(r"[A-Z]", password):
        return {"success": False, "message": "Password does not meet complexity requirements"}
    if not re.search(r"[a-z]", password):
        return {"success": False, "message": "Password does not meet complexity requirements"}
    if not re.search(r"[0-9]", password):
        return {"success": False, "message": "Password does not meet complexity requirements"}

    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="Linkly",
            port="8889"
        )
        cur = db.cursor()

        cur.execute("SELECT user_name FROM Users WHERE user_name = %s", (name,))
        if cur.fetchone():
            return {"success": False, "message": "Username already exists"}
        cur.execute("SELECT email FROM Users WHERE email = %s", (email,))
        if cur.fetchone():
            return {"success": False, "message": "Email already exists"}

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        today = date.today()

        cur.execute("INSERT INTO Users (user_name, email, password, date) VALUES (%s, %s, %s, %s)",(name, email, hashed_password.decode('utf-8'), today))
        user_id = cur.lastrowid
        cur.execute("INSERT INTO info (location, other_table_id) VALUES (%s, %s)",(ip_address, user_id))

        db.commit()
        return {"success": True, "message": "Користувач успішно зареєстрований!",'user_id': user_id}
    except mysql.connector.Error as err:
        return {"success": False, "message": f"Database error: {err}"}
    finally:
        cur.close()
        db.close()


def auth_user(email, password, ip_address):
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="Linkly",
            port="8889"
        )
        cur = db.cursor()
        cur.execute("SELECT id, password FROM Users WHERE email = %s", (email,))
        result = cur.fetchone()

        if result:
            user_id, stored_password = result
            stored_password = stored_password.encode('utf-8')

            if bcrypt.checkpw(password.encode('utf-8'), stored_password):
                today = date.today()

                cur.execute("UPDATE Users SET date = %s WHERE email = %s", (today, email))
                cur.execute("UPDATE info SET location = %s WHERE other_table_id = %s", (ip_address, user_id))

                db.commit()
                return {"success": True, "message": "Користувача успішно автентифіковано!",'user_id': user_id}
            else:
                return {"success": False, "message": "Invalid email or password"}
        else:
            return {"success": False, "message": "Invalid email or password"}
    except mysql.connector.Error as err:
        return {"success": False, "message": f"Database error: {err}"}
    finally:
        cur.close()
        db.close()


def edit_user(email, first_name, last_name, username, password, info):
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return {"success": False, "message": "Invalid email format"}

    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="Linkly",
            port="8889"
        )
        cur = db.cursor()

        cur.execute("SELECT id FROM Users WHERE email = %s", (email,))
        result = cur.fetchone()

        if not result:
            return {"success": False, "message": "Невірний email"}

        user_id = result[0]
        cur.execute("SELECT user_name FROM Users WHERE user_name = %s AND id != %s", (username, user_id))
        if cur.fetchone():
            return {"success": False, "message": "Username already exists"}

        today = date.today()
        cur.execute("UPDATE Users SET date = %s, user_name = %s, email = %s WHERE id = %s",
                    (today, username, email, user_id))

        if password and len(password) > 0:
            if len(password) < 8:
                return {"success": False, "message": "Password does not meet complexity requirements"}
            if not re.search(r"[A-Z]", password):
                return {"success": False, "message": "Password does not meet complexity requirements"}
            if not re.search(r"[a-z]", password):
                return {"success": False, "message": "Password does not meet complexity requirements"}
            if not re.search(r"[0-9]", password):
                return {"success": False, "message": "Password does not meet complexity requirements"}

            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            cur.execute("UPDATE Users SET password = %s WHERE id = %s", (hashed_password.decode('utf-8'), user_id))

        cur.execute("UPDATE info SET first_name = %s WHERE other_table_id = %s", (first_name, user_id))
        cur.execute("UPDATE info SET last_name = %s WHERE other_table_id = %s", (last_name, user_id))
        cur.execute("UPDATE info SET info = %s WHERE other_table_id = %s", (info, user_id))

        db.commit()
        return {"success": True, "message": "Користувача успішно оновлено!"}
    except mysql.connector.Error as err:
        return {"success": False, "message": f"Database error: {err}"}
    finally:
        cur.close()
        db.close()

def fetch_user_data(user_id):
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="Linkly",
            port="8889"
        )
        cur = db.cursor()
        cur.execute("SELECT id FROM Users WHERE id = %s", (user_id,))
        result = cur.fetchone()

        if not result:
            return {"success": False, "message": "Невірний ID користувача"}

        today = date.today()
        cur.execute("UPDATE Users SET date = %s WHERE id = %s", (today, user_id))

        cur.execute("SELECT user_name, email FROM Users WHERE id = %s", (user_id,))
        user_data = cur.fetchone()
        if user_data:
            username, email = user_data
        else:
            return {"success": False, "message": "Не вдалося отримати дані користувача"}

        cur.execute("SELECT first_name, last_name, info, status, location FROM info WHERE other_table_id = %s", (user_id,))
        info_data = cur.fetchone()

        if info_data:
            first_name, last_name, info, status, location = info_data
        else:
            first_name = last_name = info = status = location = None
        return {
            "success": True,
            "user_data": {
                "id": user_id,
                "user_name": username,
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "info": info,
                "status": status,
                "location": location,
            }
        }

    except mysql.connector.Error as err:
        return {"success": False, "message": f"Помилка бази даних: {err}"}
    finally:
        cur.close()
        db.close()

def get_link():
    pass

import mysql.connector

def set_link(links, user_id):
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="Linkly",
            port="8889"
        )
        cur = db.cursor()
        cur.execute("UPDATE info SET links = %s WHERE other_table_id = %s", (str(links), user_id))
        db.commit()
        return {"success": True}
    except mysql.connector.Error as err:
        return {"success": False, "message": f"Помилка бази даних: {err}"}
    finally:
        if cur:
            cur.close()
        if db:
            db.close()

def get_link(user_id):
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="Linkly",
            port="8889"
        )
        cur = db.cursor()
        cur.execute("SELECT links FROM info WHERE other_table_id = %s", (user_id,))
        result = cur.fetchone()

        if result:
            return {"success": True, "links": result[0]}
        else:
            return {"success": False, "message": "Посилання не знайдено для цього користувача"}
    except mysql.connector.Error as err:
        return {"success": False, "message": f"Помилка бази даних: {err}"}
    finally:
        if cur:
            cur.close()
        if db:
            db.close()

def delete_link(link, user_id):
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="Linkly",
            port="8889"
        )
        cur = db.cursor()
        cur.execute("SELECT links FROM info WHERE other_table_id = %s", (user_id,))
        result = cur.fetchone()

        if result:
            links = result[0].replace("[", "").replace("]", "").replace("'", "").split(", ")
            if link in links:
                links.remove(link)
                updated_links = ", ".join(links)
                cur.execute("UPDATE info SET links = %s WHERE other_table_id = %s", (updated_links, user_id))
                db.commit()
                return {"success": True}
            else:
                return {"success": False, "message": "Посилання не знайдено"}
        else:
            return {"success": False, "message": "Посилання не знайдено для цього користувача"}
    except mysql.connector.Error as err:
        return {"success": False, "message": f"Помилка бази даних: {err}"}
    finally:
        if cur:
            cur.close()
        if db:
            db.close()

