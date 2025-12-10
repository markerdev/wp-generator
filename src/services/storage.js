const { Storage } = require('@google-cloud/storage');

// Parse credentials from JSON secret file
let credentials;
try {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (credentialsJson) {
    credentials = JSON.parse(credentialsJson);
  }
} catch (error) {
  console.error('[Storage] Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', error.message);
}

// Initialize Google Cloud Storage
const storage = credentials ? new Storage({
  projectId: credentials.project_id,
  credentials: credentials
}) : null;

const bucketName = process.env.GCS_BUCKET_NAME || 'parvekelasitus-images';

/**
 * Upload a base64 image to Google Cloud Storage
 * @param {string} base64Image - Base64 encoded image (with or without data URL prefix)
 * @param {string} filename - Filename to save as
 * @returns {Promise<string>} Public URL of the uploaded image
 */
async function uploadImage(base64Image, filename) {
  if (!storage) {
    throw new Error('Google Cloud Storage not configured - missing credentials');
  }

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
  if (!storage) {
    console.error('[Storage] Cannot delete - storage not configured');
    return;
  }

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
