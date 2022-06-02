import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../Screens/Login';


const { Navigator, Screen} = createNativeStackNavigator();

export function StackRoutes() {
    return (
        <Navigator screenOptions={{headerShown: false}}>
            <Screen 
                name='Login'
                component={Login}
            />
            
        </Navigator>
    )
}