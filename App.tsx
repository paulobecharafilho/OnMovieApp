import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './src/styles/theme';
import { Routes } from './src/routes';
import { StripeProvider } from '@stripe/stripe-react-native';




import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';




export default function App() {

  const [userId, setUserId] = useState(0);

  const [stripePk, setStripePk] = useState('pk_live_51IoZSOB0sm9Byj0JwucOE5FaYN6YHiUpYxFOuoUC4li1oRkuD7euOUoxcRTQapVREqElZHTDRRQwJCwoQ9zZxDve0070cWm4Ld');
  const [stripePkTest, setStripePkTest] = useState('pk_test_51IoZSOB0sm9Byj0JBEcSNoBEMTCjYGefEiNW5Bx1kSx0gZ8zQ4HgtRWMoCjBYUIXuz9OMweB8DZpzylWD0brImhs00KOvijGPo');
  


  const [loadedFonts] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!loadedFonts) {
    return null
  }


  // Initialize Firebase
  // const firebaseConfig = {
  //   apiKey: "AIzaSyBpYwlmC79ZAlx3F4hpyvvBo6ky-7YMg50",
  //   authDomain: "onmovie-d9ad2.firebaseapp.com",
  //   projectId: "onmovie-d9ad2",
  //   storageBucket: "onmovie-d9ad2.appspot.com",
  //   messagingSenderId: "299313569305",
  //   appId: "1:299313569305:web:8ee119ecc3fa879cb05488",
  //   measurementId: "G-35MNN1SZ2M"
  // };

  // initializeApp(firebaseConfig);
  // const analytics = getAnalytics(pp);
 

  return (
    <StripeProvider
      publishableKey={stripePkTest}
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.onmovieapp" // required for Apple Pay
    >
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </StripeProvider>
  );
}
