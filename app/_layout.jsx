import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: "Timer"}}/> 
        </Stack>
    )
}

export default RootLayout

const styles = StyleSheet.create({
    
})