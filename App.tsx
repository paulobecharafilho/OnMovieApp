import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './src/styles/theme';
import { Routes } from './src/routes';


import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function App() {
  const [userId, setUserId] = useState(0);


  const [loadedFonts] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!loadedFonts) {
    return null
  }

  

  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
}
