import {
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileData,
  FileToolbar,
  ChonkyActions,
  FileHelper,
} from "chonky";
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import ls from "local-storage";
import { extractFiletype } from "../utils/extract-file-type";
import DisplayModal from "./Modal";

function isDir(fileName) {
  return fileName[fileName.length - 1] === "/";
}
function getPreviewName(name) {
  if (isDir(name)) {
    let last = name.slice(0, name.length - 1);
    let arr = last.split("/");
    return arr[arr.length - 1];
  } else {
    let arr = name.split("/");
    return arr[arr.length - 1];
  }
}

function getFileArrayObject(fileData) {
  const data = {
    id: fileData.object_name,
    name: getPreviewName(fileData.object_name),
    isDir: isDir(fileData.object_name),
    thumbnailUrl: isDir(fileData.object_name) ? "" : fileData.url,
    size: fileData.size,
    modDate: fileData.last_modified,
    metadata: fileData.metadata,
    parentId: "",
    childrenIds: [],
  };
  return data;
}

export const MyFileBrowser = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState("");

  const [rootFolderId, setRootFolderId] = useState("");
  const [fileArray, setFileArray] = useState([]);
  const [folderChain, setFolderChain] = useState([
    { name: getPreviewName(rootFolderId), id: rootFolderId },
  ]);
  // the path of the current folder
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);

  // use effects for fetching data, and setting state variables
  useEffect(() => {
    setRootFolderId("/" + ls.get("username"));
  }, []);
  useEffect(() => {
    axios
      .post("http://localhost:5000/list_objects", {
        bucket_name: "redflags",
        prefix: currentFolderId,
      })
      .then((response) => {
        console.log(response.data);
        // setFileArray(response.data);
        let tempFileArray = [];
        response.data.objects.forEach((fileData) => {
          tempFileArray.push(getFileArrayObject(fileData));
        });
        setFileArray(tempFileArray);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentFolderId]);

  // chonky action center
  // defines and manages the action handler for files
  const fileActions = useMemo(
    () => [
      ChonkyActions.CreateFolder,
      ChonkyActions.DeleteFiles,
      ChonkyActions.UploadFiles,
      ChonkyActions.DownloadFiles,
    ],
    []
  );
  const thumbnailGenerator = useCallback(
    (file) => (file.thumbnailUrl ? file.thumbnailUrl : null),
    []
  );
  // helper functions
  function handleChangeDirectory(folderId) {}
  // creates a new folder in the current directory
  function createFolder(folderName) {
    axios
      .post("http://localhost:5000/create_folder", {
        bucket_name: "redflags",
        folder_name: currentFolderId + folderName,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setCurrentFolderId(currentFolderId + folderName);
  }
  // handle file preview
  function handleFilePreview(fileToOpen) {
    const type = extractFiletype(fileToOpen.name);
    if (type === "image") {
      const image = <img src={fileToOpen.thumbnailUrl} alt={fileToOpen.name} />;
      setModalBody(image);
      setModalOpen(true);
    } else if (type === "pdf") {
      // open in a new tab thumbnailUrl
      window.open(fileToOpen.thumbnailUrl, "_blank");
    }
  }
  // chonky action mapper
  const useFileActionHandler = () => {
    return useCallback((data) => {
      // open folder/file
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile ? targetFile : files[0];
        // handle folder click
        console.log("Opening file/folder: ", fileToOpen);
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolderId(fileToOpen.id);
          let tempFolderChain = [];
          folderChain.forEach((folder) => {
            tempFolderChain.push(folder);
          });
          tempFolderChain.push({
            name: getPreviewName(fileToOpen.id),
            id: fileToOpen.id,
          });
          console.log(tempFolderChain);
          setFolderChain(tempFolderChain);
          return;
        }
        // handle file click
        else if (fileToOpen && !FileHelper.isDirectory(fileToOpen)) {
          // return new <DisplayModal open={true} body={fileToOpen.name} />;
          handleFilePreview(fileToOpen);
        }
        return;
      } else if (data.id === ChonkyActions.CreateFolder.id) {
        const folderName = prompt("Provide the name for your new folder:");
        if (folderName) createFolder(folderName);
      }
    }, []);
  };

  return (
    <div style={{ height: "100vh" }}>
      <FileBrowser
        folderChain={folderChain}
        files={fileArray}
        thumbnailGenerator={thumbnailGenerator}
        fileActions={fileActions}
        onFileAction={useFileActionHandler()}
      >
        {modalOpen ? (
          <DisplayModal
            open={modalOpen}
            setOpen={setModalOpen}
            body={modalBody}
          />
        ) : null}
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FileBrowser>
    </div>
  );
};
