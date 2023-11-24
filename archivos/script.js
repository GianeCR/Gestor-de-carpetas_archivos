const form = document.querySelector("form");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () => {
  fileInput.click();
});

// Agregar drag and drop
const dropArea = document.querySelector('.wrapper');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dropArea.classList.add('highlight');
}

function unhighlight() {
  dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  handleFiles(files);
}

// Reemplazamos espacios en nombres de archivos por guiones
function handleFiles(files) {
  [...files].forEach(uploadFile);
}

fileInput.onchange = ({ target }) => {
  handleFiles(target.files);
};

function uploadFile(file) {
  let fileName = file.name.replace(/\s+/g, '-'); // Reemplazar espacios por guiones
  if (fileName.length >= 12) {
    let splitName = fileName.split('.');
    fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${fileName} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    if (loaded == total) {
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
      <div class="content upload">
        <i class="fas fa-file-alt"></i>
        <div class="details">
          <span class="name">${fileName} • Subido</span>
          <span class="size">${fileSize}</span>
        </div>
        <div class="actions">
          <button class="download-btn">Descargar</button>
          <button class="delete-btn">Eliminar</button>
        </div>
      </div>
      <i class="fas fa-check"></i>
    </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });
  let data = new FormData(form);
  data.append('file', file); // Agregar el archivo al FormData
  xhr.send(data);
}

// Añadimos el evento clic para los botones de descarga y eliminación
uploadedArea.addEventListener('click', (e) => {
    const clickedElement = e.target;
    const row = clickedElement.closest('.row');
  
    if (clickedElement.classList.contains('download-btn')) {
      downloadFile(row);
    } else if (clickedElement.classList.contains('delete-btn')) {
      deleteFile(row);
    }
  });
  
  // Función para descargar el archivo
  function downloadFile(row) {
    const fileName = row.querySelector('.name').innerText.split(' • ')[0];
    const downloadLink = document.createElement('a');
    downloadLink.href = `files/${fileName}`;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  
  // Función para eliminar el archivo
  function deleteFile(row) {
    const fileName = row.querySelector('.name').innerText.split(' • ')[0];
    row.remove();
  }
