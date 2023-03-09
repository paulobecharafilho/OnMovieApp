import React, { useCallback, useState } from "react";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "styled-components";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { AssetInfo } from "expo-media-library";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as Progress from "react-native-progress";
import { MediaUpload } from "../../Components/MediaUpload";
import { DocumentPickerResponse } from "react-native-document-picker";
import { uploadFile } from "../../services/uploadFile";
import { uploadMedia } from "../../services/uploadMedia";
import * as ImagePicker from "expo-image-picker";
import api from "../../services/api";
import { checkFileExists } from "../../services/checkFileExists";

interface DocumentProps extends DocumentPickerResponse {
  token?: string;
  progress?: number;
}

interface Params {
  userId: number;
  projectId: number;
  type: string;
  files?: DocumentProps[];
}

interface MediaProps extends ImagePicker.ImageInfo {
  progress?: number;
  isUploaded?: boolean;
  token?: string;
}

const ForceInset = {
  top: "never",
  bottom: "never",
};

interface CheckExistsResult {
  result: string;
  token?: string;
  error?: string;
}

export function FilesUploading({ navigation }) {
  const theme = useTheme();
  const route = useRoute();
  const { userId, projectId, files, type } = route.params as Params;

  const [mediaToUpload, setMediaToUpload] = useState<MediaProps[]>([]);
  const [mediaUploading, setMediaUploading] = useState<ImagePicker.ImageInfo>();
  const [mediaUploadingTask, setMediaUploadingTask] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingMomment, setUploadingMomment] = useState("");
  const [progress, setProgress] = useState(0);

  const [fileUploading, setFileUploading] = useState<DocumentProps>();
  const [isMediaSelected, setIsMediaSelected] = useState(false);
  const [fileType, setFileType] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function startUploading() {
        if (!mediaToUpload[0] && type === "gallery") {
          // console.log(`Indo para galeria`);
          setFileType("gallery");
          setIsMediaSelected(false);

          pickImage();
        } else if (type === "documents" && files) {
          setIsMediaSelected(true);
          setUploadingMomment("uploading");

          let filesUploadAux: DocumentProps[] = [];

          const result = await uploadFile(
            files,
            setFileUploading,
            userId,
            projectId
          );

          for (let resultItem of result) {
            if (resultItem.error) {
              Alert.alert(
                `Erro`,
                `Não foi possível fazer o upload do arquivo: ${resultItem.filename}`
              );
            }
          }
          navigation.goBack();
        } else {
          setIsMediaSelected(true);
          setUploadingMomment("uploading");

          // const result = await uploadMedia({
          //   mediaToUpload,
          //   userId,
          //   projectId,
          //   setProgress,
          //   setMediaUploadingTask,
          //   setUploadingMomment,
          // });

          // for (let resultItem of result) {
          //   if (resultItem.error) {
          //     Alert.alert(
          //       `Erro`,
          //       `Não foi possível fazer o upload do arquivo: ${resultItem.filename}`
          //     );
          //   }
          // }

          // navigation.goBack();
        }
      }

      startUploading();
    }, [mediaToUpload])
  );

  function handleUploadMoreFiles() {
    setMediaToUpload([]);
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      allowsEditing: false,
      aspect: [5, 4],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      let mediaUploadingAtMoment: MediaProps = null;
      setMediaToUpload(result.selected);
      

      //  console.log(`Images Picked from ImagePicker -> `, result.selected);

      /*
      result.selected.map(async (item: MediaProps, index) => {
        // console.log(`Image Picked -> `, item);

        await checkFileExists(
          userId,
          projectId,
          item.fileName,
          item.assetId.split("/")[0]
        ).then(async (response) => {
          console.log(`Response -> `, response)
          if (response.result === "Success") {
            mediaUploadingAtMoment = item;
            mediaUploadingAtMoment.token = response.token;
            
            console.log(
              `@FilesUploading -> chamando função MediaUpload do arquivo ${item.fileName}`
            );

            await uploadMedia({
              mediaToUpload: mediaUploadingAtMoment,
              userId,
              projectId,
              index,
              setProgress,
              setMediaUploading,
              setMediaUploadingTask,
            })
            .then((resposta) => {
              if (resposta.response === 'Success') {
                console.log(`Upload realizado com sucesso -> `, resposta)
              } else {
                console.log(`algum erro aconteceu -> `, resposta)
              }
            })
            .catch(e => console.log(`Algum erro aconteceu no Upload Media -> ${e}`))


          } else if (response.result === "FileExists") {
            console.log(
              `O arquivo ${item.fileName} já existe na sua biblioteca. Por favor adicione pelo CloudMovie`
            );
          } else {
            console.log(`Algum erro existiu: ${response.error}`);
          }
        });
      });

      */


      for (let [index, item] of result.selected.entries()) {
        await checkFileExists(
          userId,
          projectId,
          item.fileName,
          item.assetId.split("/")[0]
        ).then(async (response) => {
          console.log(`Response -> `, response)
          if (response.result === "Success") {
            mediaUploadingAtMoment = item;
            mediaUploadingAtMoment.token = response.token;
            
            console.log(
              `@FilesUploading -> chamando função MediaUpload do arquivo ${item.fileName}`
            );

            await uploadMedia({
              mediaToUpload: mediaUploadingAtMoment,
              userId,
              projectId,
              index: index,
              setProgress,
              setMediaUploading,
              setMediaUploadingTask,
            })
            .then((resposta) => {
              if (resposta.response === 'Success') {
                console.log(`Upload realizado com sucesso -> `, resposta)
                
                if (index === result.selected.length - 1) {
                  console.log(`Último arquivo finalizado!`)
                  navigation.goBack();
                }
              } else {
                console.log(`algum erro aconteceu -> `, resposta)
              }
            })
            .catch(e => console.log(`Algum erro aconteceu no Upload Media -> ${e}`))


          } else if (response.result === "FileExists") {
            Alert.alert(`Arquivo Existente`, `Este arquivo já existe na sua biblioteca. Por favor, adicione ao projeto pelo CloudMovie`);
            if (index === result.selected.length -1) {
              console.log(`Último arquivo já existia`);
              navigation.goBack();
            }

            
          } else {
            console.log(`Algum erro existiu: ${response.error}`);
          }
        });
      }

      setIsMediaSelected(true);
    } else {
      navigation.goBack();
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView forceInset={ForceInset} style={styles(theme).container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles(theme).container}>
          {!isMediaSelected && fileType === "gallery" ? (
            // <MediaUpload
            //   userId={userId}
            //   projectId={projectId}
            //   setImagesToUpload={setMediaToUpload}
            //   onHandleBack={() => navigation.goBack()}
            // />
            <Text>Imagens Selecionadas!</Text>
          ) : (
            <View style={styles(theme).viewContainer}>
              {/* <Button title="UploadMoreFiles" onPress={handleUploadMoreFiles} /> */}
              <Text style={styles(theme).text}>
                Upload em Andamento {"\n"}
                {"\n"}
              </Text>
              {isMediaSelected && type === "gallery"
                ? mediaToUpload.map((item, index) => (
                    <View key={item.assetId} style={styles(theme).viewLine}>
                      <View>
                        <Text style={{ color: theme.colors.shape }}>
                          {item.fileName} - {item.progress}%
                        </Text>
                        <Progress.Bar
                          color={theme.colors.highlight}
                          progress={
                            mediaUploading && mediaUploading.assetId === item.assetId
                              ? mediaUploading.progress / 100
                              : item.progress
                          }
                        />
                      </View>
                      {item.progress < 100 ? (
                        <TouchableOpacity
                          onPress={() => {
                            mediaUploadingTask.cancelAsync();
                          }}
                        >
                          <MaterialCommunityIcons
                            name="window-close"
                            size={25}
                            style={{ color: theme.colors.attention }}
                          />
                        </TouchableOpacity>
                      ) : null}
                      <Text>{"\n"}</Text>
                    </View>
                  ))
                : type === "documents"
                ? files.map((item, index) => (
                    <View key={item.name}>
                      <Text style={styles(theme).text}>
                        {item.name}: {item.progress}%
                      </Text>
                      <Progress.Bar
                        progress={
                          fileUploading && fileUploading.name === item.name
                            ? fileUploading.progress / 100
                            : item.progress
                        }
                      />
                      <Text>{"\n"}</Text>
                    </View>
                  ))
                : null}
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background_primary,
      paddingVertical: 30,
    },
    viewContainer: {
      flex: 1,
      backgroundColor: theme.colors.background_primary,
      paddingHorizontal: 30,
    },
    text: {
      fontFamily: theme.fonts.poppins_medium,
      fontSize: 12,
      color: theme.colors.shape,
    },
    viewLine: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
