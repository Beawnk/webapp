import { useAlertStore } from "@/stores/alertStore";

const MAX_IMAGES = 3;
// Same limit as the report-images bucket (supabase/report-images-storage.sql)
const MAX_SIZE_MB = 5;

// fileImages: [{ file, preview }]. The files are uploaded to Storage on submit;
// preview is a local object URL for the thumbnail (revoke it when removed)
export function useHandleImages(fileImages, e) {
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

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alertStore.setFieldError("images", `Cada imagem pode ter no máximo ${MAX_SIZE_MB} MB.`);
      continue;
    }

    validImages.push({ file, preview: URL.createObjectURL(file) });
  }

  return [...fileImages, ...validImages];
}
