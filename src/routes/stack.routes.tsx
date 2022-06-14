import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../Screens/Login';
import { ForgotPassword } from '../Screens/ForgotPassword';
import { FirstPage } from '../Screens/FirstPage';
import { Register } from '../Screens/Register';
import { Typ } from '../Screens/Typ';
import { MyProjects } from '../Screens/MyProjects';
import { Home } from '../Screens/Home';
import { TabRoutes } from './tabs.routes';


interface Props {
    initialPage: string;
    userId?: number;
}

const { Navigator, Screen} = createNativeStackNavigator();

function InitialStackRoutes({initialPage, userId}: Props) {
    console.log(`Started Stack Routes with userId = ${(userId)} and InitialPage: ${initialPage}`)

    return (
        <Navigator screenOptions={{headerShown: false,}} initialRouteName={initialPage}>
            <Screen 
                name='Login'
                component={Login}
            />
            <Screen 
                name='FirstPage'
                component={FirstPage}
            />
            <Screen 
                name='ForgotPassword'
                component={ForgotPassword}
            />
            <Screen 
                name='Register'
                component={Register}
            />
            <Screen 
                name='Typ'
                component={Typ}
            />
            <Screen 
                name='Home'
                component={Home}
            />
            <Screen 
                name='MyProjects'
                component={MyProjects}
            />
            
        </Navigator>
    )
}


export { InitialStackRoutes }