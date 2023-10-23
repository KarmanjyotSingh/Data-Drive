from flask import Flask, jsonify, request
from functions import Minio_Db
import json

app = Flask(__name__)


# Login (single user)
@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    if email == "redflags" and password == "redflags":
        return jsonify({"status": "1"}), 200
    else:
        return jsonify({"status": "0"}), 401


# Logout
@app.route("/logout", methods=["POST"])
def logout():
    return jsonify({"status": 1})


# Get all objects in bucket
@app.route("/list_objects", methods=["GET"])
def list_objects():
    bucket_name = "bkt1"
    client = Minio_Db()
    objects = []
    for i in client.list_objects(bucket_name):
        objects.append(
            {
                "object_name": i.object_name,
                "size": i.size,
                "last_modified": i.last_modified,
                "content_type": i.content_type,
                "etag": i.etag,
            }
        )
    return jsonify({"objects": objects})


# Insert object into bucket
@app.route("/insert_object", methods=["POST"])
def insert_object():
    bucket_name = "bkt1"
    object_name = request.json.get("object_name")
    client = Minio_Db()
    file_path = request.json.get("file_path")
    return jsonify(
        {"status": client.insert_object(file_path, bucket_name, object_name)}
    )


# Delete object from bucket
@app.route("/delete_object", methods=["POST"])
def delete_object():
    bucket_name = "bkt1"
    object_name = request.json.get("object_name")
    client = Minio_Db()
    return jsonify({"status": client.delete_object(bucket_name, object_name)})


# Get object from bucket (return data to frontend)
# @app.route("/get_object", methods=["GET"])
# def get_object():
#     bucket_name = "bkt1"
#     object_name = request.json.get("object_name")
#     client = Minio_Db()
#     data = client.get_object(bucket_name, object_name)
#     return jsonify({"data": data})


# Get object url from bucket
@app.route("/get_objectURL", methods=["GET"])
def get_objectURL():
    bucket_name = "bkt1"
    object_name = request.json.get("object_name")
    client = Minio_Db()
    url = client.get_objectURL(bucket_name, object_name)
    return jsonify({"url": url})
