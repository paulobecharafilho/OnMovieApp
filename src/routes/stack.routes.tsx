import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../Screens/Login';
import { ForgotPassword } from '../Screens/ForgotPassword';
import { FirstPage } from '../Screens/FirstPage';
import { Register } from '../Screens/Register';
import { Typ } from '../Screens/Typ';
import { Home } from '../Screens/Home';
import { TabRoutes } from './tabs.routes';
import { MenuPage } from '../Screens/MenuPage';
import { NewProject } from '../Screens/NewProject';
import { MyProjects } from '../Screens/MyProjects';
import { MyOrders } from '../Screens/MyOrders';
import { ProjectDetails } from '../Screens/ProjectDetails';
import { ProjectCloudMovie } from '../Screens/ProjectCloudMovie';
import { FilesUploading } from '../Screens/FilesUploading';
import { CloudMovie } from '../Screens/CloudMovie';
import { ProjectDescriptionDetails } from '../Screens/ProjectDescriptionDetails';

interface Props {
    initialPage: string;
    userId?: number;
}

const { Navigator, Screen} = createNativeStackNavigator();

function InitialStackRoutes({initialPage, userId}: Props) {

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
                name='MenuPage'
                component={MenuPage}
            />
            <Screen 
                name='MyProjects'
                component={MyProjects}
            />
            <Screen 
                name='MyOrders'
                component={MyOrders}
            />
            <Screen 
                name='NewProject'
                component={NewProject}
            />
            <Screen 
                name='CloudMovie'
                component={CloudMovie}
            />
            <Screen 
                name='ProjectCloudMovie'
                component={ProjectCloudMovie}
            />
            <Screen 
                name='ProjectDetails'
                component={ProjectDetails}
            />
            <Screen 
                name='ProjectDescriptionDetails'
                component={ProjectDescriptionDetails}
            />
            
            <Screen 
                name='FilesUploading'
                component={FilesUploading}
            />
            
        </Navigator>
    )
}


export { InitialStackRoutes }