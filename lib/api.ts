const API_BASE_URL = ''; // Relative path for same-domain deployment

export async function getVideoInfo(url: string) {
  const response = await fetch(`${API_BASE_URL}/api/info?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch video info');
  }
  return response.json();
}

export function getDownloadUrl(url: string) {
  return `${API_BASE_URL}/api/download?url=${encodeURIComponent(url)}`;
}
