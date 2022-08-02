import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Container,
  Content,
  TitleRow,
  TitleWrapper,
  Title,
  Subtitle,
} from "./styles";

import { Rating, AirbnbRating } from 'react-native-ratings';
import { ButtonCustom } from "../ButtonCustom";



interface SceneModalProps {
  handleCloseApproveModal: () => void;
  approveModalIsVisible: boolean;
  handleApproveProject: (stars: number) => void;
  setStars: (stars: number) => void;
}

export function ApproveModal({
  handleApproveProject,
  handleCloseApproveModal,
  setStars,
  approveModalIsVisible,
}: SceneModalProps) {
  const theme = useTheme();
  const video = React.useRef(null);

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      // visible={sceneModalVisible}
      // onRequestClose={handleCloseSceneModal}
    >
      <Container style={styles(theme).fileModalView}>
        <TouchableOpacity
          style={styles(theme).modalCloseButton}
          onPress={handleCloseApproveModal}
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
              <Title>Por favor, avalie o vídeo do editor</Title>
              <Subtitle>Preencha de 1 a 5 qual nota você daria para o vídeo editado.</Subtitle>
            </TitleWrapper>
          </TitleRow>

          <Rating
            type="star"
            ratingCount={5}
            imageSize={50}
            // showRating
            onFinishRating={(rating) => setStars(rating)}

          />

          <ButtonCustom
            text="Confirmar"
            backgroundColor={theme.colors.primary}
            highlightColor={theme.colors.shape}
            onPress={handleApproveProject}
          />

        </Content>
      </Container>
    </Modal>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    fileModalView: {
      position: "absolute",
      bottom: 0,
      height: "70%",
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
      width: "70%",
      padding: 10,
      alignSelf: "center",
      borderRadius: 50,
    },
  });
