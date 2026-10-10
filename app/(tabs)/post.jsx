import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { saveItem } from '../../lib/store';
import { COLORS, CATEGORIES } from '../../lib/theme';

export default function PostScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Other');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactHint, setContactHint] = useState('');

  async function pickImage(useCamera) {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to attach a picture.');
      return;
    }
    const launcher = useCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;
    const res = await launcher({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets && res.assets[0]) {
      setImageUri(res.assets[0].uri);
    }
  }

  function choosePhoto() {
    Alert.alert('Add a photo', 'Show the item so the owner can spot it.', [
      { text: 'Camera', onPress: () => pickImage(true) },
      { text: 'Gallery', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function submit() {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Give the item a short title.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Missing location', 'Say where you found it.');
      return;
    }
    await saveItem({
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim(),
      contactHint: contactHint.trim(),
      imageUri,
    });
    setImageUri(null);
    setTitle('');
    setCategory('Other');
    setLocation('');
    setDescription('');
    setContactHint('');
    Alert.alert('Posted', 'Your found item is now visible to everyone on campus.');
    router.push('/');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Post a found item</Text>
        <Text style={styles.sub}>
          Took you 30 seconds to pick it up. Takes 30 seconds to post it.
        </Text>

        <Pressable style={styles.photoBox} onPress={choosePhoto}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoEmpty}>
              <Ionicons name="camera-outline" size={34} color={COLORS.primary} />
              <Text style={styles.photoEmptyText}>Add a photo</Text>
            </View>
          )}
        </Pressable>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Black wallet"
          placeholderTextColor={COLORS.muted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              style={[styles.chip, category === c && styles.chipActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Where did you find it?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Main library, 2nd floor"
          placeholderTextColor={COLORS.muted}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multi]}
          placeholder="Color, brand, any detail that helps"
          placeholderTextColor={COLORS.muted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>How can the owner reach you?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. WhatsApp on request, or room 214"
          placeholderTextColor={COLORS.muted}
          value={contactHint}
          onChangeText={setContactHint}
        />

        <Pressable style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>Post item</Text>
        </Pressable>

        <Text style={styles.note}>
          Tip: keep ID numbers and private details out of the photo and description.
          The real owner can describe them to prove it.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },
  heading: { fontSize: 24, fontWeight: '800', color: COLORS.ink },
  sub: { fontSize: 14, color: COLORS.muted, marginTop: 4, marginBottom: 16 },
  photoBox: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderStyle: 'dashed',
  },
  photo: { width: '100%', height: 200 },
  photoEmpty: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  photoEmptyText: { marginTop: 8, color: COLORS.primary, fontWeight: '600' },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.ink,
  },
  multi: { minHeight: 80, textAlignVertical: 'top' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.muted, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  submit: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  note: { fontSize: 12, color: COLORS.muted, marginTop: 14, lineHeight: 18 },
});
