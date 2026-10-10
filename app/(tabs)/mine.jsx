import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadItems, updateItem, deleteItem, timeAgo } from '../../lib/store';
import { COLORS, CATEGORY_META } from '../../lib/theme';

export default function MineScreen() {
  const [items, setItems] = useState([]);

  const refresh = useCallback(() => {
    loadItems()
      .then((all) => setItems(all.filter((i) => i.mine)))
      .catch(() => {});
  }, []);

  useFocusEffect(refresh);

  async function toggleReturned(item) {
    const next = item.status === 'returned' ? 'open' : 'returned';
    const all = await updateItem(item.id, { status: next });
    setItems(all.filter((i) => i.mine));
  }

  function confirmDelete(item) {
    Alert.alert('Delete post?', 'This will remove the item for everyone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const all = await deleteItem(item.id);
          setItems(all.filter((i) => i.mine));
        },
      },
    ]);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>My posts</Text>
        <Text style={styles.sub}>Items you found and posted.</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="albums-outline" size={40} color={COLORS.line} />
            <Text style={styles.emptyText}>You have not posted anything yet.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const meta = CATEGORY_META[item.category] || CATEGORY_META.Other;
          const returned = item.status === 'returned';
          return (
            <View style={styles.card}>
              <Pressable
                style={styles.cardMain}
                onPress={() => router.push(`/item/${item.id}`)}
              >
                <View style={[styles.thumb, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon} size={24} color={meta.fg} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardMeta} numberOfLines={1}>
                    {item.location} · {timeAgo(item.createdAt)}
                  </Text>
                  {returned && <Text style={styles.returnedLabel}>Marked returned</Text>}
                </View>
              </Pressable>
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionBtn, returned && styles.actionBtnDone]}
                  onPress={() => toggleReturned(item)}
                >
                  <Text style={styles.actionText}>
                    {returned ? 'Reopen' : 'Mark returned'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => confirmDelete(item)}
                >
                  <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 4 },
  heading: { fontSize: 24, fontWeight: '800', color: COLORS.ink },
  sub: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  card: {
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
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  cardMeta: { fontSize: 13, color: COLORS.muted, marginTop: 3 },
  returnedLabel: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 3,
  },
  actions: { flexDirection: 'row', marginTop: 10 },
  actionBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  actionBtnDone: { backgroundColor: COLORS.primary },
  actionText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  deleteBtn: { borderColor: COLORS.danger },
  deleteText: { color: COLORS.danger },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 12, color: COLORS.muted, fontSize: 14 },
});
