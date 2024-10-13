import mysql.connector
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    port="8889"
)

cur = db.cursor()
cur.execute("CREATE DATABASE IF NOT EXISTS Linkly;")
cur.execute("USE Linkly;")
cur.execute("""
    CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(50),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        date DATE
    );
""")
cur.execute("""
    CREATE TABLE IF NOT EXISTS item (
        id INT AUTO_INCREMENT PRIMARY KEY,
        last_name VARCHAR(40) DEFAULT 'Undefined',
        first_name VARCHAR(40) DEFAULT 'Undefined',
        status ENUM('newcomer', 'ancient', 'experienced') DEFAULT 'newcomer' NOT NULL,
        location VARCHAR(45) NOT NULL,
        info TEXT DEFAULT NULL,
        links TEXT DEFAULT NULL,
        other_table_id INT DEFAULT NULL,
        CONSTRAINT fk_other_table_id FOREIGN KEY (other_table_id) REFERENCES Users(id) ON DELETE SET NULL
    );
""")
db.commit()
cur.close()
db.close()
