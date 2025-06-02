function openImageModal(imageURL) {
  const decodedURL = decodeURIComponent(imageURL);
  const modal = document.createElement("div");
  modal.id = "image-modal";
  modal.className = "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50";

  modal.innerHTML = `
    <div id="image-modal-content" class='bg-white rounded-lg overflow-hidden relative max-w-3xl w-full p-4'>
      <button onclick="document.getElementById('image-modal').remove()" class='absolute top-2 right-2 text-black font-bold text-xl'>&times;</button>
      <img src="${decodedURL}" alt="Card Image" class="max-h-[80vh] w-auto max-w-full mx-auto rounded shadow-lg object-contain " loading="lazy">
    </div>
  `;

  modal.addEventListener("click", function (e) {
    if (!document.getElementById("image-modal-content").contains(e.target)) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}

function openImageUploadModal(name, set, parallel) {
  const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSfPR_22_eF4SF53K_mzSJyMxrP-qD3ipb9rVHIImMmXwQt2Yg/viewform?usp=pp_url&entry.2035905306=${name}&entry.1821286102=${set}&entry.1725504223=${parallel}`;
  const modal = document.createElement("div");
  modal.id = "upload-modal";
  modal.className = "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50";

  modal.innerHTML = `
    <div id="upload-modal-content" class='bg-white rounded-lg overflow-hidden relative max-w-3xl w-full p-4'>
      <button onclick="document.getElementById('upload-modal').remove()" class='absolute top-2 right-2 text-black font-bold text-xl'>&times;</button>
      <iframe src="${decodeURIComponent(formURL)}" class="w-full h-[80vh]" frameborder="0"></iframe>
    </div>
  `;

  modal.addEventListener("click", function (e) {
    if (!document.getElementById("upload-modal-content").contains(e.target)) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}

function openFormModal(name, set, parallel) {
  const formURL = `https://docs.google.com/forms/d/e/1FAIpQLScFt9f75Xchd_yULG6pHugMq2M1XIhnvrMlgpXYgO5ZuoiOUA/viewform?usp=pp_url&entry.1210774333=${name}&entry.1518563894=${set}&entry.600233611=${parallel}`;
  const modal = document.createElement("div");
  modal.id = "form-modal";
  modal.className = "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50";

  modal.innerHTML = `
    <div id="form-modal-content" class='bg-white rounded-lg overflow-hidden relative max-w-3xl w-full p-4'>
      <button onclick="document.getElementById('form-modal').remove()" class='absolute top-2 right-2 text-black font-bold text-xl'>&times;</button>
      <iframe src="${decodeURIComponent(formURL)}" class="w-full h-[80vh]" frameborder="0"></iframe>
    </div>
  `;

  modal.addEventListener("click", function (e) {
    if (!document.getElementById("form-modal-content").contains(e.target)) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}