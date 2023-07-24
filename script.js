// const endpoint = "http://localhost:8080";

// // let progressUploadedFiles = [];
// let uploadQueue = [];
// let parallelUploads = 0;
// let activeUploads = 0;
// let uploads = 0;
// let files = [];
// let i = 0;
// let submitCount = 0;
// let uploadCount = 0;
// let inputChangeCount = 0;
// let nextInputChangeCount = 0;
// let foo = null;

// const dropArea = document.querySelector(".dropArea");
// const fileInput = document.querySelector(".fileInput");
// const fileList = document.querySelector(".fileList");
// const label = document.querySelector("label");

// function handleDragOver(event) {
//   event.preventDefault();
//   event.stopPropagation();
//   event.dataTransfer.dropEffect = "copy";
//   event.target.classList.add("dropArea--border-Black");
// }

// function handleFileSelect(event) {
//   event.preventDefault();
//   event.stopPropagation();

//   files = fileInput.files || fileInput.dataTransfer.files;

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     uploadQueue.push(file);
//     createFileItem(file);
//   }

//   let progressUploadedFiles = uploadQueue.slice(uploads);

//   console.log(inputChangeCount);

//   if (inputChangeCount) {
//     console.log("foo");
//     let progressUploadedFiles1 = uploadQueue.slice(uploads);
//     foo = function () {
//       processUpload(progressUploadedFiles1);
//       uploads += files.length;
//       submitCount++;
//     };
//     return
//   }

//   parallelUploads += files.length;
//   inputChangeCount = 1;

//   if (!uploadCount) {
//     processUpload(progressUploadedFiles);
//     uploads += files.length;
//     submitCount++;
//   }

//   // inputChangeCount = 0
// }

// function createFileItem(file) {
//   const fileItem = document.createElement("div");
//   fileItem.className = "fileItem";
//   fileItem.textContent = file.name;

//   const progressBar = document.createElement("div");
//   progressBar.className = "progressBar";

//   const progressBarFill = document.createElement("div");
//   progressBarFill.className = "progressBarFill";

//   progressBar.appendChild(progressBarFill);
//   fileItem.appendChild(progressBar);
//   fileList.appendChild(fileItem);
// }

// async function handleActiveUploads(progressArr, progressUploadedFiles) {
//   for (let j = 0; j < progressArr.length; j++) {
//     const file = progressArr[j];
//     uploadFile(file, progressUploadedFiles);
//   }
// }

// function processUpload(progressUploadedFiles) {
//   let progressArr = progressUploadedFiles.splice(i, i + 3);
//   handleActiveUploads(progressArr, progressUploadedFiles);
// }

// function uploadFile(file, progressUploadedFiles) {
//   const formData = new FormData();
//   formData.append("file", file);

//   const xhr = new XMLHttpRequest();

//   xhr.open("POST", endpoint, true);

//   xhr.upload.onprogress = (event) => {
//     if (event.lengthComputable) {
//       const progress = ((event.loaded / event.total) * 100).toFixed(2);
//       updateProgressBar(file, progress);
//       if (+progress === 100) {
//         activeUploads++;
//         uploadCount++;
//       }
//     }
//   };

//   xhr.onload = () => {
//     if (activeUploads === 3) {
//       activeUploads = 0;
//       processUpload(progressUploadedFiles);
//     }

//     if (uploadCount === files.length) {
//       activeUploads = 0;
//       uploadCount = 0;
//       if (foo) {
//         foo();
//         inputChangeCount = 0;
//       }else{
//         inputChangeCount = 0;
//       }
//     }
//   };

//   xhr.onerror = () => {
//     new Error("Ошибка загрузки");
//   };
//   xhr.send(formData);
// }

// function updateProgressBar(file, progress) {
//   for (let i = 0; i < [...fileList.children].length; i++) {
//     if ([...fileList.children][i].textContent === file.name) {
//       const progressBarFill = [...fileList.children][i].querySelector(
//         ".progressBarFill"
//       );

//       progressBarFill.style.width = `${progress}%`;
//       if (progress < 100) {
//         progressBarFill.style.backgroundColor = "green";
//       } else {
//         progressBarFill.style.backgroundColor = "#2196f3";
//       }
//     }
//   }
// }

