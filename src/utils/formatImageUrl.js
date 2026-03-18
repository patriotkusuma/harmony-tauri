/**
 * Utility to format image URLs from the backend.
 * Adds base URL if the path is relative.
 * 
 * @param {string} url - The image path or URL
 * @returns {string|null} - Formatted image URL
 */
export const formatImageUrl = (url) => {
  if (!url) return null;
  
  // If it's already a full URL or base64 data, return as is
  if (url.startsWith("http") || url.startsWith("data:")) {
    return url;
  }
  
  // Ensure the relative path starts with /
  const path = url.startsWith("/") ? url : `/${url}`;
  
  // Return with base URL
  return `https://go.harmonylaundry.my.id${path}`;
};
