const endpoint = "http://localhost:8080";
const progressBarFillArr = [];
const allFiles = [];
const parallelUploadCount = 3;
let activeUploads = 0;
let uploadCount = 0;
let isLoaded = false;

const dropArea = document.querySelector(".dropArea");
const fileInput = document.querySelector(".fileInput");
const fileList = document.querySelector(".fileList");
const uploadFilesCount = document.querySelector('.files-count')

function handleUploadFilesCount(){
  uploadFilesCount.textContent = `upload files count : ${uploadCount}/${allFiles.length}`
}

function handleProgress(event,progressBarFill,percent){
  if (event.lengthComputable) {
    const progress = ((event.loaded / event.total) * 100).toFixed(2);
    updateProgressBar(progress, progressBarFill,percent);
  }
}

function handleUpload(xhr,end){
  if (xhr.status === 200) {
    activeUploads++;
    uploadCount++;
    handleUploadFilesCount()
  }

  if (activeUploads === parallelUploadCount || activeUploads === end) {
    activeUploads = 0;
    parallelUpload();
  }

  if (uploadCount === allFiles.length) {
    activeUploads = 0;
    isLoaded = false;
  }
}

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
  progressBarFillArr.push({progressBarFill,percent});

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
    allFiles.push(file);
    handleUploadFilesCount()
    createFileItem(file);
  }

  event.target.value = ''

  if (!isLoaded) {
    isLoaded = true;
    parallelUpload();
  }
}

function parallelUpload() {
  let end = allFiles.length - uploadCount < parallelUploadCount ? allFiles.length - uploadCount : parallelUploadCount 
  uploadFile(uploadCount,uploadCount + end);
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

function uploadFile(start,end) {
  for (let i = start; i < end; i++) {
    let file = allFiles[i];
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", endpoint, true);

    const {progressBarFill,percent} = progressBarFillArr[i];

    xhr.upload.onprogress = (event) => handleProgress(event,progressBarFill,percent)

    xhr.onload = () => handleUpload(xhr,end);

    xhr.onerror = (err) => {
      new Error(err);
    };

    xhr.send(formData);
  }
}

dropArea.addEventListener("dragenter", handleDragEnter);
dropArea.addEventListener("dragover", (e) => e.preventDefault());
dropArea.addEventListener("drop", handleFileSelect);
fileInput.addEventListener("change", handleFileSelect);
