import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TimersMenu() {
  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
            <Text style={styles.rowText}>Timers</Text>
            <Link style={styles.rowText} href="/timers/emilHang">Emil Hangs</Link>
            <Link style={styles.rowText} href="/timers/repeaters">Repeaters</Link>
        </View>
    </SafeAreaView>
  );
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
  