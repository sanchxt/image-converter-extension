document.addEventListener("DOMContentLoaded", () => {
  const imageSourceSelect = document.getElementById("image-src");
  const urlInputDiv = document.getElementById("url-input");
  const fileInputDiv = document.getElementById("file-input");
  const convertButton = document.getElementById("convert-btn");
  const imageUrlInput = document.getElementById("image-url");
  const imageFileInput = document.getElementById("image-file");
  const statusDiv = document.getElementById("status");

  imageFileInput.addEventListener("change", () => {
    const fileName = imageFileInput.files[0].name;
    document.getElementById("file-name").textContent = fileName;
  });

  imageSourceSelect.addEventListener("change", () => {
    if (imageSourceSelect.value === "url") {
      urlInputDiv.style.display = "block";
      fileInputDiv.style.display = "none";
    } else {
      urlInputDiv.style.display = "none";
      fileInputDiv.style.display = "flex";
    }
  });

  convertButton.addEventListener("click", () => {
    const imageSource = imageSourceSelect.value;
    const format = document.querySelector(
      "input[name='img-format']:checked"
    ).id;

    if (imageSource === "url") {
      const imageUrl = imageUrlInput.value;
      if (!imageUrl) {
        statusDiv.textContent = "Please enter an image URL";
        return;
      }
      convertAndDownload(imageUrl, format, "url");
    } else {
      const imageFile = imageFileInput.files[0];
      if (!imageFile) {
        statusDiv.textContent = "Please select an image file";
        return;
      }
      convertAndDownload(imageFile, format, "file");
    }
  });

  async function convertAndDownload(imageSource, format, sourceType) {
    try {
      statusDiv.textContent = "Converting..";
      let img = new Image();
      if (sourceType === "url") {
        const response = await fetch(imageSource);
        const blob = await response.blob();
        img.src = URL.createObjectURL(blob);
      } else {
        img.src = URL.createObjectURL(imageSource);
      }

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      let mimeType;
      switch (format) {
        case "png":
          mimeType = "image/png";
          break;
        case "jpg":
          mimeType = "image/jpeg";
          break;
        case "webp":
          mimeType = "image/webp";
          break;
      }

      const convertedBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, mimeType);
      });

      const downloadUrl = URL.createObjectURL(convertedBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `ImageConverter.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      statusDiv.textContent = "Successfully converted!";
    } catch (error) {
      statusDiv.textContent = "Error: " + error.message;
    }
  }
});
