import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useTheme } from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Container,
  Content,
  Title,
  Subtitle
} from "./styles";

import DatePicker, { DatePickerProps } from "react-native-date-picker";


interface CalendarProps {
  dateSelected: Date;
  dateAux:DatePickerProps;
  setDateSelected: (date) => void;
  handleCloseModal: () => void;
  handleGoToCheckoutScreen: () => void;
}


export function CalendarModal({dateSelected, dateAux, setDateSelected, handleCloseModal, handleGoToCheckoutScreen}: CalendarProps) {
  const theme = useTheme();


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
            onPress={handleCloseModal}
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
            <Title>Qual a data máxima para entregarmos o seu vídeo?</Title>
            <Subtitle>Obs: O prazo mínimo é de 48h.</Subtitle>
           <DatePicker
              date={dateSelected}
              onDateChange={(date) => setDateSelected(date)}
              minimumDate={new Date(new Date().setDate(new Date().getDate() + 2))}
              onConfirm={handleGoToCheckoutScreen}
              onCancel={handleCloseModal}  
              mode="date"
              confirmText="Selecionar"
              cancelText="Voltar" 
              style={styles(theme).datePickerStyle}
           />
          </Content>
          <TouchableOpacity
            onPress={handleGoToCheckoutScreen}
            style={[styles(theme).saveButton]}
          >
            <Text style={styles(theme).textButton}>Continuar</Text>
          </TouchableOpacity>
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
      height: "60%",
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
    datePickerStyle: {
      flex: 2,
      marginTop: 20,
    },
    closeIcon: {
      fontFamily: theme.fonts.poppins_regular,
      fontSize: 30,
      color: theme.colors.text,
    },
    textButton: {
      fontFamily: theme.fonts.poppins_medium,
      fontSize: 13,
      color: theme.colors.shape,
      textAlign: "center",
    },
    saveButton: {
      width: "70%",
      padding: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
      alignSelf:"center",
      
    },
  });
