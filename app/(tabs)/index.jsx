import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadItems, timeAgo } from '../../lib/store';
import { COLORS, CATEGORIES, CATEGORY_META } from '../../lib/theme';

function ItemCard({ item }) {
  const meta = CATEGORY_META[item.category] || CATEGORY_META.Other;
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/item/${item.id}`)}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon} size={30} color={meta.fg} />
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.status === 'returned' && (
            <View style={styles.returnedBadge}>
              <Text style={styles.returnedText}>Returned</Text>
            </View>
          )}
        </View>
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={13} color={COLORS.muted} />
          <Text style={styles.cardMetaText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <Text style={styles.cardTime}>
          {timeAgo(item.createdAt)} · {item.category}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
    </Pressable>
  );
}

export default function BrowseScreen() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');

  useFocusEffect(
    useCallback(() => {
      loadItems()
        .then(setItems)
        .catch(() => {});
    }, [])
  );

  const filtered = items.filter((it) => {
    const q = query.trim().toLowerCase();
    const okCat = cat === 'All' || it.category === cat;
    const hay = (it.title + ' ' + it.location + ' ' + (it.description || '')).toLowerCase();
    return okCat && (!q || hay.includes(q));
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.appName}>Gumshuda</Text>
        <Text style={styles.tagline}>Lost something on campus? It might be here.</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLORS.muted} />
        <TextInput
          style={styles.search}
          placeholder="Search items, places..."
          placeholderTextColor={COLORS.muted}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.muted} />
          </Pressable>
        )}
      </View>

      <View style={styles.chipsRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...CATEGORIES]}
          keyExtractor={(c) => c}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, cat === item && styles.chipActive]}
              onPress={() => setCat(item)}
            >
              <Text style={[styles.chipText, cat === item && styles.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={COLORS.line} />
            <Text style={styles.emptyText}>Nothing found. Try another search.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  appName: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  tagline: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  search: { flex: 1, marginLeft: 8, fontSize: 15, color: COLORS.ink },
  chipsRow: { marginTop: 12, paddingLeft: 20 },
  chip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.muted, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, marginLeft: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink, flex: 1 },
  returnedBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  returnedText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardMetaText: { fontSize: 13, color: COLORS.muted, marginLeft: 4, flex: 1 },
  cardTime: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 12, color: COLORS.muted, fontSize: 14 },
});
