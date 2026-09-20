const API_URL = import.meta.env.VITE_API_URL;

interface PresignedUrlResponse {
  uploadUrl: string;
  s3Key: string;
}

export async function getPresignedUrl(
  fileName: string,
  fileType: string,
  userId: string
): Promise<PresignedUrlResponse> {
  const response = await fetch(`${API_URL}/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, fileType, userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to get upload URL');
  }

  return response.json();
}

export async function uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to S3');
  }
}

export async function getViewUrl(s3Key: string): Promise<string> {
  const response = await fetch(`${API_URL}/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'get', s3Key }),
  });

  if (!response.ok) throw new Error('Failed to get view URL');
  const data = await response.json();
  return data.viewUrl;
}