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
} from "./styles";

import { UserDTO } from "../../dtos/UserDTO";
import { TextInputCustom } from "../TextInputCustom";
import { ButtonCustom } from "../ButtonCustom";

interface PasswordModalProps {
  handleCloseSceneModal: () => void;
  passwordModalVisible: boolean;
  user: UserDTO;
  handleChangePassword: (newPassword) => void;
  setOldPassword: (oldPassword) => void;
  setNewPassword: (newPassword) => void;
  setNewPasswordConfirmation: (newPasswordConfirmation) => void;
}

export function PasswordModal({
  handleCloseSceneModal,
  passwordModalVisible,
  handleChangePassword,
  user,
  setOldPassword,
  setNewPassword,
  setNewPasswordConfirmation,
}: PasswordModalProps) {
  const theme = useTheme();
  const video = React.useRef(null);


  const [oldPasswordSecret, setOldPasswordSecret] = useState(true);
  const [newPasswordSecret, setNewPasswordSecret] = useState(true);
  const [newPasswordConfirmationSecret, setNewPasswordConfirmationSecret] = useState(true);


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
                <Title>Alterar Senha</Title>
                <Subtitle>Vamos alterar sua senha</Subtitle>
              </TitleWrapper>
            </TitleRow>

            <TitleWrapper>
              <Title>Senha atual</Title>
              <TextInputCustom 
                text={"Digite sua senha atual"}
                onChangeText={setOldPassword}
                borderColorCustom={theme.colors.primary}
                placeholderTextColor={theme.colors.primary_light}
                style={{color: theme.colors.primary}}
                secureTextEntry={oldPasswordSecret}
                visibleButton={true}
                onVisibleButtonPress={() => setOldPasswordSecret(!oldPasswordSecret)}
                buttonColor={theme.colors.primary}
                returnKeyType="next"
                onSubmitEditing={Keyboard.dismiss}
              />
            </TitleWrapper>
           
            <TitleWrapper>
              <Title>Nova Senha</Title>
              <TextInputCustom 
                text={"Digite sua nova senha"}
                onChangeText={setNewPassword}
                borderColorCustom={theme.colors.primary}
                placeholderTextColor={theme.colors.primary_light}
                style={{color: theme.colors.primary}}
                secureTextEntry={newPasswordSecret}
                visibleButton={true}
                onVisibleButtonPress={() => setNewPasswordSecret(!newPasswordSecret)}
                buttonColor={theme.colors.primary}
                returnKeyType="next"
                onSubmitEditing={Keyboard.dismiss}
              />
            </TitleWrapper>
           
            <TitleWrapper>
              <Title>Confirmação da nova senha</Title>
              <TextInputCustom 
                text={"Confirme sua nova senha"}
                onChangeText={setNewPasswordConfirmation}
                borderColorCustom={theme.colors.primary}
                placeholderTextColor={theme.colors.primary_light}
                style={{color: theme.colors.primary}}
                secureTextEntry={newPasswordConfirmationSecret}
                visibleButton={true}
                onVisibleButtonPress={() => setNewPasswordConfirmationSecret(!newPasswordConfirmationSecret)}
                buttonColor={theme.colors.primary}
                returnKeyType="done"
                onSubmitEditing={handleChangePassword}
              />
            </TitleWrapper>


            <ButtonCustom
              text='Salvar nova senha'
              highlightColor={theme.colors.shape}
              style={{
                backgroundColor: theme.colors.primary,
                marginTop: 30,
                alignSelf: "center",
              }}
              onPress={handleChangePassword}
            />
            
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
