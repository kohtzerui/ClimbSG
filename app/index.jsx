import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <Link href="/timers" style={styles.link}>Timer Options</Link>
      <Link href="/calendar" style={styles.link}>Events In Singapore</Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050509',
  },
  link: {
    fontSize: 20,
    color: 'white',
    padding: 12,
  },
});
