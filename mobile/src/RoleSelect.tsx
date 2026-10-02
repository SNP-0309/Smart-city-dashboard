import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const colors = { bg: '#07111f', card: '#0d1b2e', line: '#1e3550', text: '#f3f7fb', muted: '#8ca0b8', cyan: '#31d7f4', blue: '#5796ff', purple: '#aa8bfa' };

export default function RoleSelectScreen({ onSelect }: { onSelect: (role: 'citizen' | 'admin') => void }) {
  return <View style={styles.screen}><View style={styles.brandMark}><Ionicons name="flash" size={25} color="#fff" /></View><Text style={styles.brand}>MetroCity AI</Text><Text style={styles.subtitle}>NALASOPARA CIVIC PLATFORM</Text><Text style={styles.title}>Choose your workspace</Text><Text style={styles.copy}>The same project supports two secure experiences with different permissions.</Text><Pressable style={styles.card} onPress={() => onSelect('citizen')}><View style={[styles.icon, { backgroundColor: `${colors.cyan}18` }]}><Ionicons name="people-outline" size={25} color={colors.cyan} /></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>Citizen app</Text><Text style={styles.cardCopy}>Report issues, use the map, track repairs, and confirm when work is complete.</Text></View><Ionicons name="chevron-forward" size={20} color={colors.cyan} /></Pressable><Pressable style={styles.card} onPress={() => onSelect('admin')}><View style={[styles.icon, { backgroundColor: `${colors.purple}18` }]}><Ionicons name="shield-checkmark-outline" size={25} color={colors.purple} /></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>Municipal admin</Text><Text style={styles.cardCopy}>Verify reports, assign workers, upload evidence, and manage the resolution workflow.</Text></View><Ionicons name="chevron-forward" size={20} color={colors.purple} /></Pressable><View style={styles.note}><Ionicons name="information-circle-outline" size={16} color={colors.muted} /><Text style={styles.noteText}>Demo mode: admin and citizen accounts use protected role tokens. Replace these with real authentication before production.</Text></View></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' },
  brandMark: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 13 },
  brand: { color: colors.text, textAlign: 'center', fontWeight: '900', fontSize: 25 },
  subtitle: { color: colors.muted, textAlign: 'center', fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 5 },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 48, textAlign: 'center' },
  copy: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8, marginBottom: 22 },
  card: { minHeight: 112, padding: 16, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 11 },
  icon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  cardCopy: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 5 },
  note: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,.04)', marginTop: 10 },
  noteText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 15 },
});
