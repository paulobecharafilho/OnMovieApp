import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { InitialStackRoutes } from "./stack.routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Platform, Text } from "react-native";
import { useTheme } from "styled-components";

export function Routes() {

  const theme = useTheme();
  const [initialPage, setInitialPage] = useState("");
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    let userIdAux = 0;
    async function getUserFromStorage() {
      await AsyncStorage.getItem("@onmovieapp:userId").then((result) => {
        if (result === null) {
          setUserId(null);
          setInitialPage("FirstPage");
          setLoading(false)
        } else {
          setInitialPage("Home");
          setUserId(Number(result));
          userIdAux = Number(result);
          setLoading(false)
        }
      });
    }

    try {
      getUserFromStorage();
    } catch (error) {
      console.log(`erro -> ${error}`);
    }

  }, []);
  return (
    <NavigationContainer>
      {loading ? (
        <ActivityIndicator
          style={{ alignSelf: "center" }}
          color={theme.colors.secondary}
        />
      ) : (
        <InitialStackRoutes initialPage={initialPage} userId={userId} />
      )}
    </NavigationContainer>
  );
}

