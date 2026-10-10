import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadItems, timeAgo } from '../../lib/store';
import { COLORS, CATEGORY_META } from '../../lib/theme';

export default function ItemDetail() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadItems()
        .then((all) => setItem(all.find((i) => i.id === id) || null))
        .catch(() => {});
    }, [id])
  );

  function claim() {
    Alert.alert(
      'Claim this item',
      'To keep this fair for everyone:\n\n' +
        '1. Describe a hidden detail only the real owner would know (for example the name on the card, or what is inside the wallet).\n\n' +
        '2. Contact the finder: ' +
        (item.contactHint || 'see the post for details') +
        '\n\n' +
        '3. Meet at a public campus spot to hand it over.',
      [{ text: 'Got it' }]
    );
  }

  if (!item) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.muted}>Loading...</Text>
      </View>
    );
  }

  const meta = CATEGORY_META[item.category] || CATEGORY_META.Other;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoFallback, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.icon} size={64} color={meta.fg} />
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            {item.status === 'returned' && (
              <View style={styles.returnedBadge}>
                <Text style={styles.returnedText}>Returned</Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.muted} />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={15} color={COLORS.muted} />
            <Text style={styles.metaText}>
              Posted {timeAgo(item.createdAt)} · {item.category}
            </Text>
          </View>

          {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}

          {item.status !== 'returned' ? (
            <Pressable style={styles.claimBtn} onPress={claim}>
              <Text style={styles.claimText}>This is mine</Text>
            </Pressable>
          ) : (
            <Text style={styles.mutedCenter}>
              This item has been returned to its owner.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  muted: { color: COLORS.muted },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  backText: { marginLeft: 6, fontSize: 16, color: COLORS.ink, fontWeight: '600' },
  photo: { width: '100%', height: 280 },
  photoFallback: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.ink, flex: 1 },
  returnedBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  returnedText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { marginLeft: 6, fontSize: 14, color: COLORS.muted },
  desc: { marginTop: 16, fontSize: 15, color: COLORS.ink, lineHeight: 22 },
  claimBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  claimText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  mutedCenter: { textAlign: 'center', color: COLORS.muted, marginTop: 24 },
});