// dropArea.addEventListener("dragenter", handleDragOver);
// dropArea.addEventListener("dragover", (e) => e.preventDefault());
// dropArea.addEventListener("drop", handleFileSelect);
// fileInput.addEventListener("change", (e) => {
//   handleFileSelect(e);
// });


const endpoint = "http://localhost:8080";
let uploadQueue = [];
let parallelUploads = 0;
let activeUploads = 0;
let uploads = 0;
let files = [];
let i = 0;
let submitCount = 0;
let uploadCount = 0;
let inputChangeCount = 0;
let nextInputChangeCount = 0;
let foo = null;
const dropArea = document.querySelector(".dropArea");
const fileInput = document.querySelector(".fileInput");
const fileList = document.querySelector(".fileList");
const label = document.querySelector("label");

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    event.target.classList.add("dropArea--border-Black");
}

function handleFileSelect(event) {
    event.preventDefault();
    event.stopPropagation();
    files = fileInput.files || fileInput.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadQueue.push(file);
        createFileItem(file);
    }
    let progressUploadedFiles = uploadQueue.slice(uploads);
    if (inputChangeCount) {
        let progressUploadedFiles = uploadQueue.slice(uploads);
        foo = function () {
            processUpload(progressUploadedFiles);
            uploads += files.length;
            submitCount++;
        };
        return;
    }
    parallelUploads += files.length;
    inputChangeCount = 1;
    if (!uploadCount) {
        processUpload(progressUploadedFiles);
        uploads += files.length;
        submitCount++;
    }
}

function createFileItem(file) {
    const fileItem = document.createElement("div");
    fileItem.className = "fileItem";
    fileItem.textContent = file.name;
    const progressBar = document.createElement("div");
    progressBar.className = "progressBar";
    const progressBarFill = document.createElement("div");
    progressBarFill.className = "progressBarFill";
    progressBar.appendChild(progressBarFill);
    fileItem.appendChild(progressBar);
    fileList.appendChild(fileItem);
}

async function handleActiveUploads(progressArr, progressUploadedFiles) {
    for (let j = 0; j < progressArr.length; j++) {
        const file = progressArr[j];
        uploadFile(file, progressUploadedFiles);
    }
}

function processUpload(progressUploadedFiles) {
    let progressArr = progressUploadedFiles.splice(i, i + 3);

    let currentUploads = uploads;

    handleActiveUploads(progressArr, progressUploadedFiles);

    for (let j = currentUploads; j < uploads; j++) {
        createFileItem(files[j]);
    }
}

function uploadFile(file, progressUploadedFiles) {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const progress = ((event.loaded / event.total) * 100).toFixed(2);
            updateProgressBar(file, progress);
            if (+progress === 100) {
                activeUploads++;
                uploadCount++;
            }
        }
    };

    xhr.onload = () => {
        if (activeUploads === 3) {
            activeUploads = 0;
            processUpload(progressUploadedFiles);
        }
        if (uploadCount === files.length) {
            activeUploads = 0;
            uploadCount = 0;
            if (foo) {
                foo();
                inputChangeCount = 0;
            } else {
                inputChangeCount = 0;
            }
        }
    };

    xhr.onerror = () => {
        new Error("Upload Error");
    };

    xhr.send(formData);
}

function updateProgressBar(file, progress) {
    for (let i = 0; i < [...fileList.children].length; i++) {
        if ([...fileList.children][i].textContent === file.name) {
            const progressBarFill = [...fileList.children][i].querySelector(
                ".progressBarFill"
            );
            progressBarFill.style.width = `${progress}%`;
            if (progress < 100) {
                progressBarFill.style.backgroundColor = "green";
            } else {
                progressBarFill.style.backgroundColor = "#2196F3";
            }
        }
    }
}

dropArea.addEventListener("dragenter", handleDragOver);
dropArea.addEventListener("dragover", (e) => e.preventDefault());
dropArea.addEventListener("drop", handleFileSelect);
fileInput.addEventListener("change", (e) => {
    handleFileSelect(e);
});
