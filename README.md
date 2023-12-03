# Data-Drive_Red-flags

# Project Description

Data Drive is a flexible platform for managing data that works well with MinIO.
On top of MinIO, it provides an abstraction layer that add to it the new functionalities and a user-friendly interface. We are able to effectively manage, access, and work.

<center>
<img src="./docs/home.gif" alt="Home Page" width="600"/>
</center>

## Architecture

1. Backend: Backend is built using Flask, a python based framework.
2. Frontend: Frontend is built using ReactJS, a javascript based framework. We use the chonky file browser package for the frontend.
3. DataBases: For Database we use two databases, one is SQL which is used for storing the metadata of the files, permissions,
   users, etc. The other is MinIO which is used for storing the actual files.
4. Authentication: Authentication is done using JWT tokens

The Database Diagram is as follows:

![Database Diagram](./docs/relational-schema.jpeg)

The Class Diagram is as follows:

![Class Diagram](./docs/classes.jpg)

## Features

### User

- The application supports, registering of new users, logging in and out, of the application. We have added authentications using JWT tokens.
- As a user is registered, we assign user a pre-defined storage space that is pre-defined by the admin and could be configured by the admin later.
- The user can see their assigned quota and the storage space used.

### Admin

The program allows you to log in and out, as well as create administrators. The administrator may modify storage capacity, grant people access, and more.

### Data Management

- Upload - The user has the ability to upload files to their assigned storage space if they have the permission. This is done using MinIO and SQL.
- Download - Users can download files, this is done using MinIO and SQL.
- File System manipulation - Users can create and manage folders.
- File Sharing - The user has the ability to share files with other users. The user can also set permissions for the shared file.
  ![Manage Sharing](./docs/manage02.png)
- Copying/ Moving files - The user has the ability to copy or move files from one folder to another.

### Data Visualization

Selected data formats can be seen within the program itself. Markdown, images, video, pdf and more formats are among those that are supported.

![Mark-Down](./docs/markdown-viewer.png)
![GIFs](./docs/gif.png)
