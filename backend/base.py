from flask import Flask, jsonify, request
from functions import Minio_Db

api = Flask(__name__)


# Login if email = admin and password = admin
@api.route("/login", methods=["POST"])
def login(request):
    email = request.json.get("email")
    password = request.json.get("password")
    if email == "admin" and password == "admin":
        return jsonify({"status": "1"}), 200
    else:
        return jsonify({"status": "0"}), 401


# Logout
@api.route("/logout", methods=["POST"])
def logout(request):
    return jsonify({"status": 1})
