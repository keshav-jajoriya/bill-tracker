import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function Profile() {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Profile',
        });
    }, [navigation]);
    return (
        <View style={{padding: 20, backgroundColor: '#333333', flex: 1}}>
          <Text style={{color: '#fff', fontSize: 24}}>Profile</Text>
        </View>
    )
}
