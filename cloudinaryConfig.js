// Cloudinary Configuration
// Get your credentials from: https://console.cloudinary.com/

// WARNING: DO NOT expose API Secret in client-side code!
// Only cloudName and uploadPreset should be public.
// API Key and Secret should ONLY be used server-side.

export const cloudinaryConfig = {
  cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset',
  // Note: We use unsigned uploads via upload preset (no API key/secret needed)
  // For signed operations (delete, admin), use a backend API
};

/**
 * Generate Cloudinary signature for secure uploads
 * Note: In production, signatures should be generated server-side
 */
export const generateSignature = (paramsToSign) => {
  // This should be done server-side in production
  // For now, we'll use unsigned uploads with upload preset
  return null;
};

/**
 * Get Cloudinary upload URL
 */
export const getUploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;
};

/**
 * Get Cloudinary resource URL
 */
export const getResourceUrl = (publicId, options = {}) => {
  const { format = 'pdf', flags = '' } = options;
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${flags}${publicId}.${format}`;
};

export default cloudinaryConfig;



