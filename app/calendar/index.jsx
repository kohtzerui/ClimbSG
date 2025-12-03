import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const COUNTRIES = [
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Indonesia',
  'Hong Kong'
]

export default function CalendarsIndex() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>SEA Climbing Calendars</Text>
        {COUNTRIES.map(name => {const slug = name.toLowerCase().replace(/\s+/g, '-')
          return (
            <Link key={slug} href={`/calendar/${slug}`} asChild>
              <Pressable style={styles.row}>
                <Text style={styles.rowText}>{name}</Text>
              </Pressable>
            </Link>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050509' },
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#27272f'
  },
  rowText: {
    color: '#e5e7eb',
    fontSize: 16
  }
})
