// Local persistence layer for Gumshuda v1 (AsyncStorage).
// When the Firebase backend lands, replace these functions with
// Firestore calls. The screens only use this API, so nothing else changes.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seedItems } from './seed';

const KEY = '@gumshuda:items:v1';

export async function loadItems() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fall through to seeding
  }
  const seeded = seedItems();
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(seeded));
  } catch (e) {
    // storage unavailable, return seeds in memory
  }
  return seeded;
}

export async function saveItem(data) {
  const items = await loadItems();
  const item = {
    id: 'i' + Date.now().toString(36),
    status: 'open',
    mine: true,
    createdAt: Date.now(),
    imageUri: null,
    description: '',
    contactHint: '',
    ...data,
  };
  const next = [item, ...items];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return item;
}

export async function updateItem(id, patch) {
  const items = await loadItems();
  const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function deleteItem(id) {
  const items = await loadItems();
  const next = items.filter((it) => it.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24);
  if (d < 7) return d + 'd ago';
  return new Date(ts).toLocaleDateString();
}
