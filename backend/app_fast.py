from functions import Minio_Db
from functions_sql import SQL_Db

import uvicorn
from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from fastapi.middleware.cors import CORSMiddleware
from werkzeug.security import generate_password_hash

app = FastAPI()

class User(BaseModel):
    email: str | None = None
    password: str | None = None
    bucket_name: str | None = None

class Schema(BaseModel):
    user_id: str | None = None
    sender_id: str | None = None
    reciever_id: str | None = None
    file_name: str | None = None
    bucket_name: str | None = None
    perms: str | None = None

class Settings(BaseModel):
    authjwt_secret_key: str = "secretqwertyuiopasdfghjklzxcvbnm"

@AuthJWT.load_config
def get_config():
    return Settings()

# Not for production
origins = [
    "http://localhost:3000",
    "http://localhost",
    "localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Login
@app.post("/login")
def login(user: User, Authorize: AuthJWT = Depends()):
    email = user.email
    password = user.password
    sql_client = SQL_Db()
    if sql_client.verify_user(email, password) == 1:
        access_token = Authorize.create_access_token(subject=email, additional_claims={"bucket_name": 'datadrive'}, expires_time=100000)
        return {"status": 1, "access_token": access_token}
    else:
        return {"status": 0}


# Logout
@app.post("/logout")
def logout(Authorize: AuthJWT = Depends()):
    response = {"status": 1}
    Authorize.unset_jwt_cookies(response)
    return response


# Register
@app.post("/register")
def register(user: User):
    try:
        email = user.email
        password = user.password
        bucket_name = user.bucket_name

        if not email or not password:
            raise HTTPException(status_code=400, detail="Invalid data")

        hashed_password = generate_password_hash(password)
        sql_client = SQL_Db()
        if sql_client.check_user(email):
            raise HTTPException(status_code=400, detail="User already exists")

        ret = sql_client.add_user(email, hashed_password, bucket_name=bucket_name)

        if ret == 1:
            return {"status": "1", "message": "User created successfully"}
        else:
            raise HTTPException(status_code=400, detail="User creation failed")

    except Exception as e:
        print("Error in register: ", e)
        raise HTTPException(status_code=500, detail="Internal server error")


# Get all objects in bucket
@app.post("/list_objects")
def list_objects(bucket_name: str, prefix: str):
    client = Minio_Db()
    objects = []
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
    return {"objects": objects}


# Insert object into bucket
@app.post("/insert_object")
def insert_object(files: list, bucket_name: str, folder_name: str):
    client = Minio_Db()
    status = 0
    for file in files:
        status += client.insert_object(file, bucket_name, folder_name+file.filename)

    return {"status": status}


# Delete object from bucket
@app.post("/delete_object")
def delete_object(bucket_name: str, object_names: str):
    client = Minio_Db()
    status = 0
    for object_name in object_names:
        status = client.delete_object(bucket_name, object_name)
    return {"status": status}


# Delete folder from bucket
@app.post("/delete_folder")
def delete_folder(bucket_name: str, folder_name: str):
    client = Minio_Db()
    return {"status": client.delete_folder(bucket_name, folder_name)}


# Get object download url from bucket
@app.post("/get_downloadURL")
def get_downloadURL(bucket_name: str, object_name: str):
    client = Minio_Db()
    url = client.get_downloadURL(bucket_name, object_name)
    return {"url": url}


# Get object url from bucket for preview
@app.post("/get_objectURL")
def get_objectURL(bucket_name: str, object_name: str):
    client = Minio_Db()
    url = client.get_objectURL(bucket_name, object_name)
    return {"url": url}


# Create folder in bucket
@app.post("/create_folder")
def create_folder(bucket_name: str, folder_name: str):
    client = Minio_Db()
    return {"status": client.create_folder(bucket_name, folder_name)}


# Add shared file to database
@app.post("/remove_shared_file")
def remove_shared_file(schema: Schema):
    sender_id = schema.sender_id
    reciever_id = schema.reciever_id
    file_name = schema.file_name
    bucket_name = schema.bucket_name
    sql_client = SQL_Db()
    return {"status": sql_client.remove_shared_file(reciever_id, file_name)}


# Add shared file to database
@app.post("/add_shared_file")
def add_shared_file(schema: Schema):
    sender_id = schema.sender_id
    reciever_id = schema.reciever_id
    file_name = schema.file_name
    bucket_name = schema.bucket_name
    perms = schema.perms
    sql_client = SQL_Db()
    # check if user exists, if does not exist, return 0
    if sql_client.check_user(reciever_id) == 0:
        return {"status": 0}
    return 
    {
        "status": sql_client.add_shared_file(
            sender_id, reciever_id, file_name, bucket_name, perms
        )
    }


# Get shared files from database
@app.post("/get_shared_files")
def get_shared_files(user_id: str):
    sql_client = SQL_Db()
    result1 = sql_client.get_shared_files(user_id)
    result2 = sql_client.get_all_public_files()
    result = [*result1, *result2]
    for file in result:
        file["url"] = Minio_Db().get_objectURL(
            file["bucket_name"], file["file_name"])

    return {"shared_files": result}


# Get shared files from database that the user has shared
@app.post("/get_shared_by_self_files")
def get_shared_by_self_files(user_id: str):
    sql_client = SQL_Db()
    result1 = sql_client.get_shared_by_self_files(user_id)
    result2 = sql_client.get_public_files(user_id)
    result = [*result1, *result2]
    for file in result:
        file["url"] = Minio_Db().get_objectURL(
            file["bucket_name"], file["file_name"])
    return {"shared_files": result}


# Get shared files from database that the user has shared
@app.post("/get_shared_file_data")
def get_shared_file_data(schema: Schema):
    user_id = schema.user_id
    file_name = schema.file_name
    bucket_name = schema.bucket_name
    sql_client = SQL_Db()
    users = sql_client.get_shared_file_data(user_id, file_name, bucket_name)
    isPublic = sql_client.is_public(user_id, file_name, bucket_name)
    return {"users": users, "isPublic": isPublic}


# Get public files from database
@app.post("/get_public_files")
def get_public_files(user_id: str):
    sql_client = SQL_Db()
    result = sql_client.get_public_files(user_id)
    for file in result:
        file["url"] = Minio_Db().get_objectURL(
            file["bucket_name"], file["file_name"])
    return {"shared_files": result}


# Get public files from database
@app.post("/file_is_public")
def file_is_public(schema: Schema):
    user_id = schema.user_id
    file_name = schema.file_name
    bucket_name = schema.bucket_name
    sql_client = SQL_Db()
    return {
        "is_public": sql_client.is_public(user_id, file_name, bucket_name),
        "url": Minio_Db().get_objectURL(bucket_name, file_name),
        "isDir" : Minio_Db().isDir(bucket_name, file_name)
    }


# Add public file to database
@app.post("/add_public_file")
def add_public_file(schema: Schema):
    user_id = schema.user_id
    file_name = schema.file_name
    bucket_name = schema.bucket_name
    sql_client = SQL_Db()
    return {"status": sql_client.add_public_file(user_id, file_name, bucket_name)}


# Remove public file from database
@app.post("/remove_public_file")
def remove_public_file(schema: Schema):
    user_id = schema.user_id
    file_name = schema.file_name
    bucket_name = schema.bucket_name
    sql_client = SQL_Db()
    return {"status": sql_client.remove_public_file(user_id, file_name, bucket_name)}


# Get storage used and storage limit
@app.post("/get_storage")
def get_storage(user_id: str):
    sql_client = SQL_Db()
    used = sql_client.get_storage(user_id)
    limit = sql_client.get_storage_limit(user_id)
    return {"used": used, "limit": limit}


# Update storage limit
@app.post("/update_storage_limit")
def update_storage_limit(user_id: str, storage_limit: int):
    sql_client = SQL_Db()
    return {"status": sql_client.update_storage_limit(user_id, storage_limit)}


# Get all users
@app.get("/get_users")
def get_users():
    sql_client = SQL_Db()
    return {"users": sql_client.get_users_table()}


# FastAPI entry point
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)