document.addEventListener("DOMContentLoaded", () => {
  const imageSourceSelect = document.getElementById("image-src");
  const urlInputDiv = document.getElementById("url-input");
  const fileInputDiv = document.getElementById("file-input");

  imageSourceSelect.addEventListener("change", () => {
    if (imageSourceSelect.value == "url") {
      urlInputDiv.style.display = "block";
      fileInputDiv.style.display = "none";
    } else {
      urlInputDiv.style.display = "none";
      fileInputDiv.style.display = "block";
    }
  });
});
