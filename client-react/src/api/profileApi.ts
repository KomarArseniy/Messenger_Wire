import { request } from '@/lib/httpClient';

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
