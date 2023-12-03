## Backend

The Backend Architecture involves the following:
1. Flask-Server: the main rest api server
2. MySQL-Database: the database server
3. MiniIO-Server: the object storage server

### Setup

#### database - mysql 

1. install mysql with `sudo apt install mysql-server`
2. start mysql with `sudo systemctl start mysql`
3. create a database with `sudo mysql -u root -p` and then `CREATE DATABASE 'DATA_DRIVE';`
   Note: the database name is DATA_DRIVE, you can change it in the config.py file
4. create a user with `CREATE USER '<user_name>'@'localhost' IDENTIFIED BY '<user_password>';`
   Note: the user_name and user_password is 'redflags', you can change it in the config.py file
5. grant the user access to the database with `GRANT ALL PRIVILEGES ON DATA_DRIVE.* TO '<user_name>'@'localhost';`
6. create tables with using sql dump file with `sudo mysql -u root -p DATA_DRIVE < sql.sql`
   Note: the sql-dump file is in the backend folder

#### backend server - flask

1. Create a virtual environment with `python3 -m venv venv`
2. Activate the virtual environment with `source venv/bin/activate`
3. Install the dependencies with `pip install -r requirements.txt`
4. Run the server with `python3 app.py` or `flask run`

#### setting up minio
1. install minio with `wget https://dl.min.io/server/minio/release/linux-amd64/minio && chmod +x minio`
2. start minio with `./minio server /mnt/data`
3. server starts at `http://localhost:9000` 