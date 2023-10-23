from functions import Minio_Db

client = Minio_Db()

# insert Almanac-M23.pdf from Downloads folder to minio bucket bkt1

# store the file in Downloads folder in a variable
file = "/home/sovvv/Downloads/Almanac-M23.pdf"

# insert the file in minio bucket bkt1
client.insert_data(file, "bkt1", "file.pdf")
