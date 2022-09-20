import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FilesProps, ScenesProps } from "../../utils/Interfaces";

import {
  Container,
  Content,
  TitleRow,
  TitleWrapper,
  Title,
  Subtitle,
  IconButton,
  TrashIcon,
  FileContent,
  AddSceneButton,
  AddSceneButtonTitle,
  DescriptionContent,
  SceneInput,
} from "./styles";
import { AVPlaybackStatusToSet, Video } from "expo-av";
import api, { libraryBaseUrl } from "../../services/api";
import { useFocusEffect } from "@react-navigation/native";
import { getFiles } from "../../services/getFiles";
import { ProjectInput } from "../ProjectInput";
import { ButtonCustom } from "../ButtonCustom";

interface SceneModalProps {
  handleCloseSceneModal: () => void;
  sceneModalVisible: boolean;
  handleGoToProjectCloudMovie: (scene: ScenesProps) => void;
  handleDeleteScene: () => void;
  scene: ScenesProps;
  userId: number;
  projectId: number;
  projectStatus: string;
  handleSaveSceneDescription: (descriptionAux) => void;
}

export function SceneModal({
  handleCloseSceneModal,
  sceneModalVisible,
  handleGoToProjectCloudMovie,
  handleDeleteScene,
  scene,
  userId,
  projectId,
  projectStatus,
  handleSaveSceneDescription,
}: SceneModalProps) {
  const theme = useTheme();
  const video = React.useRef(null);

  const [fileChosen, setFileChosen] = useState({} as FilesProps);
  const [status, setStatus] = React.useState<AVPlaybackStatusToSet>({});
  const [descriptionAux, setDescriptionAux] = useState("");

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // console.log(`scene.descrição -> ${scene.descricao}`);
      setDescriptionAux(scene.descricao ? scene.descricao : "");
      async function getFile() {
        await getFiles(userId)
          .then((result) => {
            if (result.result === "Success") {
              let findFile = result.libraryFiles.find(
                (element) => element.file_id === scene.file_id
              );

              if (findFile) {
                setFileChosen(findFile);
                setLoading(false);
              } else {
                setLoading(false);
                setFileChosen({} as FilesProps);
              }
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(`@SceneModal -> Catch UseFocusEffect -> ${err}`);
          });
      }

      getFile();
    }, [scene])
  );

  function alertDeleteScene() {
    Alert.alert(`Excluir cena`, `Tem certeza que deseja excluir esta cena?`, [
      {
        text: "Sim, quero excluir",
        onPress: () => handleDeleteScene(),
        style: "destructive",
      },
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      // visible={sceneModalVisible}
      // onRequestClose={handleCloseSceneModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container style={styles(theme).fileModalView}>
          <TouchableOpacity
            style={styles(theme).modalCloseButton}
            onPress={handleCloseSceneModal}
          >
            <MaterialCommunityIcons
              name="close"
              style={styles(theme).closeIcon}
            />
          </TouchableOpacity>

          <Content
            // behavior={Platform.OS === "ios" ? "padding" : "height"}
            // style={{ flex: 1 }}
          >
            <TitleRow>
              <TitleWrapper>
                <Title>Cena {scene.post_order_no}</Title>
                <Subtitle>Conte-nos como você quer sua cena</Subtitle>
              </TitleWrapper>
              <IconButton 
                onPress={alertDeleteScene}
                disabled={projectStatus != 'Rascunho'}
              >
                <TrashIcon name="trash" style={{color: projectStatus === 'Rascunho' ? theme.colors.primary : theme.colors.text}}/>
              </IconButton>
            </TitleRow>

           
            <DescriptionContent>
              <Title>Descrição da cena</Title>
              <SceneInput
                autoCapitalize="sentences"
                onChangeText={setDescriptionAux}
                maxLength={600}
                multiline
                value={descriptionAux}
                placeholder="Descreva aqui o que você deseja na cena"
                placeholderTextColor={theme.colors.primary_light}
                
              />
              <Subtitle style={{ color: theme.colors.attention }}>
                {descriptionAux.length}/600 caracteres
              </Subtitle>

                <TouchableOpacity
                  onPress={() => handleSaveSceneDescription(descriptionAux)}
                  style={[styles(theme).saveButton, {backgroundColor: projectStatus === 'Rascunho' ? theme.colors.secondary : theme.colors.text}]}
                  disabled={projectStatus != 'Rascunho'}
                >
                  <Text style={styles(theme).textButton}>Salvar Descrição</Text>
                </TouchableOpacity>
              </DescriptionContent>
              
            <FileContent>
              {fileChosen.file_id ? (
                <View style={styles(theme).fileContentView}>
                  <AddSceneButton
                    onPress={handleGoToProjectCloudMovie}
                    style={{ marginBottom: 10 }}
                  >
                    <AddSceneButtonTitle>
                      Substituir arquivo da cena
                    </AddSceneButtonTitle>
                  </AddSceneButton>
                  {fileChosen.file_type === "video" ? (
                    <Video
                      ref={video}
                      style={styles(theme).video}
                      source={{
                        uri: encodeURI(
                          `${libraryBaseUrl}/${userId}/${fileChosen.file_name}`
                        ),
                      }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                    />
                  ) : fileChosen.file_type === "image" ? (
                    imageLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <Image
                        style={styles(theme).image}
                        source={{
                          uri: `${libraryBaseUrl}/${userId}/thumbnails/${fileChosen.file_thumb}`,
                        }}
                        // onLoadStart={() => setImageLoading(true)}
                        // onLoadEnd={() => setImageLoading(false)}
                      />
                    )
                  ) : null}
                  <Subtitle style={{ marginTop: 10 }}>
                    {fileChosen.file_name}
                  </Subtitle>
                </View>
              ) : (
                <AddSceneButton onPress={handleGoToProjectCloudMovie}>
                  <AddSceneButtonTitle>
                    Adicionar Arquivo na cena
                  </AddSceneButtonTitle>
                </AddSceneButton>
              )}
            </FileContent>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    fileModalView: {
      position: "absolute",
      bottom: 0,
      height: "90%",
      width: "100%",
      paddingBottom: "20%",
      backgroundColor: theme.colors.shape,
      borderRadius: 50,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalCloseButton: {
      position: "absolute",
      top: 10,
      right: 20,
      padding: 10,
    },
    closeIcon: {
      fontFamily: theme.fonts.poppins_regular,
      fontSize: 30,
      color: theme.colors.text,
    },

    video: {
      flex: 3,
      alignSelf: "center",
      width: "90%",
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      flex: 1,
      fontFamily: theme.fonts.poppins_semi_bold,
      fontSize: 15,
      color: theme.colors.primary,
      marginTop: 60,
      marginLeft: 20,
    },
    image: {
      alignSelf: "center",
      width: "100%",
      height: "90%",
      resizeMode: "contain",
    },
    textInput: {
      flex: 2,
      width: "90%",
      alignSelf: "center",
      borderStyle: "solid",
      borderColor: theme.colors.primary,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonsView: {
      flex: 2,
      flexDirection: "row",
      width: "80%",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "space-between",
    },
    editDescriptionButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    AttachButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.highlight,
    },
    DetachButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.attention,
    },
    textButton: {
      fontFamily: theme.fonts.poppins_medium,
      fontSize: 13,
      color: theme.colors.shape,
      textAlign: "center",
    },
    fileContentView: {
      width: "100%",
      flex: 2,
      maxHeight: "80%",
      // backgroundColor: theme.colors.attention,
      alignItems: "center",
    },
    saveButton: {
      marginTop: 30,
      width: "70%",
      padding: 10,
      alignSelf: "center",
      borderRadius: 50,
      
    },
  });
