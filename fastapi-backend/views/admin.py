from dotenv import dotenv_values

def updateBucket(newBucketName):
    """
    @description: 
        Update the bucket name in the .env file
    @param 
        newBucketName: str, the name of the new bucket   
    @return: None
    """   
    try:
        # get the current configurations
        config = dotenv_values("../.env")
        config["bucketName"] = newBucketName
        with open("../.env", "r") as f:
            lines = f.readlines()
            with open("../.env", "w") as f:
                for line in lines:
                    if "=" in line:
                        key, _ = line.strip().split("=", 1)
                        if key in config:
                            f.write(f"{key}={config[key]}\n")
                        else:
                            f.write(line)
                    else:
                        f.write(line)
        return True
    except Exception as e:
        print(e)
        return False