import {
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
  ChonkyActions,
  FileHelper,
} from "chonky";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import { extractFiletype } from "../utils/extract-file-type";
import DisplayModal from "./Modal";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Box } from "@mui/material";
import ReactPlayer from "react-player";
import { ShareFiles, ShareFilesModal } from "./ShareFileCustomAction";

export function isDir(fileName) {
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
  // console.log(fileData.object_name);
  const data = {
    id: fileData.object_name,
    name: getPreviewName(fileData.object_name),
    isDir: isDir(fileData.object_name),
    thumbnailUrl: isDir(fileData.object_name) ? "" : fileData.url,
    size: fileData.size,
    modDate: fileData.last_modified,
    metadata: fileData.metadata,
    parentId: "null",
  };
  return data;
}
function getParentId(id) {
  const str = id;
  let components = str.split("/");
  components.pop();
  components.pop();
  let result = components.join("/");
  if (result) result += "/";
  return result;
}
function createFolderDataObject(id, name, parentId) {
  const data = {
    id: id,
    name: name,
    isDir: true,
    parentId: getParentId(id),
    childrenIds: [],
    openable: true,
  };
  return data;
}

export const MyFileBrowser = ({ setMetaFileData, setShowMetaData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [openShareFileModal, setOpenShareFileModal] = useState(false);
  const [sharedFileData, setSharedFileData] = useState({});
  const [modalBody, setModalBody] = useState("");
  const [rootFolderId, setRootFolderId] = useState("user1/");
  const [fileArray, setFileArray] = useState([]);
  const [fileMap, setFileMap] = useState({
    "user1/": createFolderDataObject("user1/", "user1", null),
  });
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);
  const currentFolderIdRef = useRef(currentFolderId);
  const [folderChain, setFolderChain] = useState([
    createFolderDataObject("user1/", "user1", null),
  ]);
  const fileMapRef = useRef(fileMap);

  useEffect(() => {
    fileMapRef.current = fileMap;
    // console.log("##################");
    // for (let key in fileMapRef.current) {
    //   console.log(key, fileMapRef.current[key]);
    // }
  }, [fileMap]);

  /* USE EFFECTS */
  // GET OBJECTS //
  useEffect(() => {
    axios
      .post("http://localhost:5000/list_objects", {
        bucket_name: "redflags",
        prefix: currentFolderId,
      })
      .then((response) => {
        console.log(response.data);
        let tempFileArray = [];
        response.data.objects.forEach((fileData) => {
          const data = getFileArrayObject(fileData);
          tempFileArray.push(data);
        });
        setFileArray(tempFileArray);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentFolderId]);
  // FOLDER MAP //
  useEffect(() => {
    const newFileMap = {};
    fileArray.forEach((file) => {
      if (file.isDir) {
        const folderData = createFolderDataObject(
          file.id,
          file.name,
          currentFolderIdRef.current
        );
        newFileMap[file.id] = folderData;
      }
    });
    setFileMap((fileMap) => ({ ...fileMap, ...newFileMap }));
    // console.log("FOLDER MAPPP : ");
    // for (let key in fileMap) {
    //   console.log(key, fileMap[key]);
    // }
  }, [fileArray]);

  useEffect(() => {
    currentFolderIdRef.current = currentFolderId;
  }, [currentFolderId]);
  // FOLDER CHAIN AND SET CURRENT FOLDER REFERENCE
  useEffect(() => {
    const currentFolder = fileMap[currentFolderIdRef.current];
    if (currentFolder) {
      const newFolderChain = [currentFolder];
      let parentId = currentFolder.parentId;
      console.log("parent id: ", parentId);
      while (parentId) {
        const parentFolder = fileMap[parentId];
        console.log("current folder:  ", parentId);
        if (parentFolder) {
          newFolderChain.unshift(parentFolder);
          parentId = parentFolder.parentId;
        } else {
          console.log("parent folder not found");
          break;
        }
      }
      setFolderChain(newFolderChain);
      console.log("new folder chain: ", newFolderChain);
    }
  }, [fileMap]);

  // chonky action center
  // defines and manages the action handler for files

  const fileActions = useMemo(
    () => [
      ChonkyActions.CreateFolder,
      ChonkyActions.DeleteFiles,
      ChonkyActions.UploadFiles,
      ChonkyActions.DownloadFiles,
      ShareFiles,
    ],
    []
  );
  const thumbnailGenerator = useCallback(
    (file) => (file.thumbnailUrl ? file.thumbnailUrl : null),
    []
  );
  // creates a new folder in the current directory
  const createFolder = useCallback(
    (folderName) => {
      axios
        .post("http://localhost:5000/create_folder", {
          bucket_name: "redflags",
          folder_name: currentFolderIdRef.current + folderName,
        })
        .then((response) => {
          console.log("crrrreeeatee ", currentFolderIdRef.current);
        })
        .catch((error) => {
          console.log(error);
        });
      setCurrentFolderId(currentFolderIdRef.current);
    },
    [currentFolderIdRef]
  );
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
    } else if (type === "markdown") {
      let markdown;
      fetch(fileToOpen.thumbnailUrl).then(function (response) {
        response.text().then(function (text) {
          markdown = text;
          // console.log(markdown);
          const markdownBody = (
            <Markdown
              rehypePlugins={[rehypeRaw]}
              style={{
                overflowY: "auto",
                margin: "0 20px",
              }}
            >
              {markdown}
            </Markdown>
          );
          setModalBody(markdownBody);
          setModalOpen(true);
        });
      });
    } else if (type === "video") {
      const video = (
        <ReactPlayer
          url={fileToOpen.thumbnailUrl}
          controls={true}
          width="100%"
          style={{
            margin: "0 20px",
            overflowY: "hidden",
            overflowX: "hidden",
            maxWidth: "100%",
            maxHeight: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          height="100%"
        />
      );
      setModalBody(video);
      setModalOpen(true);
    } else if (type === "audio") {
    }
  }

  // chonky action mapper
  const useFileActionHandler = () => {
    return useCallback((data) => {
      // OPEN FILE/FOLDER
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile ? targetFile : files[0];
        // handle folder click
        // console.log("Opening file/folder: ", fileToOpen);
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolderId(fileToOpen.id);
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
      } else if (data.id === ShareFiles.id) {
        // share file action
        const fileToShare = data.state.selectedFiles[0];
        setOpenShareFileModal(true);
        setSharedFileData(fileToShare);
      } else if (data.id === ChonkyActions.ChangeSelection) {
        console.log("change selection", data.payload.selectedFiles);
        if (data.payload.selectedFiles.length === 0) {
          setShowMetaData(false);
          setMetaFileData({});
        }
      } else if (
        data.id === ChonkyActions.MouseClickFile.id &&
        data.payload.clickType === "single"
      ) {
        if (!data.payload.file.isDir) {
          const file = data.payload.file;
          setMetaFileData(file);
          setShowMetaData(true);
        }
      }
    }, []);
  };

  return (
    <>
      {modalOpen ? (
        <DisplayModal
          open={modalOpen}
          setOpen={setModalOpen}
          body={modalBody}
        />
      ) : null}
      {openShareFileModal ? (
        <ShareFilesModal
          open={openShareFileModal}
          setOpen={setOpenShareFileModal}
          sharedFile={sharedFileData}
          setSharedFile={setSharedFileData}
        />
      ) : null}

      <Box sx={{ display: "flex", height: "92vh" }}>
        <Box sx={{ flexGrow: 1 }}>
          <FileBrowser
            folderChain={folderChain}
            files={fileArray}
            thumbnailGenerator={thumbnailGenerator}
            fileActions={fileActions}
            // disableDefaultFileActions={true}
            onFileAction={useFileActionHandler()}
          >
            <FileNavbar />
            <FileToolbar />
            <FileList />
            <FileContextMenu />
          </FileBrowser>
        </Box>
      </Box>
    </>
  );
};
