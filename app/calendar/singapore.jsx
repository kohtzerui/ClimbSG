// app/calendars/singapore.jsx
import React, { useMemo } from 'react'
import { View, Text, StyleSheet, SectionList } from 'react-native'
import { SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { SINGAPORE_EVENTS_2026 } from '../../assets/singapore2026logos'
import { Image } from 'react-native'

// ===== Inner screen component =====
function SingaporeCalendar() {
  // Group events by month/year for SectionList
  const sections = useMemo(() => {
    const byMonth = {}

    SINGAPORE_EVENTS_2026.forEach(event => {
      const d = new Date(event.startDate)
      const label = d.toLocaleString('en-SG', { month: 'long', year: 'numeric' })
      if (!byMonth[label]) byMonth[label] = []
      byMonth[label].push(event)
    })

    return Object.keys(byMonth)
      .sort((a, b) => {
        const [ma, ya] = a.split(' ')
        const [mb, yb] = b.split(' ')
        return new Date(`${ma} 1, ${ya}`) - new Date(`${mb} 1, ${yb}`)
      })
      .map(title => ({
        title,
        data: byMonth[title].sort(
          (a, b) => new Date(a.startDate) - new Date(b.endDate)
        )
      }))
  }, [])

  const formatDateRange = (startDate, endDate) => {
    if (!endDate || startDate === endDate) {
      const d = new Date(startDate)
      const day = d.getDate()
      const monthYear = d.toLocaleString('en-SG', {
        month: 'long',
        year: 'numeric'
      })
      return `${day} ${monthYear}` // "4 February 2026"
    }
  
    const start = new Date(startDate)
    const end = new Date(endDate)
  
    const sameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth()
  
    if (sameMonth) {
      const monthYear = start.toLocaleString('en-SG', {
        month: 'long',
        year: 'numeric'
      })
      return `${start.getDate()}–${end.getDate()} ${monthYear}` // "4–7 February 2026"
    }
  
    const startLabel = start.toLocaleString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
    const endLabel = end.toLocaleString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  
    return `${startLabel} – ${endLabel}`
  }
  

  const renderEvent = ({ item }) => {
    const d = new Date(item.startDate)
    const day = d.getDate()
    const weekday = d.toLocaleString('en-SG', { weekday: 'long' })
    const month = d.toLocaleString('en-SG', { month: 'long' })

    // For the logo circle – use series ("BFF", "BP", etc.) or fallback
    const logoLabel = item.series
    ? String(item.series).toUpperCase().slice(0, 3)
    : 'CL'
    const logoSource = item.logo || null

    const dateRangeLabel = formatDateRange(item.startDate, item.endDate)

    return (
      <View style={styles.eventRow}>
        {/* Logo + Date block */}
      <View style={styles.dateBlock}>
          <View style={styles.logoCircle}>
            {logoSource ? (
              <Image source={logoSource} style={styles.logoImage} />
            ) : (
              <Text style={styles.logoText}>{logoLabel}</Text>
            )}
          </View>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
          <Text style={styles.dateWeekday}>{weekday}</Text>
        </View>

        {/* Details */}
        <View style={styles.eventCard}>
          <Text style={styles.eventName}>{item.name}</Text>
          <Text style={styles.eventVenue}>{item.venue}</Text>
          <Text style={styles.eventOrganiser}>{item.organiser}</Text>
          <Text style={styles.eventCategories}>
            Categories: {item.categories.join(', ')}
          </Text>
          {item.notes ? <Text style={styles.eventNotes}>{item.notes}</Text> : null}
          {item.regStatus ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.regStatus}</Text>
            </View>
          ) : null}
        </View>
      </View>
    )
  }

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Singapore Climbing Comps</Text>
        <Text style={styles.headerSubtitle}>Upcoming events · 2026-2027</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderEvent}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No events added yet. Check back soon.
          </Text>
        }
      />

      <Link href="/calendar" style={styles.link}>
        ← All calendars
      </Link>
    </SafeAreaView>
  )
}

// ===== Exported screen wrapper =====
export default function SingaporeCalendarScreen() {
  return (
    <SafeAreaProvider>
      <SingaporeCalendar />
    </SafeAreaProvider>
  )
}

// ===== Styles =====
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050509' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white'
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 16
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 8
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d1d5db',
    textTransform: 'uppercase'
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  dateBlock: {
    width: 80,
    alignItems: 'center',
    paddingTop: 4
  },
  dateDay: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white'
  },
  dateMonth: {
    fontSize: 12,
    color: '#9ca3af'
  },
  dateWeekday: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2
  },
  eventCard: {
    flex: 1,
    backgroundColor: '#14141a',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  eventName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 2
  },
  eventVenue: {
    fontSize: 12,
    color: '#e5e7eb'
  },
  eventOrganiser: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2
  },
  eventCategories: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4
  },
  eventNotes: {
    fontSize: 11,
    color: '#c4b5fd',
    marginTop: 4
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#111827'
  },
  badgeText: {
    fontSize: 10,
    color: '#facc15',
    fontWeight: '600'
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 13
  },
  link: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 10,
    textAlign: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#27272f',
    backgroundColor: '#0b0b12'
  },
  logoCircle: {
    //#111827
    width: 49,
    height: 49,
    borderRadius: 999,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e5e7eb'
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 999
  },
  eventDateRange: {
    marginTop: 4,
    fontSize: 11,
    color: '#e5e7eb'
  },

})
