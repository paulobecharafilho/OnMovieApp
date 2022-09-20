import React, { useCallback, useState } from "react";
import {
  Button,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components";
import {
  Video,
  AVPlaybackStatus,
  VideoProps,
  AVPlaybackStatusToSet,
} from "expo-av";
import { FilesProps } from "../../utils/Interfaces";
import api, { libraryBaseUrl } from "../../services/api";
import { useFocusEffect } from "@react-navigation/native";
import { getFiles } from "../../services/getFiles";

const DocumentImage = require("../../assets/png/Documento.png");



interface FileAttatchedProps extends FilesProps {
  isAttachedToProject?: boolean;
}
interface Props {
  fileDetailsModalVisible: boolean;
  handleCloseFileDetailsModal: () => void;
  handleDetachFile?: () => void;
  handleAttachFile?: () => void;
  file: FileAttatchedProps;
  projectId?: number;
  userId: number;
  from: string;
  projectStatus?: string;
}

export function FileDetailsModal({
  file,
  projectId,
  userId,
  from,
  fileDetailsModalVisible,
  handleCloseFileDetailsModal,
  handleDetachFile,
  handleAttachFile,
  projectStatus
}: Props) {
  const theme = useTheme();

  const video = React.useRef(null);
  const [status, setStatus] = React.useState<AVPlaybackStatusToSet>({});
  const [newDescription, setNewDescription] = useState(file.description);

  useFocusEffect(
    useCallback(() => {
      // console.log(`@FileDetailsModal -> projectStatus -> ${projectStatus}`)
      async function getFileDescription() {
        await getFiles(userId).then((result) => {
          if (result.result === "Success") {
            let findFile = result.libraryFiles.find(
              (element) => element.file_id === file.file_id
            );

            file.description = findFile.description;
            setNewDescription(findFile.description);
          }
        });
      }

      if (from === "projectCloudMovie") {
        getFileDescription();
      }
    }, [])
  );

  async function updateDescription() {
    api.post(`proc_update_file_description.php?userId=${userId}`, {
      fileId: file.file_id,
      fileDescription: newDescription,
    })
    .then((result) => {
      if (result.data.response === 'Success') {
        handleCloseFileDetailsModal();
        
      }
    })
    .catch((err) => console.log(`Erro no FileDtailsModal -> ${err}`))
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={fileDetailsModalVisible}
      onRequestClose={handleCloseFileDetailsModal}
    >
      <View style={styles(theme).fileModalView}>
        <TouchableOpacity
          style={styles(theme).modalCloseButton}
          onPress={handleCloseFileDetailsModal}
        >
          <MaterialCommunityIcons
            name="close"
            style={styles(theme).closeIcon}
          />
        </TouchableOpacity>
        <Text style={styles(theme).title}>{file.file_name}</Text>
        {file.file_type === "video" ? (
          <Video
            ref={video}
            style={styles(theme).video}
            source={{
              uri: encodeURI(`${libraryBaseUrl}/${userId}/${file.file_name}`),
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        ) : file.file_type === "image" ? (
          <Image
            style={styles(theme).image}
            source={{ uri: `${libraryBaseUrl}/${userId}/${file.file_name}` }}
          />
          ) 
          :
            <Image
            style={styles(theme).image}
            source={DocumentImage}
            />
          }

        <TextInput
          style={styles(theme).textInput}
          value={newDescription}
          onChangeText={setNewDescription}
          placeholder="Descrição do documento."
          multiline
        />

        <View style={styles(theme).buttonsView}>
          <TouchableOpacity
            style={styles(theme).editDescriptionButton}
            onPress={updateDescription}
          >
            <Text
              style={styles(theme).textButton}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              Salvar Descrição
            </Text>
          </TouchableOpacity>

          {(from === "projectCloudMovie" && projectStatus === 'Rascunho') ||
          (from === "CloudMovie" && file.isAttachedToProject && projectStatus === 'Rascunho') ? (
            <TouchableOpacity
              style={styles(theme).DetachButton}
              onPress={handleDetachFile}
            >
              <Text
                style={styles(theme).textButton}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                Remover do Projeto
              </Text>
            </TouchableOpacity>
          ) : projectId  && projectStatus === 'Rascunho' ? (
            <TouchableOpacity
              style={styles(theme).AttachButton}
              onPress={handleAttachFile}
            >
              <Text
                style={styles(theme).textButton}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                Adicionar ao Projeto
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    fileModalView: {
      position: "absolute",
      bottom: 0,
      height: "75%",
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
      height: 250,
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
      flex: 3,
      alignSelf: "center",
      width: "100%",
      height: 250,
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
  });
