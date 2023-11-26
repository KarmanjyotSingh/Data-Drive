from flask import Flask, jsonify, request
from functions import Minio_Db
import json
from flask_cors import CORS, cross_origin
import os
import mysql.connector
from werkzeug.security import generate_password_hash,check_password_hash
import config

app = Flask(__name__)
# add access control headers
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/register", methods=["POST"])
def register():
    # Extract data from request
    try:
        request_data = request.get_json()
        email = request_data["email"]
        password = request_data["password"]
      
        if not email or not password:
            return jsonify({"status": "0", "message": "Invalid data"}), 400
        # Hash the password
        hashed_password = generate_password_hash(password)
        cnx = mysql.connector.connect(**config.sql)
        cursor = cnx.cursor()
        add_user = ("INSERT INTO Users "
                    "(username, password) "
                    "VALUES (%s, %s)")
        data_user = (email, hashed_password)
        cursor.execute(add_user, data_user)
        try:    
            client = Minio_Db()
            client.create_folder(config.base_bucket_name, email)
            cnx.commit()
        except Exception as e:
            cnx.rollback()
        cursor.close()
        cnx.close()
        return jsonify({"status": "1", "message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"status": "0", "message": f"User registration failed {e}"}), 500


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    cnx = mysql.connector.connect(**config.sql)
    cursor = cnx.cursor()
    query = ("SELECT password FROM Users WHERE username = %s")
    cursor.execute(query, (email,))
    row = cursor.fetchone()
    cursor.close()
    cnx.close()
    if row is None:
        return jsonify({"status": "0"}), 401
    # check hashed password
    if check_password_hash(pwhash=row[0],password=password):
        return jsonify({"status": "1"}), 200
    else:
        return jsonify({"status": "0"}), 401

# Logout
@app.route("/logout", methods=["POST"])
def logout():
    return jsonify({"status": 1})


# Get all objects in bucket
@app.route("/list_objects", methods=["POST"])
def list_objects():
    bucket_name = request.json.get("bucket_name")
    folder_name = request.json.get("folder_name")
    # prefix = folder_name
    prefix = request.json.get("prefix")
    client = Minio_Db()
    objects = []
    print("-------------------")
    print("prefix: ", prefix)
    print("-------------------")

    for i in client.list_objects(bucket_name, prefix):
        object_name = i.object_name
        metadata = client.metadata_object(bucket_name, object_name)
        objects.append(
            {
                "object_name": i.object_name,
                "size": i.size,
                "last_modified": i.last_modified,
                "etag": i.etag,
                "metadata": metadata,
                "url": client.get_objectURL(bucket_name, i.object_name),
            }
        )
    print(objects)
    return jsonify({"objects": objects})


# Insert object into bucket
@app.route("/insert_object", methods=["POST"])
def insert_object():
    client = Minio_Db()
    file = request.files["file"]
    filename = file.filename
    bucket_name = request.form.get("bucket_name")
    path = request.form.get("folder_name")
    # object_name = object.name
    return jsonify({"status": client.insert_object(file, bucket_name, path + filename)})
    return jsonify({"status": 1})
    # return "hello"


# Delete object from bucket
@app.route("/delete_object", methods=["POST"])
def delete_object():
    bucket_name = request.json.get("bucket_name")
    object_name = request.json.get("object_name")
    client = Minio_Db()
    return jsonify({"status": client.delete_object(bucket_name, object_name)})


# Get object download url from bucket
@app.route("/get_downloadURL", methods=["POST"])
def get_downloadURL():
    bucket_name = request.json.get("bucket_name")
    object_name = request.json.get("object_name")
    client = Minio_Db()
    url = client.get_downloadURL(bucket_name, object_name)
    return jsonify({"url": url})


# Get object url from bucket for preview
@app.route("/get_objectURL", methods=["POST"])
def get_objectURL():
    bucket_name = request.json.get("bucket_name")
    object_name = request.json.get("object_name")
    client = Minio_Db()
    url = client.get_objectURL(bucket_name, object_name)
    return jsonify({"url": url})


# Create a new bucket for a user
@app.route("/create_bucket", methods=["POST"])
def create_bucket():
    bucket_name = request.json.get("bucket_name")
    client = Minio_Db()
    return jsonify({"status": client.create_bucket(bucket_name)})


# create folder in bucket
@app.route("/create_folder", methods=["POST"])
def create_folder():
    bucket_name = request.json.get("bucket_name")
    folder_name = request.json.get("folder_name")
    client = Minio_Db()
    return jsonify({"status": client.create_folder(bucket_name, folder_name)})


if __name__ == "__main__":
    app.run(debug=True)
