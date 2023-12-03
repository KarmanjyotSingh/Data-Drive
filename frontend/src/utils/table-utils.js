export function getFileSize(bytes, dp = 1) {
    const thresholdBytes = 1024;
    if (Math.abs(bytes) < thresholdBytes) {
      return bytes + " B";
    }
    const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  
    let u = -1;
    const r = 10 ** dp;
  
    do {
      bytes /= thresholdBytes;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= thresholdBytes &&
      u < units.length - 1
    );
  
    return bytes.toFixed(dp) + " " + units[u];
  }
  
  export function isFolder(name) {
    return name.endsWith("/");
  }
  
  export function createData(id, name, size, lastModified, etag, metadata, url) {
    return {
      id,
      name: name,
      size: isFolder(name) ? "-" : getFileSize(size),
      lastModified,
      etag,
      metadata,
      url,
    };
  }
  
  export function previewName(name) {
    if (isFolder(name)) {
      let last = name.slice(0, name.length - 1);
      let arr = last.split("/");
      return arr[arr.length - 1];
    } else {
      let arr = name.split("/");
      return arr[arr.length - 1];
    }
  }
  