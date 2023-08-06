const endpoint = "http://localhost:8080";
const progressBarFillArr = [];
const AllFiles = [];
let activeUploads = 0;
let uploadCount = 0;
let inputChangeCount = false;

const dropArea = document.querySelector(".dropArea");
const fileInput = document.querySelector(".fileInput");
const fileList = document.querySelector(".fileList");
const uploadFilesCount = document.querySelector('.files-count')

function handleDragEnter(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "copy";
  event.target.classList.add("dropArea--border-Black");
}

function createFileItem(file) {
  const fileItem = document.createElement("div");
  fileItem.className = "fileItem";

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
  progressBarFillArr.push({progressBarFill,percent,id:file.id});

  description.append(name, percent);
  progressBar.appendChild(progressBarFill);
  fileItem.append(description, progressBar);
  fileList.appendChild(fileItem);
}

function handleFileSelect(event) {
  event.preventDefault();

  const files = event.target.files || event.dataTransfer.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    file.id = Math.random() + Date.now();
    AllFiles.push(file);
    uploadFilesCount.textContent = `upload files count : ${uploadCount}/${AllFiles.length}`
    createFileItem(file);
  }

  event.target.value = ''

  if (!inputChangeCount) {
    inputChangeCount = true;
    parallelUpload();
  }
}

function parallelUpload() {
  let uploadQueue = AllFiles.slice(uploadCount, uploadCount + 3);

  uploadFile(uploadQueue);
}

function uploadFile(uploadQueue) {
  for (let i = 0; i < uploadQueue.length; i++) {
    let file = uploadQueue[i];
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", endpoint, true);

    const {progressBarFill,percent} = progressBarFillArr.find((el) => el.id == file.id);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = ((event.loaded / event.total) * 100).toFixed(2);
        updateProgressBar(progress, progressBarFill,percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        activeUploads++;
        uploadCount++;
        uploadFilesCount.textContent = `upload files count : ${uploadCount}/${AllFiles.length}`
      }

      if (activeUploads >= 3 || activeUploads === uploadQueue.length) {
        activeUploads = 0;
        parallelUpload();
      }

      if (uploadCount === AllFiles.length) {
        activeUploads = 0;
        inputChangeCount = false;
      }
    };

    xhr.onerror = () => {
      new Error("Error");
    };

    xhr.send(formData);
  }
}

function updateProgressBar(progress, progressBarFill,percent) {
  progressBarFill.style.width = `${progress}%`;
  percent.textContent = `${progress}%`;
  
  if (progress < 100) {
    progressBarFill.style.backgroundColor = "#2196f3";
  }else{
    progressBarFill.style.backgroundColor = "green";
  }
}

dropArea.addEventListener("dragenter", handleDragEnter);
dropArea.addEventListener("dragover", (e) => e.preventDefault());
dropArea.addEventListener("drop", handleFileSelect);
fileInput.addEventListener("change", handleFileSelect);
