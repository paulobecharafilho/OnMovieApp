import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Alert,
} from "react-native";
import { AssetsSelector } from 'expo-images-picker'
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AssetInfo, MediaType } from "expo-media-library";
import { useTheme } from "styled-components";
import { useRoute } from "@react-navigation/native";
import api from "../../services/api";


const ForceInset = {
  top: "never",
  bottom: "never",
};

// IOS users , make sure u can use the images uri to upload , if your getting invalid file path or u cant work with asset-library://
// Use = > getImageMetaData: true which will be little slower but give u also the absolute path of the Asset. just console loge the result to see the localUri

// See => https://docs.expo.dev/versions/latest/sdk/media-library/#assetinfo

interface Params {
  userId: number;
  projectId: number;
  setImagesToUpload: (mediaToUpload: MediaProps[]) => void;
  onHandleBack: () => void;
}

interface MediaProps extends AssetInfo {
  progress?: number;
  isUploaded?: boolean;
  token?: string;
}

export function MediaUpload({
  userId,
  projectId,
  setImagesToUpload,
  onHandleBack,
}: Params) {

  const theme = useTheme();
  const route = useRoute();


  function onHandleBackButton() {
    onHandleBack();
  }

  async function onSuccess(data: MediaProps[]) {
    
    let mediaToUpload: MediaProps[] = [];

    await Promise.all(data.map( async (element, index) => {

      await api
        .get(
          `check-exists.php?userId=${userId}&projectId=${projectId}&fileName=${element.filename}&token_key=${element.creationTime}`
        )
        .then((response) => {
          // console.log(`${response.data.result[0].response} proj_dep: ${response.data.result[0].fileInProject}`);
          if (response.data.result[0].response === 0) {
            let token = response.data.result[0].token;
            element.token = token;
            // console.log(`element ${element.filename} com token ${element.token}`);
            mediaToUpload.push(element);
          } else if (response.data.result[0].response === 1 || response.data.result[0].response === 2 || response.data.result[0].response === 3) {
            Alert.alert(`Arquivo já existente`, `o seu arquivo ${element.filename} já está na sua biblioteca. Para adicionar ao seu projeto, acesse seu CloudMovie!`)
          }
        })
        .catch((e) => console.log(`erro -> ${e}`));
    })) //Fim do Map com await Promise.all;

  
    // console.log(`mediaToUpload -> ${mediaToUpload}`)
    setImagesToUpload(mediaToUpload);
  }

  const widgetErrors = useMemo(
    () => ({
      errorTextColor: 'black',
      errorMessages: {
        hasErrorWithPermissions: 'Please Allow media gallery permissions.',
        hasErrorWithLoading: 'There was an error while loading images.',
        hasErrorWithResizing: 'There was an error while loading images.',
        hasNoAssets: 'No images found.',
      },
    }),
    []
  );

  const widgetSettings = useMemo(
    () => ({
      getImageMetaData: true, // true might perform slower results but gives meta data and absolute path for ios users
      initialLoad: 100,
      assetsType: [MediaType.photo, MediaType.video],
      minSelection: 1,
      maxSelection: 100,
      portraitCols: 4,
      landscapeCols: 4,
    }),
    []
  );

  const widgetResize = useMemo(
    () => ({
      width: 50,
      compress: 0.7,
      base64: false,
      saveTo: 'jpeg',
    }),
    []
  );

  const _textStyle = {
    color: 'white',
  };

  const _buttonStyle = {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
  };

  const widgetNavigator = useMemo(
    () => ({
      Texts: {
        finish: 'Finalizar',
        back: 'Voltar',
        selected: 'selecionado(s)',
      },
      midTextColor: 'black',
      minSelection: 1,
      buttonTextStyle: _textStyle,
      buttonStyle: _buttonStyle,
      onBack: () => {onHandleBackButton()},
      onSuccess: (e: any) => onSuccess(e),
    }),
    []
  );

  const widgetStyles = useMemo(
    () => ({
      margin: 2,
      bgColor: 'white',
      spinnerColor: 'blue',
      widgetWidth: 99,
      videoIcon: {
        Component: Ionicons,
        iconName: 'ios-videocam',
        color: theme.colors.shape,
        size: 20,
      },
      selectedIcon: {
        Component: Ionicons,
        iconName: 'ios-checkmark-circle-outline',
        color: 'white',
        bg: theme.colors.primary_light,
        size: 26,
      },
    }),
    []
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView forceInset={ForceInset} style={styles.container}>
        {/* <StatusBarPlaceHolder /> */}
        <StatusBar 
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.container}>
          <AssetsSelector
            Settings={widgetSettings}
            Errors={widgetErrors}
            Styles={widgetStyles}
            Navigator={widgetNavigator}
            // Resize={widgetResize} know how to use first , perform slower results.
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

