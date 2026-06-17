import { request } from '@/lib/httpClient';
import { API_BASE_URL } from '@/lib/config';

export type ProfileField = 'fullname' | 'username' | 'about';

interface UpdateFieldResponse {
  success: boolean;
  message: string;
}

export function updateProfileField(field: ProfileField, value: string) {
  return request<UpdateFieldResponse>(`/api/user/updateProfile/${field}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({ field, value }),
  });
}

interface UploadAvatarResponse {
  success: boolean;
  message: string;
  avatar_url?: string;
}

export async function uploadAvatar(
  file: File,
  token: string,
): Promise<UploadAvatarResponse> {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch(`${API_BASE_URL}/api/user/updateProfile/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    credentials: 'include',
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.message ?? 'Не удалось загрузить аватар');
  }
  return data;
}
