import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  Keyboard,
  Text,
  Switch,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Container,
  Content,
  ContentInit,
  ContentEnd,
  TitleWrapper,
  Title,
  Subtitle,
} from "./styles";

interface CorrectModalProps {
  handleCloseCorrectModal: () => void;
  correctModalIsVisible: boolean;
  handleCorrectProject: () => void;
  setCorrectDescription: (description: string) => void;
  correctDescription: string;
  erroEdicao: boolean;
  setErroEdicao: (erro: boolean) => void;
}

export function CorrectModal({
  handleCorrectProject,
  handleCloseCorrectModal,
  setCorrectDescription,
  correctModalIsVisible,
  correctDescription,
  erroEdicao,
  setErroEdicao
}: CorrectModalProps) {
  const theme = useTheme();
  const video = React.useRef(null);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      // visible={sceneModalVisible}
      // onRequestClose={handleCloseSceneModal}
    >
      <Container style={styles(theme).fileModalView}>
        <TouchableOpacity
          style={[styles(theme).modalCloseButton]}
          onPress={handleCloseCorrectModal}
        >
          <MaterialCommunityIcons
            name="close"
            style={styles(theme).closeIcon}
          />
        </TouchableOpacity>
        <Content
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ContentInit>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={Keyboard.dismiss}
            >
              <>
                <TitleWrapper>
                  <Title>Solicitar Correção</Title>
                  <Subtitle>
                    Por favor, descreva o que você deseja alterar no vídeo.
                  </Subtitle>
                </TitleWrapper>

                <TextInput
                  style={styles(theme).textInput}
                  autoCapitalize="sentences"
                  onChangeText={setCorrectDescription}
                  maxLength={800}
                  multiline
                  value={correctDescription}
                  placeholder="Descreva aqui o que você deseja alterar no vídeo"
                  placeholderTextColor={theme.colors.primary_light}
                />
              </>
            </TouchableWithoutFeedback>
          </ContentInit>

          <ContentEnd>
            <View style={styles(theme).viewRowSwitch}>
              <Switch style={styles(theme).switch} 
                onChange={() => setErroEdicao(!erroEdicao)}
                value={erroEdicao}
              />
              <Text 
                style={styles(theme).textSwitch}
                adjustsFontSizeToFit
                numberOfLines={1}
                >
                Este erro foi do editor!
              </Text>
            </View>
            <TouchableOpacity
              style={[styles(theme).editDescriptionButton, { width: "100%" }]}
              onPress={handleCorrectProject}
            >
              <Text style={styles(theme).textButton}>Solicitar Correção</Text>
            </TouchableOpacity>
          </ContentEnd>
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
      height: "80%",
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
      paddingHorizontal: 20,
      textAlign: "center",
      width: "100%",
      height: "40%",
      alignSelf: "center",
      borderStyle: "solid",
      borderWidth: 0.5,
      borderColor: theme.colors.primary,
      borderRadius: 50,
      marginTop: 5,
      color: theme.colors.primary,
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
    viewRowSwitch: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20
    },
    switch: {
      flex: 1,
    },
    textSwitch: {
      flex: 5,
      fontFamily: theme.fonts.poppins_medium,
      color: theme.colors.primary,
    },
  });
