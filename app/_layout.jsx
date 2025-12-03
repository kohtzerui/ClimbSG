import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: "Home Page"}}/>
            
            <Stack.Screen name="timers/index" options={{title: "Timer Page"}}/>
            <Stack.Screen name="timers/emilHang" options={{title: "Emil Hang"}}/> 
            <Stack.Screen name="timers/repeaters" options={{title: "Repeaters"}}/>  
        </Stack>
    )
}

export default RootLayout

const styles = StyleSheet.create({
    
})