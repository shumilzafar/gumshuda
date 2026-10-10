// Shared design tokens for Gumshuda.
export const COLORS = {
  bg: '#FAFAF7',
  card: '#FFFFFF',
  primary: '#1B5E3B',
  primaryDark: '#134A2E',
  ink: '#1C1C1A',
  muted: '#6E6E68',
  line: '#E7E7E1',
  danger: '#B3261E',
  dangerBg: '#FDECEA',
};

export const CATEGORIES = [
  'ID Cards',
  'Electronics',
  'Wallets',
  'Keys',
  'Stationery',
  'Other',
];

// Icon + tint per category, used for the photo placeholder blocks.
export const CATEGORY_META = {
  'ID Cards': { icon: 'id-card', bg: '#DBEAFE', fg: '#1D4ED8' },
  'Electronics': { icon: 'phone-portrait', bg: '#E9D5FF', fg: '#7C3AED' },
  'Wallets': { icon: 'wallet', bg: '#FEF3C7', fg: '#B45309' },
  'Keys': { icon: 'key', bg: '#D1FAE5', fg: '#047857' },
  'Stationery': { icon: 'pencil', bg: '#FCE7F3', fg: '#BE185D' },
  'Other': { icon: 'cube', bg: '#E8E8E3', fg: '#57574F' },
};
