import mysql.connector

# Підключення до бази даних
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="Linkly",
    port="8889"
)

cur = db.cursor()

# Створення таблиці
cur.execute("""
    CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );
""")

# Додавання записів до таблиці
cur.execute("""
    INSERT INTO items (name, email, password)
    VALUES ('Іван Петренко', 'ivan@example.com', 'password123'),
           ('Марія Коваль', 'maria@example.com', 'password456'),
           ('Олександр Сидоренко', 'olex@example.com', 'password789');
""")

# Збереження змін
db.commit()
cur.close()
db.close()
