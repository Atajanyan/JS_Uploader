const endpoint = "http://localhost:8080";
let uploadQueue = [];
let activeUploads = 0;
let uploads = 0;
let files = [];
let nextFilesChange = [];
let uploadCount = 0;
let inputChangeCount = 0;
let handleNextFilesChange = null;
let finalFiles = [];

const dropArea = document.querySelector(".dropArea");
const fileInput = document.querySelector(".fileInput");
const fileList = document.querySelector(".fileList");

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "copy";
  event.target.classList.add("dropArea--border-Black");
}

function handleFileSelect(event) {
  event.preventDefault();
  event.stopPropagation();

  if (files.length) {
    nextFilesChange = event.target.files || event.dataTransfer.files;
  } else {
    files = event.target.files || event.dataTransfer.files;
  }

  finalFiles = nextFilesChange.length ? nextFilesChange : files;
  for (let i = 0; i < finalFiles.length; i++) {
    const file = finalFiles[i];
    file.id = Math.random();
    uploadQueue.push(file);
    createFileItem(file);
  }

  let progressUploadedFiles = uploadQueue.slice(uploads);

  if (inputChangeCount) {
    handleNextFilesChange = function () {
      let progressUploadedFiles1 = uploadQueue.slice(uploads);
      processUpload(progressUploadedFiles1);
      uploads += finalFiles.length;
      uploadCount = 0;
      inputChangeCount = 0;
    };
    return;
  }

  inputChangeCount = 1;

  if (!uploadCount) {
    processUpload(progressUploadedFiles);
    uploads += finalFiles.length;
  }
}

function createFileItem(file) {
  const fileItem = document.createElement("div");
  fileItem.className = "fileItem";
  fileItem.id = file.id;

  const description = document.createElement("div");
  description.className = "fileItem__description";

  const name = document.createElement("span");
  name.innerHTML = file.name;

  const percent = document.createElement("span");
  percent.className = "fileItem__percent";

  const progressBar = document.createElement("div");
  progressBar.className = "progressBar";

  const progressBarFill = document.createElement("div");
  progressBarFill.className = "progressBarFill";

  description.append(name, percent);
  progressBar.appendChild(progressBarFill);
  fileItem.append(description, progressBar);
  fileList.appendChild(fileItem);
}

async function handleActiveUploads(progressArr, progressUploadedFiles) {
  for (let j = 0; j < progressArr.length; j++) {
    const file = progressArr[j];
    uploadFile(file, progressUploadedFiles);
  }
}

function processUpload(progressUploadedFiles) {
  let progressArr = progressUploadedFiles.splice(0, 3);
  handleActiveUploads(progressArr, progressUploadedFiles);
}

function uploadFile(file, progressUploadedFiles) {
  const formData = new FormData();
  formData.append("file", file);

  const xhr = new XMLHttpRequest();

  xhr.open("POST", endpoint, true);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const progress = ((event.loaded / event.total) * 100).toFixed(2);
      updateProgressBar(file, progress);
      if (+progress === 100) {
        activeUploads++;
        ++uploadCount;
      }
    }
  };

  xhr.onload = () => {
    if (activeUploads === 3) {
      activeUploads = 0;
      processUpload(progressUploadedFiles);
    }

    if (uploadCount === (files.length || nextFilesChange.length)) {
      if (nextFilesChange.length) {
        if (handleNextFilesChange) {
          activeUploads = 0;
          uploadCount = 0;
          inputChangeCount = 0;
          nextFilesChange = [];
          files = [];
          handleNextFilesChange();
          handleNextFilesChange = null;
        } else {
          inputChangeCount = 0;
        }
      } else {
        activeUploads = 0;
        uploadCount = 0;
        inputChangeCount = 0;
        files = [];
      }
    } else if (uploadCount && !files.length && !nextFilesChange.length) {
      uploadCount = 0;
    }
  };

  xhr.onerror = () => {
    new Error("Error");
  };

  xhr.send(formData);
}

function updateProgressBar(file, progress) {
  for (let i = 0; i < [...fileList.children].length; i++) {
    if (+[...fileList.children][i].id === file.id) {
      const progressBarFill = [...fileList.children][i].querySelector(".progressBarFill");
      let percent = [...fileList.children][i].querySelector(".fileItem__percent");
      percent.textContent = `${progress}%`;

      progressBarFill.style.width = `${progress}%`;

      if (progress < 100) {
        progressBarFill.style.backgroundColor = "#2196f3";
      } else {
        progressBarFill.style.backgroundColor = "green";
      }
    }
  }
}

dropArea.addEventListener("dragenter", handleDragOver);
dropArea.addEventListener("dragover", (e) => e.preventDefault());
dropArea.addEventListener("drop", handleFileSelect);
fileInput.addEventListener("change", handleFileSelect);
