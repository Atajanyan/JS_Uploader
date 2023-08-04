const endpoint = "http://localhost:8080";
let uploadQueue = [];
const progressBarFillArr = [];
let activeUploads = 0;
let files = [];
let uploadCount = 0;
let inputChangeCount = false;
let sliceCount = 0;

const dropArea = document.querySelector(".dropArea");
const fileInput = document.querySelector(".fileInput");
const fileList = document.querySelector(".fileList");

function handleDragEnter(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "copy";
  event.target.classList.add("dropArea--border-Black");
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
  progressBarFill.id = file.id;
  progressBarFillArr.push(progressBarFill);

  description.append(name, percent);
  progressBar.appendChild(progressBarFill);
  fileItem.append(description, progressBar);
  fileList.appendChild(fileItem);
}

function handleFileSelect(event) {
  event.preventDefault();
  event.stopPropagation();

  files = event.target.files || event.dataTransfer.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    file.id = Math.random() + Date.now();
    uploadQueue.push(file);
    createFileItem(file);
  }

  event.target.value = ''

  if (!inputChangeCount) {
    inputChangeCount = true;
    parallelUpload(uploadQueue);
  }
}

function parallelUpload(arr) {
  let parallelArrSlice = arr.slice(sliceCount, sliceCount + 3);

  uploadFile(parallelArrSlice, uploadQueue.slice(parallelArrSlice.length));
}

function uploadFile(arr, parallelArrSlice) {
  for (let i = 0; i < arr.length; i++) {
    let file = arr[i];
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", endpoint, true);

    const progressUpload = progressBarFillArr.find((el) => el.id == file.id);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = ((event.loaded / event.total) * 100).toFixed(2);
        updateProgressBar(progress, progressUpload);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        activeUploads++;
        uploadCount++;
        sliceCount++;
      }

      if (activeUploads >= 3 || activeUploads === arr.length) {
        activeUploads = 0;
        parallelUpload(uploadQueue);
      }

      if (uploadCount === uploadQueue.length) {
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

function updateProgressBar(progress, progressUpload) {
  progressUpload.style.width = `${progress}%`;
  
  
  if (progress < 100) {
    progressUpload.style.backgroundColor = "#2196f3";
  }else{
    progressUpload.style.backgroundColor = "green";
  }
}

dropArea.addEventListener("dragenter", handleDragEnter);
dropArea.addEventListener("dragover", (e) => e.preventDefault());
dropArea.addEventListener("drop", handleFileSelect);
fileInput.addEventListener("change", handleFileSelect);
