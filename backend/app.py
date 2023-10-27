from flask import Flask, jsonify, request
from functions import Minio_Db
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

# Origins = [
#     "http://localhost:3000",  # React
#     "http://127.0.0.1:3000",  # React
# ]

# cors = CORS(
#     app,
#     resources={
#         r"/*": {
#             "Access-Control-Allow-Origin": Origins,
#             "Access-Control-Allow-Credentials": True,
#             "supports_credentials": True,
#         },
#     },
#     supports_credentials=True,
#     expose_headers="*",
# )
# set max content length to 16mb


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
@app.route("/list_objects", methods=["POST"])
def list_objects():
    bucket_name = request.json.get("bucket_name")
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
                "url": client.get_objectURL(bucket_name, i.object_name),
            }
        )
    return jsonify({"objects": objects})


# Insert object into bucket
@app.route("/insert_object", methods=["POST"])
def insert_object():
    # object_name = request.json.get("object_name")
    # client = Minio_Db()
    # file_path = request.json.get("file_path")
    # return jsonify(
    #     {"status": client.insert_object(file_path, bucket_name, object_name)}
    # )
    client = Minio_Db()
    bucket_name = request.json.get("bucket_name")
    object = request.json.get("form_data")
    object = object["object"]
    object.save()
    # object_name = object.name
    # return jsonify({"status": client.insert_object(object, bucket_name, object_name)})
    return jsonify({"hellp": request.json})
    return "hello"


# Delete object from bucket
@app.route("/delete_object", methods=["POST"])
def delete_object():
    bucket_name = request.json.get("bucket_name")
    object_name = request.json.get("object_name")
    client = Minio_Db()
    return jsonify({"status": client.delete_object(bucket_name, object_name)})


# Get object from bucket (return data to frontend)
# @app.route("/get_object", methods=["GET"])
# def get_object():
#     bucket_name = request.json.get("bucket_name")
#     object_name = request.json.get("object_name")
#     client = Minio_Db()
#     data = client.get_object(bucket_name, object_name)
#     return jsonify({"data": data})


# Get object url from bucket
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


if __name__ == "__main__":
    app.run(debug=True)
