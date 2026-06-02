export interface User {
  id: number
  username: string | null
  email: string
  avatar_url: string | null
  status: string
  last_seen_at: string | null
  full_name: string | null
  about: string | null
}
