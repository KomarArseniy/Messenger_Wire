const AVATAR_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#98D8C8',
  '#F06292',
  '#7986CB',
  '#9575CD',
  '#64B5F6',
  '#4DB6AC',
  '#81C784',
  '#FFD54F',
  '#FF8A65',
  '#A1887F',
  '#90A4AE',
];

export function getInitials(name: string | null): string {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);
  let initials = parts[0].charAt(0).toUpperCase();

  if (parts.length > 1) {
    initials += parts[parts.length - 1].charAt(0).toUpperCase();
  }

  return initials;
}

export function getColorFromName(name: string | null): string {
  if (!name) return '#0088cc';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
