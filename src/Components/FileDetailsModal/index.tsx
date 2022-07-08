import React from "react";
import {
  Button,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
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

interface Props {
  fileDetailsModalVisible: boolean;
  handleCloseFileDetailsModal: () => void;
  file: FilesProps;
  projectId: number;
  userId: number;
}

export function FileDetailsModal({
  file,
  projectId,
  userId,
  fileDetailsModalVisible,
  handleCloseFileDetailsModal,
}: Props) {
  const theme = useTheme();

  const video = React.useRef(null);
  const [status, setStatus] = React.useState<AVPlaybackStatusToSet>({});

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
        <Text style={styles(theme).title} >{file.file_name}</Text>
        {file.file_type === 'video' ? 
          <Video
          ref={video}
          style={styles(theme).video}
          source={{
            uri: encodeURI(`https://zrgpro.com/on_app/library/${userId}/${file.file_name}`),
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        : 
          <Image style={styles(theme).image} source={{uri: `https://zrgpro.com/on_app/library/${userId}/${file.file_name}`}}/>
        }
        
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
      marginTop: 100,
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
      fontFamily: theme.fonts.poppins_semi_bold,
      fontSize: 15,
      color: theme.colors.primary,
      marginTop: 60,
      marginLeft: 20,
    },
    image: {
      marginTop: 100,
      alignSelf: "center",
      width: "90%",
      height: 250,
      resizeMode: "contain",
    }
  });
