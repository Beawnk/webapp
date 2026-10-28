import { useAlertStore } from "@/stores/alertStore";

const MAX_IMAGES = 3;
const MAX_SIZE_MB = 2;

export async function useHandleImages(fileImages, e) {
  const alertStore = useAlertStore();
  // Only this field's error: clearing everything would also drop the global toasts
  alertStore.clearFieldError("images");
  const files = [...e.target.files];
  // Reset the input so picking the same file again still fires "change"
  e.target.value = "";

  if (fileImages.length + files.length > MAX_IMAGES) {
    alertStore.setFieldError("images", `Você só pode adicionar até ${MAX_IMAGES} imagens.`);
    return fileImages;
  }

  const validImages = [];

  for (const file of files) {
    // Check if the file is an image in PNG, JPG, or JPEG format
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alertStore.setFieldError(
        "images",
        "Apenas imagens em formato PNG, JPG, e JPEG são permitidas."
      );
      continue; // Skip invalid file
    }

    // Images are saved as base64 inside the report row, so big photos bloat it
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alertStore.setFieldError("images", `Cada imagem pode ter no máximo ${MAX_SIZE_MB} MB.`);
      continue;
    }

    // Read the file as a Data URL using FileReader
    const fileDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    validImages.push(fileDataUrl); // Add valid image
  }

  return [...fileImages, ...validImages];
}
