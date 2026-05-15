// ─── API ────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ─── Images ─────────────────────────────────────────────────
export const DEFAULT_FOOD_IMAGE  = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';
export const DEFAULT_HERO_IMAGE  = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=80';
export const DEFAULT_FRIDGE_IMAGE = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';
export const DEFAULT_RECIPE_IMAGE = DEFAULT_FOOD_IMAGE;

// ─── Colors — Fresh Harvest Design System ───────────────────
export const COLORS = {
  // Primary: Deep forest green
  primary:        '#396938',
  primaryDark:    '#215023',
  primaryLight:   '#baf0b3',
  primaryContainer: '#c8ffc0',

  // Secondary: Warm mauve-pink
  secondary:      '#735858',
  secondaryLight: '#ffdada',

  // Tertiary: Mid-tone green
  tertiary:       '#40683e',
  tertiaryLight:  '#cefdc7',

  // Surface / Background
  surface:        '#f7faf3',
  surfaceVariant: '#e0e3dd',
  surfaceContainer: '#ecefe8',
  background:     '#f7faf3',

  // Text
  onSurface:        '#191d19',
  onSurfaceVariant: '#42493f',
  outline:          '#72796e',
  outlineVariant:   '#c1c9bc',

  // Legacy aliases (used in JSX components)
  rose900:        '#191d19',   // was dark text, keep dark
  rose700:        '#215023',   // was accent, now primary dark
  roseLight:      '#c8ffc0',   // was rose light, now green light
  roseExtraLight: '#f7faf3',   // was rose extra light, now surface

  // Utility
  slate:          '#42493f',
  slate400:       '#72796e',
  white:          '#ffffff',
  error:          '#ba1a1a',
};

// ─── Recipe options ──────────────────────────────────────────
export const DIFFICULTIES = ['Dễ', 'Trung bình', 'Khó'];

export const TAGS = [
  'Tất cả',
  'Truyền thống',
  'Món Mặn',
  'Món Nước',
  'Hải sản',
  'Ăn kiêng',
  'Ăn chay',
  'Siêu Tốc',
];

export const SORT_OPTIONS = [
  { value: 'Recommended', label: 'Gợi ý' },
  { value: 'Newest',      label: 'Mới nhất' },
  { value: 'Top Rated',   label: 'Đánh giá cao' },
];

// ─── Shopping / Fridge units ─────────────────────────────────
export const UNITS = ['g', 'kg', 'ml', 'l', 'quả', 'củ', 'bó', 'thìa', 'muỗng', 'chén', 'ly'];
