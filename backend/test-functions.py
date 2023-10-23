from functions import Minio_Db

client = Minio_Db()

"""
insert Almanac-M23.pdf from Downloads folder to minio bucket bkt1
"""
# file = "/home/sovvv/Downloads/Almanac-M23.pdf"
# client.insert_data(file, "bkt1", "file.pdf")

"""
print all objects in bucket bkt1
object name, size, last modified
"""
# for i in client.list_objects("bkt1"):
#     print(i.object_name, i.size, i.last_modified)

"""
get file.pdf from bucket bkt1 and save it to Downloads folder
"""
# data = client.get_object("bkt1", "file.pdf")
# with open("/home/sovvv/Downloads/filetemp.pdf", "wb") as f:
#     f.write(data)
