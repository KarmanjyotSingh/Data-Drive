from minio import Minio
from minio.error import S3Error
import config
import io
import os


class Minio_Db:
    def __init__(self):
        """
        Initialize minioClient with an endpoint and access/secret keys.
        """
        try:
            self.minioClient = Minio(
                config.url,
                access_key=config.access_key,
                secret_key=config.secret_key,
                secure=config.secure,
            )
        except S3Error as ex:
            print("Not able to connect minio / {}".format(ex))

    def get_object(self, bucket_name, object_name):
        """
        fetch object from bucket
        :param bucket_name: Container name in Minio : str
        :param object_name: name of minio object : str
        :param type: type of object
        :return: object (blob)
        """
        data = None
        try:
            """checking the bucket exist or not"""
            bucket = self.minioClient.bucket_exists(bucket_name)
            if bucket:
                try:
                    response = self.minioClient.get_object(bucket_name, object_name)
                    # read data from response
                    data = response.read()
                except S3Error as ex:
                    print("Not able to get data from minio / ", (ex))
                finally:
                    response.close()
                    response.release_conn()
            else:
                print("Bucket does not exist")

        except S3Error as ex:
            print("Not able to get data from minio / ", (ex))

        return data

    def insert_object(
        self, file, bucket_name, object_name, toCreateNewBucket=False, metadata={}
    ):
        """
        insert object into bucket
        :param bucket_name: Container name in Minio : str
        :param object_name: Name of minio object : str
        :param toCreateNewBucket: option to create new bucket ("default value: False")
        :return: status : True or False
        """
        try:
            bucket = self.minioClient.bucket_exists(bucket_name)
            isSuccess = False
            if bucket:
                file.save("temp" + file.filename)
                file_data = open("temp" + file.filename, "rb")
                file_stat = os.stat("temp" + file.filename)
                size = file_stat.st_size
                self.minioClient.put_object(
                    bucket_name, object_name, file_data, size, metadata=metadata
                )
                os.remove("temp" + file.filename)
                print("Data uploaded")
                isSuccess = True

            elif toCreateNewBucket:
                self.minioClient.make_bucket(bucket_name)
                print("Bucket created sucessfully")
                self.insert_data(file, bucket_name, object_name)
                isSuccess = True

        except S3Error as ex:
            print("Not able to insert data into minio/ ", (ex))

        return isSuccess

    def delete_object(self, bucket_name, object_name):
        """
        delete object from bucket
        :param bucket_name: Container name in Minio : str
        :param object_name: name of minio object : str
        :return: status : True or False
        """
        try:
            bucket = self.minioClient.bucket_exists(bucket_name)
            isSuccess = False
            if bucket:
                self.minioClient.remove_object(bucket_name, object_name)
                print("Object deleted sucessfully")
                isSuccess = True

            else:
                print("Object can't be deleted because Bucket is not available")

        except S3Error as ex:
            print("Object can not be deleted/ ", (ex))

        return isSuccess

    def list_objects(self, bucket_name, folder_name=""):
        """
        fetch all object details from bucket
        :param bucket_name: Container name in Minio : str
        :return: objects : list
        """
        # remove the first character if it is "/"
        if folder_name.startswith("/"):
            folder_name = folder_name[1:]

        objects = []
        try:
            bucket = self.minioClient.bucket_exists(bucket_name)
            if bucket:
                objects = self.minioClient.list_objects(
                    bucket_name, recursive=False, prefix=folder_name
                )
                print("Objects fetched sucessfully")

            else:
                print("Bucket does not exist")

        except S3Error as ex:
            print("Not able to get data from minio / ", (ex))

        return objects

    def create_folder(self, bucket_name, folder_name):
        """
        create folder in bucket
        :param bucket_name: Container name in Minio : str
        :param folder_name: name of folder : str
        :return: status : True or False
        """
        try:
            bucket = self.minioClient.bucket_exists(bucket_name)
            isSuccess = False
            if bucket:
                # since minio does not have folder concept, we are creating a dummy object with empty data
                self.minioClient.put_object(
                    bucket_name, folder_name + "/", io.BytesIO(b""), 0
                )

                print("Folder created sucessfully")
                isSuccess = True

            else:
                print("Folder can't be created because Bucket is not available")

        except S3Error as ex:
            print("Folder can not be created/ ", (ex))

        return isSuccess

    def get_objectURL(self, bucket_name, object_name):
        """
        fetch object url from bucket
        :param bucket_name: Container name in Minio : str
        :param object_name: name of minio object : str
        :return: url : str
        """
        url = None
        try:
            bucket = self.minioClient.bucket_exists(bucket_name)
            if bucket:
                url = self.minioClient.get_presigned_url(
                    "GET", bucket_name, object_name
                )
                print("Object url fetched sucessfully")

            else:
                print("Bucket does not exist")

        except S3Error as ex:
            print("Not able to get data from minio / ", (ex))

        return url

    def get_downloadURL(self, bucket_name, object_name):
        """
        fetch object download url from bucket
        :param bucket_name: Container name in Minio : str
        :param object_name: name of minio object : str
        :return: url : str
        """
        url = None
        try:
            bucket = self.minioClient.bucket_exists(bucket_name)
            if bucket:
                url = self.minioClient.presigned_get_object(bucket_name, object_name)
                print("Object url fetched sucessfully")

            else:
                print("Bucket does not exist")

        except S3Error as ex:
            print("Not able to get data from minio / ", (ex))

        return url

    def metadata_object(self, bucket_name, object_name):
        """
        fetch object details from bucket
        :param bucket_name: Container name in Minio : str
        :param object_name: name of minio object : str
        :return: object : object
        """
        metadata = {}
        try:
            bucket = self.minioClient.bucket_exists(bucket_name)
            if bucket:
                object = self.minioClient.stat_object(bucket_name, object_name)
                metadata = object.metadata
                metadata = dict(metadata)
                metadata = {
                    k: v
                    for k, v in metadata.items()
                    if k.startswith("x-amz-meta") or k == "Content-Type"
                }
                # remove x-amz-meta- from key
                metadata = {
                    k.replace("x-amz-meta-", ""): v for k, v in metadata.items()
                }
                print("Object details fetched sucessfully")

            else:
                print("Bucket does not exist")

        except S3Error as ex:
            print("Not able to get data from minio / ", (ex))

        return metadata
