from minio import Minio
from minio.error import S3Error
import config


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

    def insert_object(self, data, bucket_name, object_name, toCreateNewBucket=False):
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
                self.minioClient.put_object(bucket_name, object_name, data)
                print("Data uploaded")
                isSuccess = True

            elif toCreateNewBucket:
                self.minioClient.make_bucket(bucket_name)
                print("Bucket created sucessfully")
                self.insert_data(data, bucket_name, object_name)
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

    def list_objects(self, bucket_name):
        """
        fetch all object details from bucket
        :param bucket_name: Container name in Minio : str
        :return: objects : list
        """
        objects = []
        try:
            bucket = self.minioClient.bucket_exists(bucket_name)
            if bucket:
                objects = self.minioClient.list_objects(bucket_name, recursive=True)
                print("Objects fetched sucessfully")

            else:
                print("Bucket does not exist")

        except S3Error as ex:
            print("Not able to get data from minio / ", (ex))

        return objects

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
