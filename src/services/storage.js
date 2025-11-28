const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }
});

const bucketName = process.env.GCS_BUCKET_NAME;

/**
 * Upload a base64 image to Google Cloud Storage
 * @param {string} base64Image - Base64 encoded image (with or without data URL prefix)
 * @param {string} filename - Filename to save as
 * @returns {Promise<string>} Public URL of the uploaded image
 */
async function uploadImage(base64Image, filename) {
  // Strip data URL prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');
  
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  // Upload the image
  await file.save(imageBuffer, {
    metadata: {
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000' // Cache for 1 year
    },
    public: true // Make publicly accessible
  });

  // Return public URL
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
  
  console.log(`[Storage] Uploaded image: ${publicUrl}`);
  
  return publicUrl;
}

/**
 * Delete an image from Google Cloud Storage
 * @param {string} filename - Filename to delete
 */
async function deleteImage(filename) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);
  
  try {
    await file.delete();
    console.log(`[Storage] Deleted image: ${filename}`);
  } catch (error) {
    console.error(`[Storage] Error deleting image: ${filename}`, error);
  }
}

module.exports = { uploadImage, deleteImage };
