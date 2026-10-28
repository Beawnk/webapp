import { supabase } from '@/lib/supabaseClient';

// Private bucket, see supabase/report-images-storage.sql
const BUCKET = 'report-images';
const SIGNED_URL_SECONDS = 60 * 60;

// Reports created before the Storage migration keep base64 data URLs in "Images"
const isDataUrl = (image) => image.startsWith('data:');

// Uploads to <user id>/<uuid>.<ext> (the policies only allow the user's own folder)
// and returns the storage paths. If one upload fails, removes the ones already sent.
export async function uploadReportImages(userId, files) {
  const paths = [];

  for (const file of files) {
    const extension = file.type === 'image/png' ? 'png' : 'jpg';
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
    });

    if (error) {
      await removeReportImages(paths);
      throw error;
    }
    paths.push(path);
  }

  return paths;
}

// Best effort: a leftover file is harmless, so failures are only logged
export async function removeReportImages(images = []) {
  const paths = images.filter((image) => !isDataUrl(image));
  if (!paths.length) return;

  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.error('Erro ao remover imagens:', error);
}

// Turns stored images into URLs an <img> can show: signed URLs for storage
// paths, data URLs as they are
export async function getReportImageUrls(images = []) {
  const paths = images.filter((image) => !isDataUrl(image));
  const signedUrls = {};

  if (paths.length) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(paths, SIGNED_URL_SECONDS);

    if (error) throw error;
    data.forEach((item) => {
      if (item.signedUrl) signedUrls[item.path] = item.signedUrl;
    });
  }

  return images.map((image) => (isDataUrl(image) ? image : signedUrls[image])).filter(Boolean);
}
