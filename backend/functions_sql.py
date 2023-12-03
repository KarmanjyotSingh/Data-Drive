import config
import pymysql
from werkzeug.security import check_password_hash

# create a sql connection, create a cursor object, and execute the query
# two tables are created: Users and SharedFiles


class SQL_Db:
    def __init__(self):
        """
        Initialize sql connection
        """
        try:
            self.conn = pymysql.connect(
                host=config.host,
                user=config.user,
                password=config.password,
                db=config.db,
                charset="utf8mb4",
                cursorclass=pymysql.cursors.DictCursor,
            )
        except Exception as e:
            print("Error in init: ", e)

    def add_user(self, user_id, password, bucket_name):
        """
        add a user to the database
        :param user_id: user id : str
        :param password: password : str
        :param bucket_name: bucket name : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = (
                    "INSERT INTO Users (user_id, pass, bucket_name) VALUES (%s, %s, %s)"
                )
                cursor.execute(sql, (user_id, password, bucket_name))
                self.conn.commit()
                return 1
        except Exception as e:
            print("Error in add_user: ", e)
            return 0

    def get_users(self):
        """
        get all users from the database
        :return: users : list
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT user_id FROM Users"
                cursor.execute(sql)
                result = cursor.fetchall()
                return result
        except Exception as e:
            print("Error in get_users: ", e)
            return None

    def verify_user(self, user_id, password):
        """
        check if a user exists in the database
        :param user_id: user id : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT * FROM Users WHERE user_id = %s"
                cursor.execute(sql, (user_id))
                result = cursor.fetchone()
                if check_password_hash(result["pass"], password):
                    return 1
                else:
                    return 0

        except Exception as e:
            print("Error in check_user: ", e)
            return 0

    def check_user(self, user_id):
        """
        check if a user exists in the database
        :param user_id: user id : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT * FROM Users WHERE user_id = %s"
                cursor.execute(sql, user_id)
                result = cursor.fetchone()
                if result:
                    return 1
                else:
                    return 0
        except Exception as e:
            print("Error in check_user: ", e)
            return 0

    def remove_shared_file(self, user_id, file_name):
        """
        remove a shared file from the database
        :param user_id: user id : str
        :param file_name: file name : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "DELETE FROM SharedFiles WHERE reciever_id = %s AND file_name = %s"
                cursor.execute(sql, (user_id, file_name))
                self.conn.commit()
                return 1
        except Exception as e:
            print("Error in remove_shared_file: ", e)
            return 0
    def add_shared_file(
        self, sender_id, reciever_id, file_name, bucket_name, perms="r"
    ):
        """
        add a shared file to the database
        :param sender_id: sender id : str
        :param reciever_id: reciever id : str
        :param file_name: file name : str
        :param bucket_name: bucket name : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "INSERT INTO SharedFiles (sender_id, reciever_id, file_name, bucket_name, perms) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(
                    sql, (sender_id, reciever_id,
                          file_name, bucket_name, perms)
                )
                self.conn.commit()
                return 1
        except Exception as e:
            print("Error in add_shared_file: ", e)
            return 0

    def delete_file(self, user_id, file_name):
        """
        delete a file from the database
        :param user_id: user id : str
        :param file_name: file name : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "DELETE FROM SharedFiles WHERE sender_id = %s AND file_name = %s"
                cursor.execute(sql, (user_id, file_name))
                self.conn.commit()
                return 1
        except Exception as e:
            print("Error in delete_file: ", e)
            return 0

    def delete_shared_file(self, sender_id, reciever_id, file_name):
        """
        delete a shared file from the database
        :param sender_id: sender id : str
        :param reciever_id: reciever id : str
        :param file_name: file name : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "DELETE FROM SharedFiles WHERE sender_id = %s AND reciever_id = %s AND file_name = %s"
                cursor.execute(sql, (sender_id, reciever_id, file_name))
                self.conn.commit()
                return 1
        except Exception as e:
            print("Error in delete_shared_file: ", e)
            return 0

    def get_shared_files(self, user_id):
        """
        get all shared files of a user from the database
        :param user_id: user id : str
        :return: shared files : list
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT * FROM SharedFiles WHERE reciever_id = %s"
                cursor.execute(sql, (user_id))
                result = cursor.fetchall()
                return result
        except Exception as e:
            print("Error in get_shared_files: ", e)
            return None

    def get_shared_by_self_files(self, user_id):
        """
        get all shared files of a user from the database
        :param user_id: user id : str
        :return: shared files : list
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT * FROM SharedFiles WHERE sender_id = %s"
                cursor.execute(sql, (user_id))
                result = cursor.fetchall()
                return result
        except Exception as e:
            print("Error in get_shared_files: ", e)
            return None

    def add_public_file(self, user_id, file_name, bucket_name):
        """
        add a public file to the database
        :param user_id: user id : str
        :param file_name: file name : str
        :param bucket_name: bucket name : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "INSERT INTO PublicFiles (user_id, file_name, bucket_name) VALUES (%s, %s, %s)"
                cursor.execute(sql, (user_id, file_name, bucket_name))
                self.conn.commit()
                return 1
        except Exception as e:
            print("Error in add_public_file: ", e)
            return 0

    def get_public_files(self, user_id):
        """
        get all public files of a user from the database
        :param user_id: user id : str
        :return: public files : list
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT * FROM PublicFiles WHERE user_id = %s"
                cursor.execute(sql, (user_id))
                result = cursor.fetchall()
                return result
        except Exception as e:
            print("Error in get_public_files: ", e)
            return None
        
    def is_public(self,user_id,bucket_name,file_name):
        """
        check if a file is public
        :param user_id: user id : str
        :param bucket_name: bucket name : str
        :param file_name: file name : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT * FROM PublicFiles WHERE user_id = %s AND bucket_name = %s AND file_name = %s"
                cursor.execute(sql, (user_id,file_name,bucket_name))
                result = cursor.fetchone()
                if result:
                    return 1
                else:
                    return 0
        except Exception as e:
            print("Error in is_public: ", e)
            return 0

    def get_shared_file_data(self, user_id, file_name, bucket_name):
        """
        get all shared files of a user from the database
        :param user_id: user id : str
        :param file_name: file name : str
        :param bucket_name: bucket name : str
        :return: shared files : list
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT reciever_id,perms FROM SharedFiles WHERE sender_id = %s AND file_name = %s AND bucket_name = %s"
                cursor.execute(sql, (user_id, file_name, bucket_name))
                result = cursor.fetchall()
                return result
        except Exception as e:
            print("Error in get_shared_file_data: ", e)
            return None
    def remove_public_file(self, user_id, file_name, bucket_name):
        """
        remove a public file from the database
        :param user_id: user id : str
        :param file_name: file name : str
        :param bucket_name: bucket name : str
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "DELETE FROM PublicFiles WHERE user_id = %s AND file_name = %s AND bucket_name = %s"
                cursor.execute(sql, (user_id, file_name, bucket_name))
                self.conn.commit()
                return 1
        except Exception as e:
            print("Error in remove_public_file: ", e)
            return 0

    def update_storage(self, user_id, type, size):
        """
        update storage of a user in the database
        :param user_id: user id : str
        :param type: type of operation : str
        :param size: size of the file : int
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                if type == "add":
                    sql = "UPDATE Users SET storage_used = storage_used + %s WHERE user_id = %s"
                else:
                    sql = "UPDATE Users SET storage_used = storage_used - %s WHERE user_id = %s"
                cursor.execute(sql, (size, user_id))
                self.conn.commit()
                return 1
        except Exception as e:
            print("Error in update_storage: ", e)
            return 0

    def get_storage(self, user_id):
        """
        get storage of a user from the database
        :param user_id: user id : str
        :return: storage of the user : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT storage_used FROM Users WHERE user_id = %s"
                cursor.execute(sql, (user_id))
                result = cursor.fetchone()
                return result["storage_used"]
        except Exception as e:
            print("Error in get_storage: ", e)
            return 0

    def get_storage_limit(self, user_id):
        """
        get storage of a user from the database
        :param user_id: user id : str
        :return: storage of the user : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT storage_limit FROM Users WHERE user_id = %s"
                cursor.execute(sql, (user_id))
                result = cursor.fetchone()
                return result["storage_limit"]
        except Exception as e:
            print("Error in get_storage: ", e)
            return 0

    def get_users_table(self):
        """
        get all users from the database
        :return: users : list
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT user_id, storage_used, storage_limit, bucket_name FROM Users"
                cursor.execute(sql)
                result = cursor.fetchall()
                return result
        except Exception as e:
            print("Error in get_users_table: ", e)
            return None

    def change_limit(self, user_id, limit):
        """
        change the storage_limit of the user to new value that is >= storage_used
        :param user_id: user id : str
        :param limit: new limit : int
        :return: status of the operation : int
        """
        try:
            with self.conn.cursor() as cursor:
                sql = "SELECT storage_used FROM Users WHERE user_id = %s"
                cursor.execute(sql, (user_id))
                result = cursor.fetchone()
                if result["storage_used"] > limit:
                    return 0
                else:
                    sql = "UPDATE Users SET storage_limit = %s WHERE user_id = %s"
                    cursor.execute(sql, (limit, user_id))
                    self.conn.commit()
                    return 1
        except Exception as e:
            print("Error in change_limit: ", e)
            return 0
