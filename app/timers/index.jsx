import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function TimersMenu() {
  return (
    <View>
      <Text>Timers</Text>
      <Link href="/timers/emilHang">Emil Hangs</Link>
      <Link href="/timers/repeaters">Repeaters</Link>
    </View>
  );
}
