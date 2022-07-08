import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Login } from '../Screens/Login';
import { ForgotPassword } from '../Screens/ForgotPassword';
import { FirstPage } from '../Screens/FirstPage';

import { useTheme } from 'styled-components';
import { Platform } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { HomeStackRoutes, InitialStackRoutes } from './stack.routes';

import { Home } from '../Screens/Home';
import { MyProjects } from '../Screens/MyProjects';


const { Navigator, Screen} = createBottomTabNavigator();

export function TabRoutes() {
  const theme = useTheme();

    return (
        <Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.highlight,
            tabBarInactiveTintColor: theme.colors.shape,
            tabBarStyle: {
              height: 88,
              paddingVertical: Platform.OS === 'ios' ? 20: 0,
              backgroundColor: theme.colors.background_primary,
              position: 'absolute',
              borderTopWidth: 0,
              elevation: 0,
            }
          }}
        >
            <Screen 
                name='Início'
                component={Home}
                options={{
                  tabBarIcon: (({ size, color }) => 
                    <MaterialIcons
                      name="home"
                      size={size}
                      color={color}
                    />
                  )
                }}
            />
            <Screen 
                name='Projetos'
                component={MyProjects}
                options={{
                  tabBarIcon: (({ size, color }) => 
                    <MaterialIcons
                      name="movie-creation"
                      size={size}
                      color={color}
                    />
                  )
                }}
            />

        </Navigator>
    )
}
